import type { HttpTypes } from "@medusajs/types"
import { medusa } from "@/lib/medusa"

let cachedRegionId: string | null = null

export async function resolveRegionId(): Promise<string> {
  if (cachedRegionId) {
    return cachedRegionId
  }

  const response = await medusa.store.region.list()
  const regions = response.regions as HttpTypes.StoreRegion[] | undefined

  if (!regions || regions.length === 0) {
    throw new Error(
      "No Medusa store regions are configured. Add at least one region to your Medusa backend."
    )
  }

  if (regions.length === 1) {
    cachedRegionId = regions[0].id
    return cachedRegionId
  }

  const inrRegion = regions.find(
    (region) => region.currency_code?.toLowerCase() === "inr"
  )

  if (!inrRegion) {
    throw new Error(
      "Multiple Medusa store regions exist, but no region is configured with currency_code \"inr\"."
    )
  }

  cachedRegionId = inrRegion.id
  return cachedRegionId
}
