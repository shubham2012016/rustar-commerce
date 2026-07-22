"use client"

import { Star } from "lucide-react"

import { useProduct } from "@/components/product/context/ProductContext"

export default function RatingSummary() {
  const { product } = useProduct()

  const fullStars = Math.floor(product.rating)
  const hasHalfStar = product.rating % 1 >= 0.5

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-5xl font-bold tracking-tight text-slate-900">
            {product.rating.toFixed(1)}
          </p>

          <div className="mt-4 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled =
                index < fullStars || (index === fullStars && hasHalfStar)

              return (
                <Star
                  key={index}
                  className={`h-6 w-6 ${
                    filled
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              )
            })}
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Based on{" "}
            <span className="font-semibold text-slate-700">
              {product.reviewCount.toLocaleString()}
            </span>{" "}
            verified customer reviews.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-6 py-5 text-center">
          <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">
            Overall Rating
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            Excellent
          </p>
        </div>
      </div>
    </section>
  )
}