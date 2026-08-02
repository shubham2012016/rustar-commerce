import type { HttpTypes } from "@medusajs/types"
import { medusa } from "@/lib/medusa"

export async function getProducts(
  limit = 20
): Promise<HttpTypes.StoreProduct[]> {
  const response = await medusa.store.product.list({
    limit,
  })

  return response.products as HttpTypes.StoreProduct[]
}

export async function getProduct(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  const response = await medusa.store.product.list({
    handle,
    limit: 1,
  })

  return (response.products[0] as HttpTypes.StoreProduct) ?? null
}
