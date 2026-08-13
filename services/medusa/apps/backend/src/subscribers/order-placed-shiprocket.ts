import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createOrderFulfillmentWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type OrderPlacedEvent = {
  id: string
}

const MAX_ATTEMPTS = 5
const RETRY_DELAY_MS = 1000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isShiprocketProvider(providerId: unknown) {
  return String(providerId ?? "")
    .toLowerCase()
    .includes("shiprocket")
}

export default async function orderPlacedShiprocketHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const logger = container.resolve("logger")

  const orderId = data?.id

  if (!orderId) {
    logger.error(
      "[Shiprocket] order.placed event does not contain an order ID."
    )
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    logger.info(
      `[Shiprocket] Processing order ${orderId} for automatic fulfillment`
    )

    let order: any = null

    /*
     * The order.placed event can be processed before all linked
     * order relations are immediately available to the query layer.
     *
     * Retry a few times instead of permanently skipping fulfillment.
     */
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const { data: orders } = await query.graph({
        entity: "order",
        fields: [
          "id",
          "display_id",
          "email",

          "shipping_address.*",
          "billing_address.*",

          "shipping_methods.*",
          "shipping_methods.shipping_option.*",

          "items.*",

          "fulfillments.*",
        ],
        filters: {
          id: orderId,
        },
      })

      order = orders?.[0] as any

      if (!order) {
        logger.warn(
          `[Shiprocket] Attempt ${attempt}/${MAX_ATTEMPTS}: order ${orderId} not available yet.`
        )
      } else {
        const shippingMethods = order.shipping_methods ?? []
        const items = order.items ?? []

        logger.info(
          `[Shiprocket] Attempt ${attempt}/${MAX_ATTEMPTS} - Order ${
            order.display_id ?? order.id
          } state: ${JSON.stringify(
            {
              shipping_methods: shippingMethods.map((method: any) => ({
                id: method?.id,
                name: method?.name,
                shipping_option_id: method?.shipping_option_id,
                provider_id: method?.provider_id,
                shipping_option_provider_id:
                  method?.shipping_option?.provider_id,
              })),
              items: items.map((item: any) => ({
                id: item?.id,
                title: item?.title,
                quantity: item?.quantity,
              })),
              fulfillments: (order.fulfillments ?? []).map(
                (fulfillment: any) => ({
                  id: fulfillment?.id,
                })
              ),
            },
            null,
            2
          )}`
        )

        /*
         * Once both shipping methods and items are present,
         * we have enough information to continue.
         */
        if (shippingMethods.length > 0 && items.length > 0) {
          break
        }
      }

      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS)
      }
    }

    if (!order) {
      logger.error(
        `[Shiprocket] Order ${orderId} could not be retrieved after ${MAX_ATTEMPTS} attempts.`
      )
      return
    }

    /*
     * Never create a second fulfillment.
     */
    if (order.fulfillments?.length) {
      logger.info(
        `[Shiprocket] Order ${
          order.display_id ?? order.id
        } already has a fulfillment. Skipping.`
      )
      return
    }

    const shippingMethods = order.shipping_methods ?? []

    if (!shippingMethods.length) {
      logger.warn(
        `[Shiprocket] Order ${
          order.display_id ?? order.id
        } has no shipping method after ${MAX_ATTEMPTS} attempts.`
      )
      return
    }

    /*
     * Determine whether the selected shipping option belongs
     * to the Shiprocket fulfillment provider.
     */
    const shiprocketShippingMethod = shippingMethods.find((method: any) => {
      const candidates = [
        method?.provider_id,
        method?.shipping_option?.provider_id,
      ]

      return candidates.some(isShiprocketProvider)
    })

    if (!shiprocketShippingMethod) {
      logger.info(
        `[Shiprocket] Order ${
          order.display_id ?? order.id
        } is not using Shiprocket. Skipping automatic fulfillment.`
      )

      logger.info(
        `[Shiprocket] Available shipping methods: ${JSON.stringify(
          shippingMethods.map((method: any) => ({
            id: method?.id,
            name: method?.name,
            shipping_option_id: method?.shipping_option_id,
            provider_id: method?.provider_id,
            shipping_option_provider_id: method?.shipping_option?.provider_id,
          }))
        )}`
      )

      return
    }

    const providerId =
      shiprocketShippingMethod?.provider_id ??
      shiprocketShippingMethod?.shipping_option?.provider_id

    logger.info(
      `[Shiprocket] Order ${
        order.display_id ?? order.id
      } is using Shiprocket provider: ${providerId}`
    )

    /*
     * Only send positive quantities to the fulfillment workflow.
     */
    const items = (order.items ?? [])
      .map((item: any) => ({
        id: item?.id,
        quantity: Number(item?.quantity ?? 0),
      }))
      .filter(
        (item: { id?: string; quantity: number }) =>
          Boolean(item.id) && item.quantity > 0
      )

    if (!items.length) {
      logger.warn(
        `[Shiprocket] Order ${
          order.display_id ?? order.id
        } has no fulfillable items after ${MAX_ATTEMPTS} attempts.`
      )

      logger.warn(
        `[Shiprocket] Raw order items: ${JSON.stringify(order.items ?? [])}`
      )

      return
    }

    logger.info(
      `[Shiprocket] Creating Medusa fulfillment for order ${
        order.display_id ?? order.id
      } with items: ${JSON.stringify(items)}`
    )

    const { result } = await createOrderFulfillmentWorkflow(container).run({
      input: {
        order_id: order.id,
        items,
      },
    })

    logger.info(
      `[Shiprocket] Medusa fulfillment created successfully for order ${
        order.display_id ?? order.id
      }: ${JSON.stringify(result, null, 2)}`
    )
  } catch (error: any) {
    logger.error(
      `[Shiprocket] Automatic fulfillment failed for order ${orderId}: ${
        error?.message || error
      }`
    )

    if (error?.stack) {
      logger.error(error.stack)
    }
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
