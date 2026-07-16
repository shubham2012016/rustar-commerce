import Image from "next/image"
import Link from "next/link"

import type { HeroProduct } from "./types"

interface HeroProductCardProps {
  product: HeroProduct
}

export default function HeroProductCard({
  product,
}: HeroProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}

      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {product.badge.text}
          </span>
        )}
      </div>

      {/* Content */}

      <div className="space-y-3 p-5">
        <h3 className="line-clamp-2 font-semibold">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          ⭐ {product.rating}
          <span>({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">
            ₹{product.price}
          </span>

          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}