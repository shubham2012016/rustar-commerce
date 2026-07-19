export default function CheckoutPayment() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Payment Method
      </h2>

      <div className="mt-6 space-y-4">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input type="radio" defaultChecked />
          Razorpay (UPI, Card, Net Banking)
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input type="radio" />
          Cash on Delivery
        </label>
      </div>
    </section>
  )
}