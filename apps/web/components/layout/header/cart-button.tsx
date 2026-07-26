"use client"

import { ShoppingBag } from "lucide-react"
import { useMemo, useState } from "react"

import { useCartStore } from "@/store/cart.store"

import CartDrawer from "./cart-drawer"

export default function CartButton() {
  const [open, setOpen] = useState(false)

  const items = useCartStore((state) => state.items)

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  return (
    <>
      <button
        type="button"
        aria-label="Shopping Cart"
        onClick={() => setOpen(true)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-orange-500 hover:text-orange-500 hover:shadow-md active:scale-95"
      >
        <ShoppingBag className="h-5 w-5" />

        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-semibold text-white">
            {itemCount}
          </span>
        )}
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
