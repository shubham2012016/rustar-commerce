"use client"

import { BadgePercent, CheckCircle2, Package } from "lucide-react"

import { useProduct } from "@/components/product/context/ProductContext"

export default function PriceCard() {
  const { selectedVariant } = useProduct()

  const hasDiscount =
    selectedVariant.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price

  const discount = hasDiscount
    ? Math.round(
        ((selectedVariant.compareAtPrice! - selectedVariant.price) /
          selectedVariant.compareAtPrice!) *
          100
      )
    : 0

  const savings = hasDiscount
    ? selectedVariant.compareAtPrice! - selectedVariant.price
    : 0

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <h2 className="text-5xl font-black tracking-tight text-slate-900">
          ₹{selectedVariant.price}
        </h2>

        {hasDiscount && (
          <span className="pb-1 text-2xl text-slate-400 line-through">
            ₹{selectedVariant.compareAtPrice}
          </span>
        )}
      </div>

      {hasDiscount && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
            <BadgePercent className="h-4 w-4 text-emerald-700" />

            <span className="text-sm font-semibold text-emerald-700">
              Save ₹{savings}
            </span>
          </div>

          <div className="rounded-full bg-red-100 px-4 py-2">
            <span className="text-sm font-bold text-red-700">
              {discount}% OFF
            </span>
          </div>
        </div>
      )}

      <p className="mt-5 text-sm text-slate-500">
        Inclusive of all applicable taxes.
      </p>

      <div className="my-8 h-px bg-slate-200" />

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <span className="font-medium text-slate-700">
            {selectedVariant.stock > 0
              ? `In Stock (${selectedVariant.stock} available)`
              : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-blue-600" />

          <span className="text-slate-700">
            Free shipping on eligible orders.
          </span>
        </div>
      </div>
    </section>
  )
}
