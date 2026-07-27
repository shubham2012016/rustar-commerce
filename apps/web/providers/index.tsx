"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useEffect, useState } from "react"

import { useAuthStore } from "@/store/auth.store"

interface Props {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient())

  const initialize = useAuthStore((state) => state.initialize)
  const initialized = useAuthStore((state) => state.initialized)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialize, initialized])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
