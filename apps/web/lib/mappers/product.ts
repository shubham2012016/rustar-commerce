import type { HttpTypes } from "@medusajs/types"
import type { Product } from "@/types"

export function mapProduct(product: HttpTypes.StoreProduct): Product {
  const variant = product.variants?.[0]

  const price = variant?.calculated_price?.calculated_amount ?? 0

  const compareAt = variant?.calculated_price?.original_amount ?? price

  return {
    id: product.id,

    slug: product.handle,

    name: product.title,

    shortDescription: product.subtitle ?? "",

    description: product.description ?? "",

    brand: "Rustar Chem",

    category: product.collection?.title ?? "",

    currency: "INR",

    defaultVariantId: variant?.id ?? "",

    rating: 5,

    reviewCount: 0,

    images:
      product.images?.map((image) => ({
        id: image.id,
        url: image.url,
        alt: product.title,
        isPrimary: image.url === product.thumbnail,
      })) ?? [],

    variants: [
      {
        id: variant?.id ?? "",

        sku: variant?.sku ?? "",

        name: variant?.title ?? "Default",

        value: variant?.title ?? "Default",

        price,

        compareAtPrice: compareAt,

        stock: 999,

        inStock: true,
      },
    ],

    features: [],

    specifications: [],

    faqs: [],

    reviews: [],

    ratingDistribution: [],

    tags: product.tags?.map((tag) => tag.value) ?? [],

    badges: [],
  }
}
