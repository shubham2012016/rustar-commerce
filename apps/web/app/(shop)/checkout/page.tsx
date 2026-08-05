"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import {
  CheckoutAddress,
  CheckoutHeader,
  CheckoutPayment,
  CheckoutShipping,
  CheckoutSummary,
} from "@/components/checkout"

import { useAuthStore, useCartStore, useCheckoutStore } from "@/store"

export default function CheckoutPage() {
  const router = useRouter()
  const initialized = useAuthStore((state) => state.initialized)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/login?redirect=/checkout")
    }
  }, [initialized, isAuthenticated, router])

  const cartItems = useCartStore((state) => state.items)

  const buyNowItems = useCheckoutStore((state) => state.items)

  const checkoutItems = buyNowItems.length > 0 ? buyNowItems : cartItems

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <CheckoutHeader />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <CheckoutAddress />
            <CheckoutShipping />
            <CheckoutPayment />
          </div>

          <CheckoutSummary items={checkoutItems} />
        </div>
      </section>
    </main>
  )
}
