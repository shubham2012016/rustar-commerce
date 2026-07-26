import type { HttpTypes } from "@medusajs/types"
import { medusa } from "@/lib/medusa"

const fields =
  "*variants.calculated_price,*variants.inventory_quantity,+variants"

export async function getProducts(
  limit = 20
): Promise<HttpTypes.StoreProduct[]> {
  const response = await medusa.store.product.list({
    limit,
    fields,
  })

  return response.products as HttpTypes.StoreProduct[]
}

export async function getProduct(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  const response = await medusa.store.product.list({
    handle,
    limit: 1,
    fields,
  })

  return (response.products[0] as HttpTypes.StoreProduct) ?? null
}
