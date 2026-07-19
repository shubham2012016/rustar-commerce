export default function CheckoutAddress() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Shipping Address
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <input className="rounded-xl border border-slate-300 p-4" placeholder="First Name" />
        <input className="rounded-xl border border-slate-300 p-4" placeholder="Last Name" />
        <input className="rounded-xl border border-slate-300 p-4 md:col-span-2" placeholder="Email" />
        <input className="rounded-xl border border-slate-300 p-4 md:col-span-2" placeholder="Phone Number" />
        <textarea
          className="rounded-xl border border-slate-300 p-4 md:col-span-2"
          rows={4}
          placeholder="Full Address"
        />
        <input className="rounded-xl border border-slate-300 p-4" placeholder="City" />
        <input className="rounded-xl border border-slate-300 p-4" placeholder="PIN Code" />
      </div>
    </section>
  )
}