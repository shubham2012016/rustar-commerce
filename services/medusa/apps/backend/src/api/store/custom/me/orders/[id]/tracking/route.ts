import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { SHIPROCKET_MODULE } from "../../../../../../../modules/shiprocket"

import ShiprocketModuleService from "../../../../../../../modules/shiprocket/service"

const STATUS_MAP: Record<number, string> = {
  1: "pending",
  2: "in_transit",
  3: "out_for_delivery",
  4: "delivered",
  5: "cancelled",

  6: "shipped",
  7: "delivered",
  8: "cancelled",
  9: "rto_initiated",
  10: "rto_delivered",
  12: "lost",
  13: "pickup_error",
  14: "rto_acknowledged",
  15: "pickup_rescheduled",
  16: "cancellation_requested",
  17: "out_for_delivery",
  18: "in_transit",
  19: "out_for_pickup",
  20: "pickup_exception",
  21: "undelivered",
  22: "delayed",
  23: "partial_delivered",
  24: "destroyed",
  25: "damaged",
  26: "fulfilled",
  27: "pickup_booked",
  38: "reached_destination_hub",
  39: "misrouted",
  40: "rto_ndr",
  41: "rto_ofd",
  42: "picked_up",
  43: "self_fulfilled",
  44: "disposed_off",
  45: "cancelled_before_dispatched",
  46: "rto_in_transit",
  47: "qc_failed",
  48: "reached_warehouse",
  49: "custom_cleared",
  50: "in_flight",
  51: "handover_to_courier",
  52: "shipment_booked",
  54: "in_transit_overseas",
  55: "connection_aligned",
  56: "reached_overseas_warehouse",
  57: "custom_cleared_overseas",
  59: "box_packing",
  60: "fc_allocated",
  61: "picklist_generated",
  62: "ready_to_pack",
  63: "packed",
  67: "fc_manifest_generated",
  68: "processed_at_warehouse",
  71: "handover_exception",
  72: "packed_exception",
  75: "rto_lock",
  76: "untraceable",
  77: "issue_related_to_recipient",
  78: "reached_back_at_seller_city",
}

function normalizeStatus(statusCode: unknown, statusText?: unknown): string {
  const numericCode = Number(statusCode)

  if (Number.isFinite(numericCode) && STATUS_MAP[numericCode]) {
    return STATUS_MAP[numericCode]
  }

  if (typeof statusText === "string" && statusText.trim()) {
    return statusText.trim().toLowerCase().replace(/\s+/g, "_")
  }

  return "shipment_created"
}

function extractTrackingData(response: any) {
  const root = response?.data ?? response

  const trackingData = root?.tracking_data ?? response?.tracking_data ?? {}

  const shipmentTrack =
    trackingData?.shipment_track?.[0] ??
    trackingData?.shipment_track ??
    root?.shipment_track?.[0] ??
    root?.shipment_track ??
    null

  const shipmentTrackActivities =
    trackingData?.shipment_track_activities ??
    root?.shipment_track_activities ??
    []

  const statusCode =
    shipmentTrack?.status_code ??
    trackingData?.shipment_status_id ??
    root?.status_code ??
    null

  const statusText =
    shipmentTrack?.current_status ??
    shipmentTrack?.status ??
    trackingData?.shipment_status ??
    root?.current_status ??
    root?.status ??
    null

  const awb =
    shipmentTrack?.awb_code ?? trackingData?.awb_code ?? root?.awb_code ?? null

  const courierName =
    shipmentTrack?.courier_name ??
    trackingData?.courier_name ??
    root?.courier_name ??
    null

  const etd =
    shipmentTrack?.edd ??
    shipmentTrack?.etd ??
    trackingData?.edd ??
    trackingData?.etd ??
    null

  return {
    awb: awb ? String(awb) : null,

    courierName: courierName ? String(courierName) : null,

    statusCode:
      statusCode !== null &&
      statusCode !== undefined &&
      Number.isFinite(Number(statusCode))
        ? Number(statusCode)
        : null,

    status: normalizeStatus(statusCode, statusText),

    statusText: typeof statusText === "string" ? statusText : null,

    estimatedDeliveryDate: etd ?? null,

    activities: Array.isArray(shipmentTrackActivities)
      ? shipmentTrackActivities.map((activity: any) => ({
          date: activity?.date ?? null,

          status: activity?.status ?? null,

          activity: activity?.activity ?? null,

          location: activity?.location ?? null,
        }))
      : [],
  }
}

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

    const storedAwb =
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
      awb: storedAwb,
    })

    /*
     * Shipment exists, but Shiprocket has
     * not assigned an AWB yet.
     */
    if (!storedAwb) {
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

          courierName: null,

          status: "shipment_created",

          statusText: "Shipment is being prepared",

          statusCode: null,

          estimatedDeliveryDate: null,

          activities: [],
        },
      })
    }

    /*
     * Resolve the Shiprocket module service.
     */
    const shiprocketService =
      req.scope.resolve<ShiprocketModuleService>(SHIPROCKET_MODULE)

    /*
     * Fetch live tracking information
     * directly from Shiprocket.
     */
    const trackingResponse = await shiprocketService.trackAWB(String(storedAwb))

    console.log(
      "[customer/order/tracking] Shiprocket tracking response:",
      JSON.stringify(trackingResponse, null, 2)
    )

    const liveTracking = extractTrackingData(trackingResponse)

    const awb = liveTracking.awb ?? String(storedAwb)

    const trackingUrl =
      label?.tracking_url ??
      fulfillmentData.tracking_url ??
      (awb
        ? `https://www.shiprocket.co/tracking/${encodeURIComponent(awb)}`
        : null)

    return res.status(200).json({
      success: true,

      tracking: {
        orderId: order.display_id,

        fulfillmentId: fulfillment.id,

        provider: "shiprocket",

        shipmentId,

        shiprocketOrderId,

        awb,

        trackingNumber: awb,

        trackingUrl,

        courierName: liveTracking.courierName,

        status: liveTracking.status,

        statusText: liveTracking.statusText,

        statusCode: liveTracking.statusCode,

        estimatedDeliveryDate: liveTracking.estimatedDeliveryDate,

        activities: liveTracking.activities,
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
