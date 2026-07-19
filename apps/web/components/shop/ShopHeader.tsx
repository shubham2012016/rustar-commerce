export default function ShopHeader() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Rustar Chem Store
          </span>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-900">
            Shop Premium Automotive Care
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Explore our complete collection of professional bike and car care
            products designed for enthusiasts and detailing professionals.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-6 py-5">
          <p className="text-sm text-slate-500">
            Products Available
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            24
          </p>
        </div>
      </div>
    </section>
  )
}