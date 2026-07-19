import Link from "next/link"

export default function EmptyCart() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
      <h2 className="text-3xl font-bold text-slate-900">
        Your cart is empty
      </h2>

      <p className="mt-4 text-slate-600">
        Browse our premium automotive care products and add items to your cart.
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-flex rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  )
}