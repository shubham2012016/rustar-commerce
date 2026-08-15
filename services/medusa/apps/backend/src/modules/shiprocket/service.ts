import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"

import type {
  CreateFulfillmentResult,
  CalculateShippingOptionPriceDTO,
  CalculatedShippingOptionPrice,
  FulfillmentOption,
  ValidateFulfillmentDataContext,
} from "@medusajs/framework/types"

import { ShiprocketClient } from "./client"

export type ShiprocketModuleOptions = {
  email: string
  password: string
  pickupLocation: string

  autoSchedulePickup?: boolean

  defaultWeightKg?: number
  defaultLengthCm?: number
  defaultBreadthCm?: number
  defaultHeightCm?: number
}

function extractShiprocketValue(response: any, paths: string[][]): unknown {
  for (const path of paths) {
    let current = response

    for (const key of path) {
      current = current?.[key]
    }

    if (current !== undefined && current !== null && current !== "") {
      return current
    }
  }

  return null
}

function extractShipmentId(response: any): number | null {
  const value = extractShiprocketValue(response, [
    ["shipment_id"],
    ["data", "shipment_id"],
    ["response", "data", "shipment_id"],
  ])

  const shipmentId = Number(value)

  return Number.isFinite(shipmentId) && shipmentId > 0 ? shipmentId : null
}

function extractShiprocketOrderId(response: any): string | null {
  const value = extractShiprocketValue(response, [
    ["order_id"],
    ["data", "order_id"],
    ["response", "data", "order_id"],
  ])

  return value !== null ? String(value) : null
}

function extractAwb(response: any): string | null {
  const value = extractShiprocketValue(response, [
    ["awb_code"],
    ["data", "awb_code"],
    ["response", "data", "awb_code"],
  ])

  return value !== null ? String(value) : null
}

function extractCourierName(response: any): string | null {
  const value = extractShiprocketValue(response, [
    ["courier_name"],
    ["data", "courier_name"],
    ["response", "data", "courier_name"],
  ])

  return value !== null ? String(value) : null
}

function extractLabelUrl(response: any): string | null {
  const value = extractShiprocketValue(response, [
    ["label_url"],
    ["data", "label_url"],
    ["response", "data", "label_url"],
  ])

  return value !== null ? String(value) : null
}

class ShiprocketModuleService extends AbstractFulfillmentProviderService {
  static identifier = "shiprocket"

  private client: ShiprocketClient

  private pickupLocation: string

  private autoSchedulePickup: boolean

  private defaultWeightKg: number
  private defaultLengthCm: number
  private defaultBreadthCm: number
  private defaultHeightCm: number

  constructor({ logger }: { logger: any }, options: ShiprocketModuleOptions) {
    super()

    this.client = new ShiprocketClient({
      email: options.email,
      password: options.password,
    })

    this.pickupLocation = options.pickupLocation

    this.autoSchedulePickup = options.autoSchedulePickup ?? false

    this.defaultWeightKg = options.defaultWeightKg ?? 0.5

    this.defaultLengthCm = options.defaultLengthCm ?? 20

    this.defaultBreadthCm = options.defaultBreadthCm ?? 15

    this.defaultHeightCm = options.defaultHeightCm ?? 10

    logger?.info?.(
      `[Shiprocket] Provider initialized. Pickup location: ${this.pickupLocation}`
    )
  }

  // ============================================================
  // FULFILLMENT OPTIONS
  // ============================================================

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      {
        id: "shiprocket-standard",
        name: "Shiprocket Standard",
      },
    ]
  }

  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    return data?.id === "shiprocket-standard"
  }

  async validateFulfillmentData(
    option: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): Promise<Record<string, unknown>> {
    if (option?.id !== "shiprocket-standard") {
      throw new Error("Invalid Shiprocket fulfillment option.")
    }

    return data
  }

  // ============================================================
  // SHIPPING PRICE
  // ============================================================

  async calculatePrice(
    option: CalculateShippingOptionPriceDTO["option"],
    data: CalculateShippingOptionPriceDTO["data"],
    cart: CalculateShippingOptionPriceDTO["cart"]
  ): Promise<CalculatedShippingOptionPrice> {
    // Rustar Chem currently offers FREE SHIPPING.

    return {
      calculated_amount: 0,
      is_calculated_price_tax_inclusive: true,
    }
  }

  async canCalculate(data: Record<string, unknown>): Promise<boolean> {
    return true
  }

  // ============================================================
  // CREATE FULFILLMENT
  // ============================================================

  async createFulfillment(
    data: Record<string, unknown>,
    items: any[],
    order: any,
    fulfillment: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    if (!order) {
      throw new Error(
        "Medusa order information is required for Shiprocket fulfillment."
      )
    }

    const shippingAddress = order.shipping_address ?? {}

    const billingAddress = order.billing_address ?? shippingAddress

    const customerName =
      `${shippingAddress.first_name ?? ""} ${shippingAddress.last_name ?? ""}`.trim()

    const billingCustomerName =
      `${billingAddress.first_name ?? ""} ${billingAddress.last_name ?? ""}`.trim()

    const displayOrderId = order.display_id?.toString() ?? order.id

    console.log(
      `[Shiprocket] ==================================================`
    )

    console.log(
      `[Shiprocket] Creating fulfillment for Medusa order ${displayOrderId}`
    )

    console.log(
      `[Shiprocket] Fulfillment items received:`,
      JSON.stringify(items, null, 2)
    )

    console.log(
      `[Shiprocket] Order items available:`,
      JSON.stringify(
        (order.items ?? []).map((item: any) => ({
          id: item?.id,
          title: item?.title,
          quantity: item?.quantity,
          unit_price: item?.unit_price,
          original_unit_price: item?.original_unit_price,
          variant_id: item?.variant_id,
          sku: item?.variant_sku ?? item?.sku ?? item?.variant?.sku,
        })),
        null,
        2
      )
    )

    // ============================================================
    // ORDER ITEMS
    //
    // IMPORTANT:
    // The fulfillment workflow can pass only:
    //
    //   { id, quantity }
    //
    // Therefore we resolve the authoritative price from
    // order.items using the item ID.
    // ============================================================

    const orderItems = (items ?? [])
      .map((fulfillmentItem: any) => {
        const orderItem =
          (order.items ?? []).find(
            (item: any) => item?.id === fulfillmentItem?.line_item_id
          ) ?? fulfillmentItem

        const quantity = Number(
          fulfillmentItem?.quantity ?? orderItem?.quantity ?? 0
        )

        if (!orderItem?.id || quantity <= 0) {
          return null
        }

        const unitPrice =
          Number(orderItem?.unit_price) ||
          Number(orderItem?.original_unit_price) ||
          Number(orderItem?.raw_unit_price) ||
          Number(orderItem?.price) ||
          0

        const title =
          orderItem?.title ??
          orderItem?.product_title ??
          orderItem?.variant?.product?.title ??
          "Rustar Chem Product"

        const sku =
          orderItem?.variant_sku ??
          orderItem?.sku ??
          orderItem?.variant?.sku ??
          orderItem?.variant_id ??
          `ITEM-${orderItem.id}`

        console.log(
          `[Shiprocket] Item mapping: fulfillment_item=${fulfillmentItem?.id}, line_item=${fulfillmentItem?.line_item_id}, order_item=${orderItem?.id}, price=${unitPrice}, quantity=${quantity}, sku=${sku}`
        )

        return {
          name: title,

          sku,

          units: quantity,

          selling_price: unitPrice,

          discount: Number(orderItem?.discount_total ?? 0),

          tax: Number(orderItem?.tax_total ?? 0),

          hsn: orderItem?.metadata?.hsn ?? orderItem?.hsn ?? "",
        }
      })
      .filter(Boolean)

    // ============================================================
    // VALIDATE PRICES
    // ============================================================

    const invalidPriceItem = orderItems.find(
      (item: any) =>
        !Number.isFinite(Number(item.selling_price)) ||
        Number(item.selling_price) < 0
    )

    if (invalidPriceItem) {
      throw new Error(
        `Invalid selling price detected for Shiprocket order ${displayOrderId}.`
      )
    }

    const subTotal = orderItems.reduce(
      (total: number, item: any) =>
        total + Number(item.selling_price ?? 0) * Number(item.units ?? 0),
      0
    )

    console.log(`[Shiprocket] Calculated subtotal: ₹${subTotal}`)

    // ============================================================
    // SHIPROCKET ORDER PAYLOAD
    // ============================================================

    const payload = {
      order_id: displayOrderId,

      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),

      pickup_location: (data?.pickup_location as string) ?? this.pickupLocation,

      // ----------------------------------------------------------
      // BILLING
      // ----------------------------------------------------------

      billing_customer_name:
        billingCustomerName || customerName || "Rustar Chem Customer",

      billing_last_name: billingAddress.last_name ?? "",

      billing_address: billingAddress.address_1 ?? "",

      billing_address_2: billingAddress.address_2 ?? "",

      billing_city: billingAddress.city ?? "",

      billing_pincode: billingAddress.postal_code ?? "",

      billing_state: billingAddress.province ?? "",

      billing_country:
        billingAddress.country_code === "in"
          ? "India"
          : (billingAddress.country_code ?? "India"),

      billing_email: order.email ?? "",

      billing_phone: billingAddress.phone ?? shippingAddress.phone ?? "",

      // ----------------------------------------------------------
      // SHIPPING
      // ----------------------------------------------------------

      shipping_is_billing: false,

      shipping_customer_name:
        customerName || billingCustomerName || "Rustar Chem Customer",

      shipping_last_name: shippingAddress.last_name ?? "",

      shipping_address: shippingAddress.address_1 ?? "",

      shipping_address_2: shippingAddress.address_2 ?? "",

      shipping_city: shippingAddress.city ?? "",

      shipping_pincode: shippingAddress.postal_code ?? "",

      shipping_state: shippingAddress.province ?? "",

      shipping_country:
        shippingAddress.country_code === "in"
          ? "India"
          : (shippingAddress.country_code ?? "India"),

      shipping_email: order.email ?? "",

      shipping_phone: shippingAddress.phone ?? billingAddress.phone ?? "",

      // ----------------------------------------------------------
      // ITEMS
      // ----------------------------------------------------------

      order_items: orderItems,

      // ----------------------------------------------------------
      // PAYMENT
      // ----------------------------------------------------------

      payment_method: (data?.payment_method as string) ?? "PREPAID",

      sub_total: subTotal,

      total_discount: Number(data?.total_discount ?? 0),

      // ----------------------------------------------------------
      // PACKAGE
      // ----------------------------------------------------------

      weight: Number(data?.weight) || this.defaultWeightKg,

      length: Number(data?.length) || this.defaultLengthCm,

      breadth: Number(data?.breadth) || this.defaultBreadthCm,

      height: Number(data?.height) || this.defaultHeightCm,
    }

    console.log(
      "[Shiprocket] Final create-order payload:",
      JSON.stringify(payload, null, 2)
    )

    // ============================================================
    // CREATE SHIPROCKET ORDER
    // ============================================================

    const createResponse = await this.client.createOrder(payload)

    console.log(
      "[Shiprocket] Create order response:",
      JSON.stringify(createResponse, null, 2)
    )

    const shipmentId = extractShipmentId(createResponse)

    if (!shipmentId) {
      throw new Error(
        `Shiprocket order was created but shipment_id was not returned. Response: ${JSON.stringify(
          createResponse
        )}`
      )
    }

    const shiprocketOrderId = extractShiprocketOrderId(createResponse)

    console.log(
      `[Shiprocket] Shiprocket order created. order_id=${shiprocketOrderId ?? "unknown"}, shipment_id=${shipmentId}`
    )

    // ============================================================
    // ASSIGN AWB
    // ============================================================

    const awbResponse = await this.client.assignAWB(shipmentId)

    console.log(
      "[Shiprocket] AWB assignment response:",
      JSON.stringify(awbResponse, null, 2)
    )

    const trackingNumber = extractAwb(awbResponse)

    if (!trackingNumber) {
      throw new Error(
        `Shiprocket shipment ${shipmentId} was created but AWB assignment did not return an AWB. Response: ${JSON.stringify(
          awbResponse
        )}`
      )
    }

    const courierName = extractCourierName(awbResponse)

    const trackingUrl = `https://www.shiprocket.co/tracking/${encodeURIComponent(
      trackingNumber
    )}`

    console.log(`[Shiprocket] AWB assigned: ${trackingNumber}`)

    console.log(`[Shiprocket] Courier: ${courierName ?? "Unknown"}`)

    // ============================================================
    // GENERATE LABEL
    //
    // Shiprocket requires AWB assignment before label generation.
    // ============================================================

    console.log(`[Shiprocket] Generating label for shipment ${shipmentId}`)

    const labelResponse = await this.client.generateLabel(shipmentId)

    console.log(
      "[Shiprocket] Label generation response:",
      JSON.stringify(labelResponse, null, 2)
    )

    const labelUrl = extractLabelUrl(labelResponse)

    if (!labelUrl) {
      throw new Error(
        `Shiprocket label generation completed without returning label_url for shipment ${shipmentId}. Response: ${JSON.stringify(
          labelResponse
        )}`
      )
    }

    console.log(`[Shiprocket] Label URL generated successfully: ${labelUrl}`)

    // ============================================================
    // AUTO PICKUP
    // ============================================================

    let pickupResponse: unknown = null

    if (this.autoSchedulePickup) {
      console.log(`[Shiprocket] Scheduling pickup for shipment ${shipmentId}`)

      pickupResponse = await this.client.schedulePickup(shipmentId)

      console.log(
        "[Shiprocket] Pickup response:",
        JSON.stringify(pickupResponse, null, 2)
      )
    }

    // ============================================================
    // RETURN MEDUSA FULFILLMENT DATA
    // ============================================================

    const fulfillmentData = {
      provider: "shiprocket",

      shiprocket_order_id: shiprocketOrderId,

      shipment_id: shipmentId,

      awb: trackingNumber,

      tracking_number: trackingNumber,

      tracking_url: trackingUrl,

      label_url: labelUrl,

      courier_name: courierName,

      create_order_response: createResponse,

      awb_response: awbResponse,

      label_response: labelResponse,

      pickup_response: pickupResponse,

      pickup_location: this.pickupLocation,

      auto_schedule_pickup: this.autoSchedulePickup,
    }

    console.log(
      "[Shiprocket] Final Medusa fulfillment data:",
      JSON.stringify(fulfillmentData, null, 2)
    )

    return {
      data: fulfillmentData,

      labels: [
        {
          tracking_number: trackingNumber,

          tracking_url: trackingUrl,

          label_url: labelUrl,
        },
      ],
    }
  }

  // ============================================================
  // CANCEL FULFILLMENT
  // ============================================================

  async cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any> {
    const data = fulfillment?.data as Record<string, unknown> | undefined

    const awb = data?.awb as string | undefined

    if (!awb) {
      console.warn(
        "[Shiprocket] Cannot cancel fulfillment because AWB is missing."
      )

      return
    }

    return this.client.cancelShipment(awb)
  }

  // ============================================================
  // PUBLIC HELPERS
  // ============================================================

  async authenticate() {
    return this.client.authenticate()
  }

  async createOrder(payload: Record<string, unknown>) {
    return this.client.createOrder({
      ...payload,

      pickup_location: payload.pickup_location ?? this.pickupLocation,

      weight: payload.weight ?? this.defaultWeightKg,

      length: payload.length ?? this.defaultLengthCm,

      breadth: payload.breadth ?? this.defaultBreadthCm,

      height: payload.height ?? this.defaultHeightCm,
    })
  }

  async assignAWB(shipmentId: number, courierId?: number) {
    return this.client.assignAWB(shipmentId, courierId)
  }

  async schedulePickup(shipmentId: number) {
    return this.client.schedulePickup(shipmentId)
  }

  async generateLabel(shipmentId: number) {
    return this.client.generateLabel(shipmentId)
  }

  async getShipmentDetails(shipmentId: number) {
    return this.client.getShipmentDetails(shipmentId)
  }

  async trackAWB(awb: string) {
    return this.client.trackAWB(awb)
  }

  async cancelShipment(awb: string) {
    return this.client.cancelShipment(awb)
  }

  getAutoSchedulePickup() {
    return this.autoSchedulePickup
  }
}

export default ShiprocketModuleService
