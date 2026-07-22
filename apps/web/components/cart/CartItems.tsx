"use client"

import { useCartStore } from "@/store"

import CartItem from "./CartItem"

export default function CartItems() {
  const items = useCartStore((state) => state.items)

  console.log("CART ITEMS:", items)

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Your cart is empty
        </h2>

        <p className="mt-3 text-slate-500">
          Add some products to continue shopping.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <CartItem key={`${item.id}-${item.variantId}`} item={item} />
      ))}
    </div>
  )
}
