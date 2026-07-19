import {
  ShopFilters,
  ShopGrid,
  ShopHeader,
  ShopPagination,
  ShopSidebar,
} from "@/components/shop"

export default function ShopPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ShopHeader />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside>
            <ShopSidebar />
          </aside>

          <div className="space-y-8">
            <ShopFilters />

            <ShopGrid />

            <ShopPagination />
          </div>
        </div>
      </section>
    </main>
  )
}