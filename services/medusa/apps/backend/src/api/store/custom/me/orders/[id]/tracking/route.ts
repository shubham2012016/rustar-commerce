import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { SHIPROCKET_MODULE } from "../../../../../../../modules/shiprocket"

import ShiprocketModuleService from "../../../../../../../modules/shiprocket/service"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.auth_context?.actor_id
  const orderId = req.params.id

  if (!customerId) {
    return res.status(401).json({
      success: false,
      message: "Customer authentication required.",
    })
  }

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required.",
    })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "customer_id",
        "fulfillments.*",
        "fulfillments.labels.*",
      ],
      filters: {
        id: orderId,
        customer_id: customerId,
      },
    })

    const order = data?.[0] as any

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      })
    }

    const fulfillments = order.fulfillments ?? []

    const fulfillment = fulfillments.find((item: any) =>
      String(item?.provider_id ?? "")
        .toLowerCase()
        .includes("shiprocket")
    )

    if (!fulfillment) {
      return res.status(200).json({
        success: true,
        tracking: null,
      })
    }

    const fulfillmentData = (fulfillment.data ?? {}) as Record<string, any>

    const label = fulfillment.labels?.[0] ?? null

    const awb =
      label?.tracking_number ??
      fulfillmentData.awb ??
      fulfillmentData.tracking_number ??
      null

    const shipmentId =
      fulfillmentData.shipment_id ?? fulfillmentData.shipmentId ?? null

    const shiprocketOrderId =
      fulfillmentData.shiprocket_order_id ??
      fulfillmentData.shiprocketOrderId ??
      null

    console.log("[customer/order/tracking] Shipment data", {
      orderId,
      fulfillmentId: fulfillment.id,
      shipmentId,
      shiprocketOrderId,
      awb,
    })

    if (!awb) {
      return res.status(200).json({
        success: true,
        tracking: {
          orderId: order.display_id,
          fulfillmentId: fulfillment.id,
          provider: "shiprocket",
          shipmentId,
          shiprocketOrderId,
          awb: null,
          trackingNumber: null,
          trackingUrl: null,
          status: "processing",
          trackingData: null,
        },
      })
    }

    /*
     * Resolve the actual Shiprocket fulfillment service.
     */
    const shiprocketService =
      req.scope.resolve<ShiprocketModuleService>(SHIPROCKET_MODULE)

    /*
     * Make sure the Shiprocket client has an authenticated token
     * before requesting tracking information.
     */
    await shiprocketService.authenticate()

    /*
     * Fetch live tracking information from Shiprocket.
     */
    const trackingResponse = await shiprocketService.trackAWB(String(awb))

    console.log(
      "[customer/order/tracking] Shiprocket tracking response:",
      JSON.stringify(trackingResponse, null, 2)
    )

    const response = trackingResponse as any

    /*
     * Shiprocket responses can contain the tracking payload
     * at different nesting levels.
     */
    const trackingData =
      response?.tracking_data ??
      response?.data?.tracking_data ??
      response?.data ??
      response

    const currentStatus =
      trackingData?.shipment_status ??
      trackingData?.shipment_status_name ??
      trackingData?.status ??
      trackingData?.current_status ??
      "ready_to_ship"

    const trackingUrl =
      label?.tracking_url ??
      fulfillmentData.tracking_url ??
      `https://www.shiprocket.co/tracking/${encodeURIComponent(String(awb))}`

    return res.status(200).json({
      success: true,

      tracking: {
        orderId: order.display_id,

        fulfillmentId: fulfillment.id,

        provider: "shiprocket",

        shipmentId,

        shiprocketOrderId,

        awb: String(awb),

        trackingNumber: String(awb),

        trackingUrl,

        status: currentStatus,

        trackingData,
      },
    })
  } catch (error: any) {
    console.error("[customer/order/tracking] Failed:", error?.message || error)

    if (error?.stack) {
      console.error(error.stack)
    }

    return res.status(500).json({
      success: false,
      message: error?.message ?? "Failed to retrieve shipment tracking.",
    })
  }
}
