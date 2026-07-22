"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Heart, Loader2, ShieldCheck, ShoppingCart, Zap } from "lucide-react"

import { useProduct } from "@/components/product/context/ProductContext"
import { useCartStore, useCheckoutStore } from "@/store"

export default function PurchaseActions() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const { product, quantity, selectedVariant } = useProduct()

  const addItem = useCartStore((state) => state.addItem)

  const setCheckoutItems = useCheckoutStore((state) => state.setItems)

  async function handleAddToCart() {
    setLoading(true)

    addItem({
      id: product.id,
      slug: product.slug,
      sku: selectedVariant.sku,
      name: product.name,
      image: product.images[0]?.url ?? "",
      price: selectedVariant.price,
      quantity,
      variantId: selectedVariant.id,
      variantName: selectedVariant.value,
      stock: selectedVariant.stock,
    })

    setLoading(false)
  }

  function handleBuyNow() {
    setCheckoutItems([
      {
        id: product.id,
        slug: product.slug,
        sku: selectedVariant.sku,
        name: product.name,
        image: product.images[0]?.url ?? "",
        price: selectedVariant.price,
        quantity,
        variantId: selectedVariant.id,
        variantName: selectedVariant.value,
        stock: selectedVariant.stock,
      },
    ])

    router.push("/checkout")
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_64px]">
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

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/35"
        >
          <Zap className="h-5 w-5" />
          Buy Now
        </button>

        <button
          type="button"
          aria-label="Add to wishlist"
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 bg-white transition-all duration-300 hover:border-red-500 hover:bg-red-50"
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <ShieldCheck className="h-5 w-5 text-emerald-600" />

        <span className="text-sm font-medium text-emerald-700">
          Secure Checkout • SSL Encrypted • Trusted Payments
        </span>
      </div>
    </section>
  )
}
