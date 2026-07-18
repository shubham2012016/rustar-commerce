import { ArrowRight, Sparkles } from "lucide-react"

import { bestSellerProducts } from "./bestSeller.data"
import ProductCard from "./ProductCard"

export default function BestSellers() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

      <div className="absolute top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="absolute -right-24 bottom-16 -z-10 h-80 w-80 rounded-full bg-cyan-100/30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles size={16} />
              Customer Favorites
            </div>

            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Best Selling
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Automotive Products
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Trusted by thousands of vehicle owners, workshops and professional
              detailers across India.
            </p>
          </div>

          <button className="group inline-flex items-center gap-3 self-start rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition-all hover:border-blue-200 hover:text-blue-600 hover:shadow-lg">
            View All Products
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Products */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
