"use client"

import { CheckCircle2 } from "lucide-react"

import { useProduct } from "@/components/product/context/ProductContext"

export default function FeaturesTab() {
  const { product } = useProduct()

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {product.features.map((feature) => (
        <div
          key={feature.title}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />

          <div>
            <h4 className="font-semibold text-slate-900">{feature.title}</h4>

            <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
