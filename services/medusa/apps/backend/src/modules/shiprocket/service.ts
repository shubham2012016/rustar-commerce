import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"

import type {
  CreateFulfillmentResult,
  CalculateShippingOptionPriceDTO,
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
  ): Promise<number> {
    // Rustar Chem currently offers free shipping.
    return 0
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

    const orderItems = (items ?? []).map((item: any) => ({
      name: item.title ?? item.product_title ?? "Rustar Chem Product",

      sku: item.variant_sku ?? item.sku ?? item.variant_id ?? `ITEM-${item.id}`,

      units: Number(item.quantity ?? 1),

      selling_price: Number(item.unit_price ?? 0),

      discount: 0,

      tax: 0,

      hsn: item.metadata?.hsn ?? "",
    }))

    const subTotal = orderItems.reduce(
      (total: number, item: any) =>
        total + Number(item.selling_price ?? 0) * Number(item.units ?? 0),
      0
    )

    const payload = {
      order_id: order.display_id?.toString() ?? order.id,

      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),

      pickup_location: (data?.pickup_location as string) ?? this.pickupLocation,

      // --------------------------------------------------------
      // BILLING
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // SHIPPING
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // ITEMS
      // --------------------------------------------------------

      order_items: orderItems,

      // Razorpay-completed orders are prepaid.
      // Can be overridden later for COD.
      payment_method: (data?.payment_method as string) ?? "PREPAID",

      sub_total: subTotal,

      total_discount: Number(data?.total_discount ?? 0),

      // --------------------------------------------------------
      // PACKAGE
      // --------------------------------------------------------

      weight: Number(data?.weight ?? this.defaultWeightKg),

      length: Number(data?.length ?? this.defaultLengthCm),

      breadth: Number(data?.breadth ?? this.defaultBreadthCm),

      height: Number(data?.height ?? this.defaultHeightCm),
    }

    console.log(
      "[Shiprocket] Creating shipment:",
      JSON.stringify(payload, null, 2)
    )

    const createResponse = await this.client.createOrder(payload)

    const responseData = createResponse as any

    const shipmentId = Number(
      responseData?.shipment_id ?? responseData?.data?.shipment_id
    )

    if (!shipmentId) {
      throw new Error(
        `Shiprocket order was created but shipment_id was not returned. Response: ${JSON.stringify(
          createResponse
        )}`
      )
    }

    // ----------------------------------------------------------
    // ASSIGN AWB
    // ----------------------------------------------------------

    const awbResponse = await this.client.assignAWB(shipmentId)

    const awb =
      (awbResponse as any)?.response?.data?.awb_code ??
      (awbResponse as any)?.data?.awb_code ??
      (awbResponse as any)?.awb_code ??
      null

    // ----------------------------------------------------------
    // AUTO PICKUP
    // ----------------------------------------------------------

    let pickupResponse: unknown = null

    if (this.autoSchedulePickup) {
      pickupResponse = await this.client.schedulePickup(shipmentId)
    }

    return {
      data: {
        provider: "shiprocket",

        shiprocket_order_id:
          responseData?.order_id ?? responseData?.data?.order_id ?? null,

        shipment_id: shipmentId,

        awb: awb,

        create_order_response: createResponse,

        awb_response: awbResponse,

        pickup_response: pickupResponse,

        pickup_location: this.pickupLocation,

        auto_schedule_pickup: this.autoSchedulePickup,
      },
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

  async cancelShipment(awb: string) {
    return this.client.cancelShipment(awb)
  }

  getAutoSchedulePickup() {
    return this.autoSchedulePickup
  }
}

export default ShiprocketModuleService
