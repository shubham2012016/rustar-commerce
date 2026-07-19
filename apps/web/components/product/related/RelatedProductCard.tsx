import Image from "next/image"
import Link from "next/link"

import { Heart, Star } from "lucide-react"

import type { Product } from "@/types"

interface RelatedProductCardProps {
  product: Product
}

export default function RelatedProductCard({
  product,
}: RelatedProductCardProps) {
  const discount =
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 
            100
        )
      : 0

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}

      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {discount > 0 && (
          <span className="absolute top-4 left-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            {discount}% OFF
          </span>
        )}

        <button
          type="button"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition hover:bg-blue-600 hover:text-white"
        >
          <Heart className="h-5 w-5" />
        </button>

        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          className="object-contain p-8 transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}

      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

          <span className="text-sm font-semibold">{product.rating}</span>

          <span className="text-sm text-slate-500">
            ({product.reviewCount})
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[56px] text-lg font-semibold text-slate-900">
          {product.name}
        </h3>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-slate-900">
            ₹{product.price}
          </span>

          <span className="text-slate-400 line-through">
            ₹{product.compareAtPrice}
          </span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="block rounded-2xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          View Product
        </Link>
      </div>
    </article>
  )
}
