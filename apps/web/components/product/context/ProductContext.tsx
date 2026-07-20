"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { Product } from "@/types"

interface ProductContextValue {
  product: Product

  selectedVariant: string
  setSelectedVariant: (variantId: string) => void

  quantity: number
  setQuantity: (quantity: number) => void
}

const ProductContext = createContext<ProductContextValue | null>(null)

interface ProductProviderProps {
  product: Product
  children: ReactNode
}

export function ProductProvider({ product, children }: ProductProviderProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]?.id ?? ""
  )

  const [quantity, setQuantity] = useState(1)

  const value = useMemo(
    () => ({
      product,
      selectedVariant,
      setSelectedVariant,
      quantity,
      setQuantity,
    }),
    [product, selectedVariant, quantity]
  )

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error("useProduct must be used inside ProductProvider")
  }

  return context
}
