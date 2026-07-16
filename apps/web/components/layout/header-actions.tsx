"use client"

import { Heart, Search, ShoppingCart, User } from "lucide-react"

export default function HeaderActions() {
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

      <button className="relative transition hover:text-blue-600">
        <ShoppingCart size={22} />

        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
          0
        </span>
      </button>
    </div>
  )
}