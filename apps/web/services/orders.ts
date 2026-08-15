import { medusa } from "@/lib/medusa"

export type OrderTrackingActivity = {
  id: string | number | null
  date: string | null
  status: string | null
  activity: string | null
  location: string | null
}

export type CustomerOrderTracking = {
  orderId: number | string
  fulfillmentId: string
  provider: string

  shipmentId: number | string | null

  shiprocketOrderId: number | string | null

  awb: string | null

  trackingNumber: string | null

  trackingUrl: string | null

  courierName: string | null

  status: string

  statusText: string | null

  statusCode: number | null

  estimatedDeliveryDate: string | null

  activities: OrderTrackingActivity[]
}

export async function listCustomerOrders() {
  return medusa.store.order.list({
    limit: 50,

    offset: 0,

    order: "-created_at",

    fields:
      "*items,*items.product,*items.variant,*shipping_address,*shipping_methods,*fulfillments,*fulfillments.labels",
  })
}

export async function retrieveCustomerOrder(orderId: string) {
  const response = await medusa.store.order.retrieve(orderId, {
    fields:
      "*items,*items.product,*items.variant,*shipping_address,*billing_address,*shipping_methods,*fulfillments,*fulfillments.labels",
  })

  return response.order
}

export async function retrieveOrderTracking(orderId: string) {
  return medusa.client.fetch<{
    success: boolean

    tracking: CustomerOrderTracking | null

    message?: string
  }>(`/store/custom/me/orders/${encodeURIComponent(orderId)}/tracking`, {
    method: "GET",
  })
}
