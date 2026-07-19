export default function CartHeader() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
        Shopping Cart
      </span>

      <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-900">
        Your Cart
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Review your selected products before proceeding to checkout.
      </p>
    </section>
  )
}