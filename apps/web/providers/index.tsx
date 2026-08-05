"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useEffect, useState } from "react"

import { useAuthStore } from "@/store/auth.store"
import { useCartStore } from "@/store/cart.store"

interface Props {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient())

  const initialize = useAuthStore((state) => state.initialize)
  const initialized = useAuthStore((state) => state.initialized)

  const cartId = useCartStore((state) => state.cartId)
  const retrieveCart = useCartStore((state) => state.retrieveCart)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialize, initialized])

  useEffect(() => {
    if (cartId) {
      retrieveCart().catch(console.error)
    }
  }, [cartId, retrieveCart])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
;