import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createOrderFulfillmentWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type OrderPlacedEvent = {
  id: string
}

const MAX_ATTEMPTS = 10
const RETRY_DELAY_MS = 1500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isShiprocketProvider(providerId: unknown) {
  return String(providerId ?? "")
    .toLowerCase()
    .includes("shiprocket")
}

export default async function orderPlacedShiprocketHandler({
  event,
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const orderId = event.data?.id

  if (!orderId) {
    console.error("[Shiprocket] Missing order ID")
    return
  }

  console.log("[Shiprocket] ==================================================")
  console.log(`[Shiprocket] Processing order ${orderId}`)

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  let order: any = null

  // ---------------------------------------------------------
  // 1. Load order
  // ---------------------------------------------------------

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await query.graph({
        entity: "order",
        fields: [
          "id",
          "display_id",
          "items.*",
          "shipping_address.*",
          "billing_address.*",
          "shipping_methods.*",
          "fulfillments.*",
        ],
        filters: {
          id: orderId,
        },
      })

      order = result.data?.[0]

      console.log(
        `[Shiprocket] Query attempt ${attempt}/${MAX_ATTEMPTS}: ${
          order ? "order found" : "order not found"
        }`
      )

      if (order) {
        const shippingMethods = order.shipping_methods ?? []
        const items = order.items ?? []

        console.log(
          `[Shiprocket] Relations: shipping_methods=${shippingMethods.length}, items=${items.length}`
        )

        if (shippingMethods.length && items.length) {
          break
        }
      }
    } catch (error: any) {
      console.error(
        `[Shiprocket] Query attempt ${attempt} failed:`,
        error?.message || error
      )
    }

    if (attempt < MAX_ATTEMPTS) {
      await sleep(RETRY_DELAY_MS)
    }
  }

  if (!order) {
    console.error(
      `[Shiprocket] Could not retrieve order ${orderId} after ${MAX_ATTEMPTS} attempts.`
    )
    return
  }

  const displayId = order.display_id ?? orderId

  console.log(
    `[Shiprocket] Order ${displayId} state:`,
    JSON.stringify(
      {
        id: order.id,
        display_id: order.display_id,
        shipping_methods: order.shipping_methods ?? [],
        items: (order.items ?? []).map((item: any) => ({
          id: item?.id,
          title: item?.title,
          quantity: item?.quantity,
        })),
        fulfillments: (order.fulfillments ?? []).map((fulfillment: any) => ({
          id: fulfillment?.id,
          provider_id: fulfillment?.provider_id,
          data: fulfillment?.data,
        })),
      },
      null,
      2
    )
  )

  // ---------------------------------------------------------
  // 2. Prevent duplicate fulfillment
  // ---------------------------------------------------------

  if (order.fulfillments?.length) {
    console.log(
      `[Shiprocket] Order ${displayId} already has a fulfillment. Skipping.`
    )
    return
  }

  // ---------------------------------------------------------
  // 3. Get shipping method
  // ---------------------------------------------------------

  const shippingMethods = order.shipping_methods ?? []

  if (!shippingMethods.length) {
    console.warn(`[Shiprocket] Order ${displayId} has no shipping method.`)
    return
  }

  const shippingMethod = shippingMethods[0]

  const shippingOptionId = shippingMethod?.shipping_option_id

  console.log(`[Shiprocket] Shipping option ID: ${shippingOptionId}`)

  if (!shippingOptionId) {
    console.warn(`[Shiprocket] Order ${displayId} has no shipping_option_id.`)
    return
  }

  // ---------------------------------------------------------
  // 4. IMPORTANT:
  //    Load shipping option separately.
  //
  //    The order query is only returning:
  //    shipping_option_id
  //
  //    We need the actual provider_id.
  // ---------------------------------------------------------

  let shippingOption: any = null

  try {
    const shippingOptionResult = await query.graph({
      entity: "shipping_option",
      fields: ["id", "name", "provider_id"],
      filters: {
        id: shippingOptionId,
      },
    })

    shippingOption = shippingOptionResult.data?.[0]

    console.log(
      `[Shiprocket] Shipping option resolved:`,
      JSON.stringify(shippingOption, null, 2)
    )
  } catch (error: any) {
    console.error(
      `[Shiprocket] Failed to resolve shipping option ${shippingOptionId}:`,
      error?.message || error
    )

    console.error(error?.stack || error)
    return
  }

  if (!shippingOption) {
    console.error(
      `[Shiprocket] Shipping option ${shippingOptionId} could not be found.`
    )
    return
  }

  const providerId = shippingOption.provider_id

  console.log(`[Shiprocket] Shipping option provider: ${providerId}`)

  // ---------------------------------------------------------
  // 5. Verify Shiprocket provider
  // ---------------------------------------------------------

  if (!isShiprocketProvider(providerId)) {
    console.log(`[Shiprocket] Order ${displayId} is not using Shiprocket.`)

    console.log(`[Shiprocket] Provider detected: ${providerId}`)

    return
  }

  console.log(
    `[Shiprocket] Order ${displayId} IS using Shiprocket provider: ${providerId}`
  )

  // ---------------------------------------------------------
  // 6. Prepare fulfillment items
  // ---------------------------------------------------------

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
    console.warn(`[Shiprocket] Order ${displayId} has no fulfillable items.`)
    return
  }

  console.log(`[Shiprocket] Fulfillment items: ${JSON.stringify(items)}`)

  // ---------------------------------------------------------
  // 7. Create Medusa fulfillment
  // ---------------------------------------------------------

  try {
    console.log(`[Shiprocket] Creating fulfillment for order ${displayId}`)

    const { result } = await createOrderFulfillmentWorkflow(container).run({
      input: {
        order_id: orderId,
        items,
      },
    })

    console.log(
      `[Shiprocket] Fulfillment created successfully for order ${displayId}`
    )

    console.log(
      `[Shiprocket] Fulfillment result:`,
      JSON.stringify(result, null, 2)
    )
  } catch (error: any) {
    console.error(
      `[Shiprocket] Fulfillment creation FAILED for order ${displayId}:`,
      error?.message || error
    )

    console.error(error?.stack || error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
