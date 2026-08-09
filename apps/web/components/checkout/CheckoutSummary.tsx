"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  createRazorpayOrder,
  loadRazorpayScript,
  verifyRazorpayPayment,
} from "@/services/payment"
import { useCartStore, useCheckoutStore } from "@/store"
import type { CartItem } from "@/types"

interface Props {
  items: CartItem[]
}

export default function CheckoutSummary({ items }: Props) {
  const router = useRouter()
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod)
  const loading = useCheckoutStore((state) => state.loading)
  const setLoading = useCheckoutStore((state) => state.setLoading)
  const setRazorpayData = useCheckoutStore((state) => state.setRazorpayData)

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const isRazorpay = paymentMethod === "razorpay"
  const buttonLabel = isRazorpay
    ? "Pay Securely"
    : "Cash on Delivery not available"

  async function handlePayment() {
    if (!isRazorpay || items.length === 0) {
      return
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    if (!razorpayKey) {
      alert("Razorpay public key is not configured.")
      return
    }

    setLoading(true)

    try {
      const loaded = await loadRazorpayScript()

      if (!loaded) {
        throw new Error("Unable to load Razorpay checkout script.")
      }

      const cartId = useCartStore.getState().cartId

      if (!cartId) {
        throw new Error("No cart found for checkout.")
      }

      const orderResponse = await createRazorpayOrder(cartId)

      if (!orderResponse.success) {
        throw new Error("Failed to create Razorpay order.")
      }

      const Razorpay = (window as any).Razorpay

      if (!Razorpay) {
        throw new Error("Razorpay SDK is not available.")
      }
      console.log("NEXT_PUBLIC_RAZORPAY_KEY_ID =", razorpayKey)
      console.log("ORDER RESPONSE =", orderResponse)
      const options = {
        key: razorpayKey,
        order_id: orderResponse.order.id,
        amount: Number(orderResponse.order.amount),
        currency: orderResponse.order.currency,
        name: "Rustar Commerce",
        description: "Complete your payment securely",

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#2563eb",
        },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          try {
            const cartId = useCartStore.getState().cartId

            if (!cartId) {
              throw new Error("Cart ID missing.")
            }

            const verification = await verifyRazorpayPayment({
              cartId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (!verification.success) {
              throw new Error(verification.message)
            }

            setRazorpayData(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )

            setLoading(false)
            router.push("/checkout/success")
          } catch (error) {
            setLoading(false)
            console.error(error)
            alert((error as Error).message)
          }
        },
        modal: {
          ondismiss() {
            console.log("Checkout dismissed")
            setLoading(false)
          },
        },
      }
      console.log(
        JSON.stringify(
          {
            key: options.key,
            amount: options.amount,
            currency: options.currency,
            order_id: options.order_id,
            name: options.name,
            description: options.description,
          },
          null,
          2
        )
      )
      console.log({
        key: options.key,
        order_id: options.order_id,
        amount: options.amount,
        currency: options.currency,
      })
      console.log("======================================")
      const checkout = new Razorpay(options)
      checkout.open()
    } catch (error) {
      setLoading(false)
      console.error(error)
      alert((error as Error).message ?? "Unable to start Razorpay payment.")
    }
  }

  return (
    <aside className="sticky top-24 self-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

        <p className="mt-2 text-sm text-slate-500">
          {totalItems} Item{totalItems !== 1 && "s"}
        </p>
      </div>

      <div className="space-y-5 p-8">
        {items.map((item) => (
          <div key={`${item.id}-${item.variantId}`} className="flex gap-4">
            <div className="relative h-16 w-16 rounded-xl bg-slate-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                {item.name}
              </h3>

              <p className="text-xs text-slate-500">
                {item.variantName} × {item.quantity}
              </p>
            </div>

            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 p-8">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-medium text-green-600">FREE</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹0</span>
          </div>

          <div className="mt-5 flex justify-between border-t pt-5 text-xl font-bold">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
          <p>✓ Secure Payments</p>
          <p>✓ Free Shipping</p>
          <p>✓ Customer Support</p>
        </div>

        <button
          type="button"
          disabled={!isRazorpay || loading || items.length === 0}
          onClick={handlePayment}
          className="mt-8 w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : buttonLabel}
        </button>

        <Link
          href="/cart"
          className="mt-5 block text-center text-sm text-slate-500 hover:text-blue-600"
        >
          ← Back to Cart
        </Link>
      </div>
    </aside>
  )
}
