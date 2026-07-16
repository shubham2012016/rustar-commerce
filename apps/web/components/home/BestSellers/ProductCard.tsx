"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Product } from "./types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative flex h-72 items-center justify-center bg-slate-50">
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
            {product.badge}
          </span>
        )}

        <Image
          src={product.image}
          alt={product.name}
          width={260}
          height={260}
          className="object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm text-slate-500">{product.brand}</p>

          <h3 className="mt-2 text-2xl font-bold">{product.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Star size={18} className="fill-yellow-400 text-yellow-400" />

          <span className="font-medium">{product.rating}</span>

          <span className="text-slate-400">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">₹{product.price}</span>

          <span className="text-lg text-slate-400 line-through">
            ₹{product.originalPrice}
          </span>
        </div>

        <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </Link>
  )
}
