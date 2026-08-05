import type { HttpTypes } from "@medusajs/types"
import { medusa } from "@/lib/medusa"

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

export async function getProducts(
  limit = 20
): Promise<HttpTypes.StoreProduct[]> {
  try {
    const response = await medusa.store.product.list({
      limit,
    })

    return response.products as HttpTypes.StoreProduct[]
  } catch {
    return fallbackProducts.slice(0, limit)
  }
}

export async function getProduct(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  try {
    const response = await medusa.store.product.list({
      handle,
      limit: 1,
    })

    console.log("====================================")
    console.log("HANDLE:", handle)
    console.log("MEDUSA RESPONSE")
    console.dir(response, { depth: null })

    console.log("PRODUCT")
    console.dir(response.products?.[0], { depth: null })

    console.log("VARIANT")
    console.dir(response.products?.[0]?.variants?.[0], { depth: null })

    console.log("CALCULATED PRICE")
    console.dir(response.products?.[0]?.variants?.[0]?.calculated_price, {
      depth: null,
    })

    console.log("====================================")

    return (response.products[0] as HttpTypes.StoreProduct) ?? null
  } catch {
    return fallbackProducts.find((product) => product.handle === handle) ?? null
  }
}
