export default function ShopPagination() {
  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      <button
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-600 hover:text-blue-600"
        type="button"
      >
        1
      </button>

      <button
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-600 hover:text-blue-600"
        type="button"
      >
        2
      </button>

      <button
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-600 hover:text-blue-600"
        type="button"
      >
        3
      </button>
    </div>
  )
}