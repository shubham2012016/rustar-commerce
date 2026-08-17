import type { HttpTypes } from "@medusajs/types"

import type { Product } from "@/types"

function fromMedusaAmount(amount: number | null | undefined) {
  return Number(amount ?? 0)
}

export function mapProduct(product: HttpTypes.StoreProduct): Product {
  const variant = product.variants?.[0]

  const price = fromMedusaAmount(variant?.calculated_price?.calculated_amount)

  const compareAt = fromMedusaAmount(variant?.calculated_price?.original_amount)

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

    reviewCount: 7,

    images: product.images?.length
      ? product.images.map((image) => ({
          id: image.id,
          url: image.url,
          alt: product.title,
          isPrimary: image.url === product.thumbnail,
        }))
      : product.thumbnail
        ? [
            {
              id: `${product.id}-thumbnail`,
              url: product.thumbnail,
              alt: product.title,
              isPrimary: true,
            },
          ]
        : [],

    variants: [
      {
        id: variant?.id ?? "",

        sku: variant?.sku ?? "",

        name: variant?.title ?? "Default",

        value: variant?.title ?? "Default",

        price,

        compareAtPrice: compareAt || price,

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
