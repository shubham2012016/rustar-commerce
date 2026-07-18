import { Sparkles } from "lucide-react"

import CollectionCard from "./CollectionCard"
import { collections } from "./collection.data"

export default function FeaturedCollections() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

      <div className="absolute top-20 -left-20 -z-10 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="absolute -right-20 bottom-10 -z-10 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Featured Collections
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Shop by
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Collection
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Curated collections designed for every detailing requirement—from
            everyday maintenance to professional-grade automotive care.
          </p>
        </div>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CollectionCard collection={collections[0]} featured />
          </div>

          <CollectionCard collection={collections[1]} />

          <CollectionCard collection={collections[2]} />
        </div>
      </div>
    </section>
  )
}
