"use client"

import Link from "next/link"

import { Heart, Search, ShoppingCart, User } from "lucide-react"

import { useCartStore } from "@/store"

export default function HeaderActions() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )

  return (
    <div className="flex items-center gap-5">
      <button className="transition hover:text-blue-600">
        <Search size={22} />
      </button>

      <button className="transition hover:text-blue-600">
        <Heart size={22} />
      </button>

      <button className="transition hover:text-blue-600">
        <User size={22} />
      </button>

      <Link href="/cart" className="relative transition hover:text-blue-600">
        <ShoppingCart size={22} />

        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-medium text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Link>
    </div>
  )
}
