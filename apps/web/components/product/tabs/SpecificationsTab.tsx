"use client"

import { useProduct } from "@/components/product/context/ProductContext"

export default function SpecificationsTab() {
  const { product } = useProduct()

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      {product.specifications.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-2 border-b border-slate-200 last:border-b-0"
        >
          <div className="bg-slate-50 p-4 font-medium text-slate-700">
            {item.label}
          </div>

          <div className="p-4 text-slate-600">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}