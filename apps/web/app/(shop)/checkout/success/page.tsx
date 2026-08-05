"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useCheckoutStore } from "@/store"

export default function CheckoutSuccessPage() {
  const razorpayOrderId = useCheckoutStore((state) => state.razorpayOrderId)
  const razorpayPaymentId = useCheckoutStore((state) => state.razorpayPaymentId)
  const clearCheckout = useCheckoutStore((state) => state.clear)
  const router = useRouter()

  function handleContinueShopping() {
    clearCheckout()
    router.push("/")
  }

  if (!razorpayOrderId || !razorpayPaymentId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center bg-slate-50 px-6 py-24 text-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Payment status unavailable</h1>
          <p className="mt-4 text-slate-600">
            We couldn’t find your payment confirmation. If you have completed a payment, please contact support.
          </p>

          <button
            type="button"
            onClick={handleContinueShopping}
            className="mt-8 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center bg-slate-50 px-6 py-24 text-center">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Payment Successful</h1>
        <p className="mt-4 text-slate-600">
          Your payment has been verified and your order is confirmed.
        </p>

        <div className="mt-8 grid gap-4 rounded-3xl bg-slate-50 p-6 text-left text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Order ID</p>
            <p className="break-words">{razorpayOrderId}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Payment ID</p>
            <p className="break-words">{razorpayPaymentId}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinueShopping}
          className="mt-8 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    </main>
  )
}
