"use client"

import Image from "next/image"
import Link from "next/link"

import type { CartItem } from "@/types"

interface Props {
  items: CartItem[]
}

export default function CheckoutSummary({ items }: Props) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

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

        <button className="mt-8 w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700">
          Pay Securely
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
