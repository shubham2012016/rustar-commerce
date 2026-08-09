"use client"

import { useCheckoutStore } from "@/store"

export default function CheckoutPayment() {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod)

  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod)

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>

      <p className="mt-2 text-sm text-slate-500">
        Select your preferred payment option.
      </p>

      <div className="mt-6 space-y-4">
        <label
          className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
            paymentMethod === "razorpay"
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 hover:border-blue-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "razorpay"}
            onChange={() => setPaymentMethod("razorpay")}
            className="h-5 w-5"
          />

          <div>
            <h3 className="font-semibold text-slate-900">Razorpay</h3>

            <p className="text-sm text-slate-500">
              UPI, Credit Card, Debit Card, Net Banking & Wallets
            </p>
          </div>
        </label>

        <label
          className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
            paymentMethod === "cod"
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 hover:border-blue-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
            className="h-5 w-5"
          />

          <div>
            <h3 className="font-semibold text-slate-900">Cash on Delivery</h3>

            <p className="text-sm text-slate-500">
              Pay when your order is delivered.
            </p>
          </div>
        </label>
      </div>
    </section>
  )
}
  