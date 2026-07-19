import { CategoryGrid, CategoryHero } from "@/components/category"

export default function CategoriesPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <CategoryHero />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <CategoryGrid />
      </section>
    </main>
  )
}