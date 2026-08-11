"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  createRazorpayOrder,
  loadRazorpayScript,
  verifyRazorpayPayment,
} from "@/services/payment"

import { prepareCartForCheckout } from "@/services/cart"

import { useCartStore, useCheckoutStore } from "@/store"
import type { CartItem } from "@/types"

interface Props {
  items: CartItem[]
}

export default function CheckoutSummary({ items }: Props) {
  const router = useRouter()

  const paymentMethod = useCheckoutStore((state) => state.paymentMethod)

  const address = useCheckoutStore((state) => state.address)

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

    const cartId = useCartStore.getState().cartId

    if (!cartId) {
      alert("No cart found for checkout.")
      return
    }

    if (!address) {
      alert("Please enter your shipping address.")
      return
    }

    if (
      !address.firstName ||
      !address.lastName ||
      !address.email ||
      !address.phone ||
      !address.address1 ||
      !address.city ||
      !address.state ||
      !address.postalCode
    ) {
      alert("Please complete all shipping address fields.")
      return
    }

    setLoading(true)

    try {
      await prepareCartForCheckout(cartId, {
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        address1: address.address1,
        city: address.city,
        state: address.state,
        country: address.country || "in",
        postalCode: address.postalCode,
      })

      const loaded = await loadRazorpayScript()

      if (!loaded) {
        throw new Error("Unable to load Razorpay checkout script.")
      }

      const orderResponse = await createRazorpayOrder(cartId)

      if (!orderResponse?.success || !orderResponse?.order?.id) {
        throw new Error(
          orderResponse?.message || "Failed to create Razorpay order."
        )
      }

      const Razorpay = (window as any).Razorpay

      if (!Razorpay) {
        throw new Error("Razorpay SDK is not available.")
      }

      const options = {
        key: razorpayKey,

        order_id: orderResponse.order.id,

        amount: Number(orderResponse.order.amount),

        currency: orderResponse.order.currency,

        name: "Rustar Chem",

        description: "Payment for Rustar Chem order",

        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.phone,
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
            setLoading(true)

            const verification = await verifyRazorpayPayment({
              cartId,

              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            })

            if (!verification?.success) {
              throw new Error(
                verification?.message || "Payment verification failed."
              )
            }

            setRazorpayData(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )

            // Payment succeeded and Medusa has completed the order.
            // The completed cart must never be reused.
            useCartStore.getState().clearCart()

            setLoading(false)
            router.push("/checkout/success")
          } catch (error) {
            setLoading(false)

            console.error("[checkout] Payment verification failed:", error)

            alert(
              error instanceof Error
                ? error.message
                : "Payment verification failed."
            )
          }
        },

        modal: {
          ondismiss() {
            setLoading(false)
          },
        },
      }

      const checkout = new Razorpay(options)

      checkout.on("payment.failed", (response: any) => {
        console.error("[razorpay] Payment failed:", response)

        setLoading(false)

        alert(response?.error?.description || "Razorpay payment failed.")
      })

      checkout.open()
    } catch (error) {
      setLoading(false)

      console.error("[checkout] Payment initialization failed:", error)

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start Razorpay payment."
      )
    }
  }

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
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
