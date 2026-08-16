"use client"

import useEmblaCarousel from "embla-carousel-react"
import type { HttpTypes } from "@medusajs/types"

import HeroProductCard from "./HeroProductCard"
import { mapProduct } from "@/lib/mappers/product"

interface ProductCarouselProps {
  products: HttpTypes.StoreProduct[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
  })

  const heroProducts = products
    .map(mapProduct)
    .map((product) => {
      const image =
        product.images.find((image) => image.isPrimary)?.url ??
        product.images[0]?.url

      const variant = product.variants[0]

      if (!image || !variant) {
        return null
      }

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image,
        price: variant.price,
        originalPrice:
          variant.compareAtPrice && variant.compareAtPrice > variant.price
            ? variant.compareAtPrice
            : undefined,
        rating: product.rating,
        reviews: product.reviewCount,
        badge: {
          text: "Featured",
          variant: "premium" as const,
        },
      }
    })
    .filter(
      (product): product is NonNullable<typeof product> => product !== null
    )

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="-ml-2 flex">
        {heroProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-0 flex-[0_0_84%] pl-2 sm:flex-[0_0_62%] lg:flex-[0_0_33.333%]"
          >
            <div className="cursor-pointer transition-all duration-500">
              <HeroProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
