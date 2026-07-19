import { BadgePercent, CheckCircle2, Package } from "lucide-react"

import { PRODUCT } from "@/data/products/product.data"

export default function PriceCard() {
  const hasDiscount =
    PRODUCT.compareAtPrice && PRODUCT.compareAtPrice > PRODUCT.price

  const discount = hasDiscount
    ? Math.round(
        ((PRODUCT.compareAtPrice! - PRODUCT.price) / PRODUCT.compareAtPrice!) *
          100
      )
    : 0

  const savings = hasDiscount ? PRODUCT.compareAtPrice! - PRODUCT.price : 0

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Price */}

      <div className="flex flex-wrap items-end gap-4">
        <h2 className="text-5xl font-black tracking-tight text-slate-900">
          ₹{PRODUCT.price}
        </h2>

        {hasDiscount && (
          <span className="pb-1 text-2xl text-slate-400 line-through">
            ₹{PRODUCT.compareAtPrice}
          </span>
        )}
      </div>

      {/* Discount */}

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

      {/* Tax */}

      <p className="mt-5 text-sm text-slate-500">
        Inclusive of all applicable taxes.
      </p>

      {/* Divider */}

      <div className="my-8 h-px bg-slate-200" />

      {/* Availability */}

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <span className="font-medium text-slate-700">
            {PRODUCT.stock > 0
              ? `In Stock (${PRODUCT.stock} available)`
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
