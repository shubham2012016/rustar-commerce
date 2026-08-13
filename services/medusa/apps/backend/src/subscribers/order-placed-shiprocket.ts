import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createOrderFulfillmentWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type OrderPlacedEvent = {
  id: string
}

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
        "shipping_methods.id",
        "shipping_methods.name",
        "shipping_methods.shipping_option_id",
        "shipping_methods.shipping_option.*",
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

    logger.info(
      `[Shiprocket] Order ${data.id} shipping methods resolved: ${JSON.stringify(
        order.shipping_methods ?? [],
        null,
        2
      )}`
    )

    if (order.fulfillments?.length) {
      logger.info(
        `[Shiprocket] Order ${
          order.display_id ?? order.id
        } already has a fulfillment. Skipping.`
      )
      return
    }

    /*
     * Determine which fulfillment provider is attached
     * to the shipping option selected for this order.
     */
    const shippingMethods = order.shipping_methods ?? []

    logger.info(
      `[Shiprocket] Order ${
        order.display_id ?? order.id
      } shipping methods: ${JSON.stringify(
        shippingMethods.map((method: any) => ({
          id: method?.id,
          name: method?.name,
          shipping_option_id: method?.shipping_option_id,
          provider_id: method?.provider_id,
          shipping_option_provider_id: method?.shipping_option?.provider_id,
        }))
      )}`
    )

    const shiprocketShippingMethod = shippingMethods.find((method: any) =>
      String(method?.shipping_option?.provider_id ?? "")
        .toLowerCase()
        .includes("shiprocket")
    )

    if (!shiprocketShippingMethod) {
      logger.info(
        `[Shiprocket] Order ${
          order.display_id ?? order.id
        } is not using Shiprocket. Skipping automatic fulfillment.`
      )
      return
    }

    const providerId = shiprocketShippingMethod.shipping_option?.provider_id

    logger.info(
      `[Shiprocket] Order ${
        order.display_id ?? order.id
      } is using Shiprocket provider: ${providerId}`
    )

    const items = (order.items ?? [])
      .filter((item: any) => Number(item.quantity) > 0)
      .map((item: any) => ({
        id: item.id,
        quantity: Number(item.quantity),
      }))

    if (!items.length) {
      logger.warn(
        `[Shiprocket] Order ${
          order.display_id ?? order.id
        } has no fulfillable items.`
      )
      return
    }

    logger.info(
      `[Shiprocket] Creating fulfillment for order ${
        order.display_id ?? order.id
      }`
    )

    const { result } = await createOrderFulfillmentWorkflow(container).run({
      input: {
        order_id: order.id,
        items,
      },
    })

    logger.info(
      `[Shiprocket] Fulfillment created for order ${
        order.display_id ?? order.id
      }: ${JSON.stringify(result)}`
    )
  } catch (error: any) {
    logger.error(
      `[Shiprocket] Automatic fulfillment failed for order ${
        data.id
      }: ${error?.message || error}`
    )

    if (error?.stack) {
      logger.error(error.stack)
    }
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
