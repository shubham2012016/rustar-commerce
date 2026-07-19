import { CheckCircle, Star } from "lucide-react"

import { PRODUCT } from "@/data/products/product.data"

export default function ProductHeader() {
  return (
    <section className="space-y-6">
      {/* Brand */}

      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
        <CheckCircle className="h-4 w-4 text-blue-600" />

        <span className="text-sm font-semibold text-blue-700">
          {PRODUCT.brand}
        </span>
      </div>

      {/* Product Name */}

      <h1 className="text-4xl leading-tight font-black tracking-tight text-slate-900 lg:text-5xl">
        {PRODUCT.name}
      </h1>

      {/* Short Description */}

      <p className="max-w-2xl text-lg leading-8 text-slate-600">
        {PRODUCT.shortDescription}
      </p>

      {/* Rating */}

      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="h-5 w-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        <span className="font-semibold text-slate-900">{PRODUCT.rating}</span>

        <span className="text-slate-500">
          ({PRODUCT.reviewCount.toLocaleString()} Reviews)
        </span>
      </div>

      {/* Tags */}

      <div className="flex flex-wrap gap-3">
        {PRODUCT.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
