"use client"

import Link from "next/link"

import { Heart } from "lucide-react"

import { useWishlistStore } from "@/store"

export default function WishlistButton() {
  const items = useWishlistStore((state) => state.items)

  const count = items.length

  return (
    <Link
      href="/wishlist"
      aria-label="Wishlist"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:shadow-md active:scale-95"
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          count > 0 ? "fill-red-500 text-red-500" : ""
        }`}
      />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-none font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
