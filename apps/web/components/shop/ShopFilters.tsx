export default function ShopFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing <span className="font-semibold">24</span> products
      </p>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none">
        <option>Featured</option>
        <option>Newest</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Highest Rated</option>
      </select>
    </div>
  )
}