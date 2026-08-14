import { medusa } from "@/lib/medusa"

export async function listCustomerOrders() {
  const response = await medusa.store.order.list({
    limit: 50,
    offset: 0,
    order: "-created_at",
    fields:
      "*items,*items.product,*items.variant,*shipping_address,*shipping_methods,*fulfillments,*fulfillments.labels",
  })

  return response
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
    tracking: {
      orderId: number | string
      fulfillmentId: string
      provider: string
      shipmentId: number | string | null
      shiprocketOrderId: number | string | null
      awb: string | null
      trackingNumber: string | null
      trackingUrl: string | null
      status: string
      trackingData: any
    } | null
  }>(`/store/custom/me/orders/${encodeURIComponent(orderId)}/tracking`, {
    method: "GET",
  })
}
