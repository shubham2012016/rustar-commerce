import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createOrderFulfillmentWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type OrderPlacedEvent = {
  id: string
}

/**
 * Automatically sends paid orders to the configured Shiprocket fulfillment
 * provider after Medusa places the order.
 *
 * This runs asynchronously so a Shiprocket outage cannot make a successful
 * Razorpay payment look like a failed checkout to the customer.
 */
export default async function orderPlacedShiprocketHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const logger = container.resolve("logger")

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "shipping_methods.shipping_option.provider_id",
        "items.id",
        "items.quantity",
        "fulfillments.id",
      ],
      filters: {
        id: data.id,
      },
    })

    const order = orders?.[0] as any

    if (!order) {
      logger.error(`[Shiprocket] Order not found: ${data.id}`)
      return
    }

    if (order.fulfillments?.length) {
      logger.info(
        `[Shiprocket] Order ${order.display_id ?? order.id} already has a fulfillment. Skipping.`
      )
      return
    }

    const shippingProviderId = order.shipping_methods?.find(
      (method: any) =>
        String(method?.shipping_option?.provider_id ?? "")
          .toLowerCase()
          .includes("shiprocket")
    )?.shipping_option?.provider_id

    if (!shippingProviderId) {
      logger.info(
        `[Shiprocket] Order ${order.display_id ?? order.id} is not using Shiprocket. Skipping automatic fulfillment.`
      )
      return
    }

    const items = (order.items ?? [])
      .filter((item: any) => Number(item.quantity) > 0)
      .map((item: any) => ({
        id: item.id,
        quantity: Number(item.quantity),
      }))

    if (!items.length) {
      logger.warn(
        `[Shiprocket] Order ${order.display_id ?? order.id} has no fulfillable items.`
      )
      return
    }

    logger.info(
      `[Shiprocket] Creating fulfillment for order ${order.display_id ?? order.id} using provider ${shippingProviderId}`
    )

    const { result } = await createOrderFulfillmentWorkflow(container).run({
      input: {
        order_id: order.id,
        items,
      },
    })

    logger.info(
      `[Shiprocket] Fulfillment created for order ${order.display_id ?? order.id}: ${JSON.stringify(result)}`
    )
  } catch (error: any) {
    logger.error(
      `[Shiprocket] Automatic fulfillment failed for order ${data.id}: ${error?.message || error}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
