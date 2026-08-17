"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, ShoppingCart, Star } from "lucide-react"

import type { Product } from "@/types"

interface ShopProductCardProps {
  product: Product
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const variant = product.variants[0]

  const price = variant?.price ?? 0
  const originalPrice = variant?.compareAtPrice ?? price

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

  const image = product.images?.[0]?.url ?? "/products/car_bike_shampoo.webp"

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block overflow-hidden rounded-[28px] border border-slate-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      {/* Wishlist */}
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
        }}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-blue-600 hover:text-white"
        aria-label="Add to wishlist"
      >
        <Heart size={17} />
      </button>

      {/* Product Image */}
      <div className="relative flex h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/40">
        <div className="absolute h-48 w-48 rounded-full bg-white shadow-[0_25px_70px_rgba(37,99,235,0.12)]" />

        <Image
          src={image}
          alt={product.name}
          width={320}
          height={320}
          sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
          className="relative z-10 h-[230px] w-auto object-contain drop-shadow-[0_20px_30px_rgba(15,23,42,0.18)] transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm font-medium text-slate-500">{product.brand}</p>

        <h3 className="mt-2 line-clamp-2 text-xl leading-tight font-bold text-slate-900">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {product.shortDescription}
          </p>
        )}

        {/* Rating */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-semibold text-slate-800">
              {product.rating}
            </span>
          </div>

          <span className="text-sm text-slate-500">
            ({product.reviewCount} Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">
                ₹{price}
              </span>

              {discount > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                  {discount}% OFF
                </span>
              )}
            </div>

            {originalPrice > price && (
              <p className="mt-1 text-sm text-slate-400 line-through">
                ₹{originalPrice}
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition group-hover:bg-blue-700">
          <ShoppingCart size={17} />
          View Product
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  )
}
