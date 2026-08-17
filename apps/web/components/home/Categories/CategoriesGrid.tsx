import { Sparkles } from "lucide-react"

import { getShowcaseProducts } from "@/lib/data/products"

import CategoryCard from "./CategoryCard"

export default async function CategoriesGrid() {
  const products = await getShowcaseProducts(6)

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

      <div className="absolute top-20 left-0 -z-10 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="absolute right-0 bottom-0 -z-10 h-80 w-80 rounded-full bg-cyan-100/30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Product Categories
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Find the Perfect
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Automotive Care Solution
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Explore our complete range of premium cleaning, detailing,
            lubrication and maintenance products.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <CategoryCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
