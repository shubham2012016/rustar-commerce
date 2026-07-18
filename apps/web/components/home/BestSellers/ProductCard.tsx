"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, ArrowRight } from "lucide-react"

import { Product } from "./types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block overflow-hidden rounded-[30px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]"
    >
      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-100/50 blur-3xl transition-all duration-500 group-hover:scale-110" />

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-5 left-5 z-20 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg">
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur transition hover:bg-blue-600 hover:text-white"
        onClick={(e) => e.preventDefault()}
      >
        <Heart size={18} />
      </button>

      {/* Image */}
      <div className="relative flex h-[290px] items-center justify-center overflow-hidden">
        <div className="absolute h-52 w-52 rounded-full bg-white shadow-[0_30px_80px_rgba(37,99,235,0.15)]" />

        <Image
          src={product.image}
          alt={product.name}
          width={320}
          height={320}
          className="relative z-10 h-[240px] w-auto object-contain drop-shadow-[0_25px_35px_rgba(15,23,42,0.22)] transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-7 pb-7">
        <p className="text-sm font-medium text-slate-500">{product.brand}</p>

        <h3 className="mt-2 text-3xl leading-tight font-extrabold text-slate-900">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-semibold">{product.rating}</span>
          </div>

          <span className="text-sm text-slate-500">
            ({product.reviews.toLocaleString()} Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-slate-900">
                ₹{product.price}
              </span>

              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                {discount}% OFF
              </span>
            </div>

            <p className="mt-1 text-lg text-slate-400 line-through">
              ₹{product.originalPrice}
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <ShoppingCart size={19} />
          Add to Cart
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Shine */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </Link>
  )
}
