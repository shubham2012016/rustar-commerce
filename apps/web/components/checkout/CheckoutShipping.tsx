export default function CheckoutShipping() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Shipping Method
      </h2>

      <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl border border-blue-600 p-5">
        <div>
          <p className="font-semibold">Standard Delivery</p>
          <p className="text-sm text-slate-500">
            Delivery within 3–5 business days
          </p>
        </div>

        <span className="font-bold text-blue-600">
          FREE
        </span>
      </label>
    </section>
  )
}