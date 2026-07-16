"use client"

import { categories } from "./category.data"
import CategoryCard from "./CategoryCard"

export default function CategoriesGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
            Categories
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Browse by Category
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Discover premium automotive care products for every detailing need.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
