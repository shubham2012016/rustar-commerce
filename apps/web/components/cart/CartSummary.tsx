import Link from "next/link"

export default function CartSummary() {
  return (
    <aside className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

      <div className="mt-8 space-y-5">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹798</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        <div className="flex justify-between">
          <span>GST</span>
          <span>₹0</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹798</span>
        </div>

        <Link
          href="/checkout"
          className="mt-8 block w-full rounded-2xl bg-blue-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </aside>
  )
}
