"use client"

import { useState } from "react"

import { Heart, Loader2, ShoppingCart, ShieldCheck, Zap } from "lucide-react"

export default function PurchaseActions() {
  const [loading, setLoading] = useState(false)

  async function handleAddToCart() {
    setLoading(true)

    // TODO:
    // Connect Zustand Cart Store

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLoading(false)
  }

  function handleBuyNow() {
    // TODO:
    // Checkout Flow
  }

  return (
    <section className="space-y-5">
      {/* Buttons */}

      <div className="grid gap-4 md:grid-cols-[1fr_1fr_64px]">
        {/* Add To Cart */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white font-semibold text-slate-900 transition-all duration-300 hover:border-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </button>

        {/* Buy Now */}

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/35"
        >
          <Zap className="h-5 w-5" />
          Buy Now
        </button>

        {/* Wishlist */}

        <button
          type="button"
          aria-label="Add to wishlist"
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 bg-white transition-all duration-300 hover:border-red-500 hover:bg-red-50"
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>

      {/* Secure Checkout */}

      <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <ShieldCheck className="h-5 w-5 text-emerald-600" />

        <span className="text-sm font-medium text-emerald-700">
          Secure Checkout • SSL Encrypted • Trusted Payments
        </span>
      </div>
    </section>
  )
}
