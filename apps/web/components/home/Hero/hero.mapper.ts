import type { HttpTypes } from "@medusajs/types"

import type { HeroProduct } from "./types"

export function mapMedusaProductToHeroProduct(
  product: HttpTypes.StoreProduct
): HeroProduct | null {
  const variant = product.variants?.[0]

  if (!variant) {
    return null
  }

  const image = product.thumbnail ?? product.images?.[0]?.url

  if (!image) {
    return null
  }

  const calculatedPrice = variant.calculated_price?.calculated_amount

  const originalPrice = variant.calculated_price?.original_amount

  if (calculatedPrice == null) {
    return null
  }

  return {
    id: product.id,

    name: product.title,

    slug: product.handle,

    image,

    price: Number(calculatedPrice),

    originalPrice:
      originalPrice != null && Number(originalPrice) > Number(calculatedPrice)
        ? Number(originalPrice)
        : undefined,

    // Until your review system is connected,
    // don't invent review numbers.
    rating: 0,

    reviews: 0,

    badge: {
      text: "Featured",
      variant: "premium",
    },
  }
}
