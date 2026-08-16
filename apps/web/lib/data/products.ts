import type { HttpTypes } from "@medusajs/types"
import { medusa } from "@/lib/medusa"
import { resolveRegionId } from "@/services/region"

const fallbackProducts = [
  {
    id: "1",
    title: "Car Shampoo",
    subtitle: "Premium foam wash for daily vehicle care.",
    description:
      "A gentle, high-foam shampoo designed to lift dirt and road grime while keeping paintwork glossy.",
    handle: "car-shampoo",
    thumbnail: "/products/car-shampoo/1.webp",
    collection: { title: "Car Care" },
    images: [
      {
        id: "car-shampoo-image",
        url: "/products/car-shampoo/1.webp",
      },
    ],
    variants: [
      {
        id: "car-shampoo-default",
        title: "Default",
        sku: "RUSTAR-CAR-SHAMPOO",
        calculated_price: {
          calculated_amount: 299,
          original_amount: 349,
        },
      },
    ],
    tags: [{ value: "car-care" }],
  },
  {
    id: "2",
    title: "Bike Shampoo",
    subtitle: "Foaming cleaner for motorcycles and scooters.",
    description:
      "A bike-safe wash formula made for regular cleaning of painted, plastic, and metal surfaces.",
    handle: "bike-shampoo",
    thumbnail: "/products/bike-shampoo/1.webp",
    collection: { title: "Bike Care" },
    images: [
      {
        id: "bike-shampoo-image",
        url: "/products/bike-shampoo/1.webp",
      },
    ],
    variants: [
      {
        id: "bike-shampoo-default",
        title: "Default",
        sku: "RUSTAR-BIKE-SHAMPOO",
        calculated_price: {
          calculated_amount: 249,
          original_amount: 299,
        },
      },
    ],
    tags: [{ value: "bike-care" }],
  },
  {
    id: "3",
    title: "Chain Lube",
    subtitle: "Long-lasting lubrication for motorcycle chains.",
    description:
      "A protective chain lubricant built to reduce friction and support smoother rides.",
    handle: "chain-lube",
    thumbnail: "/products/chain-lubricant/1.webp",
    collection: { title: "Lubricants" },
    images: [
      {
        id: "chain-lube-image",
        url: "/products/chain-lubricant/1.webp",
      },
    ],
    variants: [
      {
        id: "chain-lube-default",
        title: "Default",
        sku: "RUSTAR-CHAIN-LUBE",
        calculated_price: {
          calculated_amount: 199,
          original_amount: 249,
        },
      },
    ],
    tags: [{ value: "lubricant" }],
  },
  {
    id: "4",
    title: "Dashboard Polish",
    subtitle: "Clean matte finish for interiors.",
    description:
      "An interior polish that refreshes dashboards and trims without leaving a greasy feel.",
    handle: "dashboard-polish",
    thumbnail: "/products/dashboard-polish/1.webp",
    collection: { title: "Interior Care" },
    images: [
      {
        id: "dashboard-polish-image",
        url: "/products/dashboard-polish/1.webp",
      },
    ],
    variants: [
      {
        id: "dashboard-polish-default",
        title: "Default",
        sku: "RUSTAR-DASHBOARD-POLISH",
        calculated_price: {
          calculated_amount: 179,
          original_amount: 229,
        },
      },
    ],
    tags: [{ value: "interior-care" }],
  },
] as unknown as HttpTypes.StoreProduct[]

/**
 * Products explicitly assigned to the "Hero Products" collection
 * in Medusa Admin.
 *
 * This function intentionally has NO fallback products.
 * The homepage Hero should only show products controlled by Medusa.
 */
export async function getHeroProducts(
  limit = 3
): Promise<HttpTypes.StoreProduct[]> {
  try {
    const regionId = await resolveRegionId()

    const collectionResponse = await medusa.store.collection.list({
      handle: "hero-products",
      limit: 1,
    })

    const collection = collectionResponse.collections?.[0]

    if (!collection) {
      console.warn(
        'Hero Products collection with handle "hero-products" was not found.'
      )

      return []
    }

    const response = await medusa.store.product.list({
      limit,
      collection_id: collection.id,
      region_id: regionId,
    })

    return response.products as HttpTypes.StoreProduct[]
  } catch (error) {
    console.error("getHeroProducts failed:", error)

    return []
  }
}

/**
 * General product listing.
 *
 * Used by sections such as Best Sellers and product listings.
 * Existing fallback behavior is intentionally preserved.
 */
export async function getProducts(
  limit = 20
): Promise<HttpTypes.StoreProduct[]> {
  try {
    const regionId = await resolveRegionId()

    const response = await medusa.store.product.list({
      limit,
      region_id: regionId,
    })

    return response.products as HttpTypes.StoreProduct[]
  } catch (error) {
    console.error("getProducts failed:", error)

    return fallbackProducts.slice(0, limit)
  }
}

/**
 * Fetch a single product using its Medusa handle.
 *
 * This powers dynamic product routing:
 *
 * /products/[slug]
 *        ↓
 * getProduct(slug)
 *        ↓
 * Medusa product.handle
 */
export async function getProduct(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  try {
    const regionId = await resolveRegionId()

    const response = await medusa.store.product.list({
      handle,
      limit: 1,
      region_id: regionId,
    })

    return (response.products?.[0] as HttpTypes.StoreProduct) ?? null
  } catch (error) {
    console.error("getProduct failed:", error)

    return fallbackProducts.find((product) => product.handle === handle) ?? null
  }
}
