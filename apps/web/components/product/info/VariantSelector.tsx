"use client"

import clsx from "clsx"

import { useProduct } from "@/components/product/context/ProductContext"
import { PRODUCT } from "@/data/products/product.data"

export default function VariantSelector() {
  const { selectedVariant, setSelectedVariant } = useProduct()

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Select Size</h3>

        <span className="text-sm text-slate-500">
          {PRODUCT.variants.length} Options
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {PRODUCT.variants.map((variant) => {
          const selected = selectedVariant === variant.id

          return (
            <button
              key={variant.id}
              type="button"
              disabled={!variant.inStock}
              onClick={() => setSelectedVariant(variant.id)}
              className={clsx(
                "rounded-2xl border p-5 text-center transition-all duration-300",

                selected
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "border-slate-200 bg-white hover:border-blue-400",

                !variant.inStock &&
                  "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-60"
              )}
            >
              <div className="text-lg font-bold">{variant.value}</div>

              <div className="mt-2 text-xs tracking-wider uppercase">
                {variant.inStock ? "In Stock" : "Out of Stock"}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
