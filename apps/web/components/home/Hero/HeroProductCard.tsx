import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import type { HeroProduct } from "./types"

interface HeroProductCardProps {
  product: HeroProduct
}

export default function HeroProductCard({ product }: HeroProductCardProps) {
  return (
    <Link
      href={`${ROUTES.products}/${product.slug}`}
      className="group relative block overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      {/* Glow */}

      <div className="absolute top-10 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Badge */}

      {product.badge && (
        <div className="absolute top-4 left-4 z-20">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
            {product.badge.text}
          </span>
        </div>
      )}

      {/* Image */}

      <div className="relative flex h-52 items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={180}
          height={180}
          className="h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}

      <div className="space-y-3 px-5 pb-5">
        <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Star size={15} className="fill-yellow-400 text-yellow-400" />

          <span className="font-medium text-slate-700">{product.rating}</span>

          <span>({product.reviews})</span>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-2xl font-black text-slate-900">
            ₹{product.price}
          </span>

          {product.originalPrice && (
            <span className="pb-1 text-sm text-slate-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm font-semibold text-blue-600">
            View Product
          </span>

          <ArrowRight
            size={18}
            className="text-blue-600 transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  )
}
