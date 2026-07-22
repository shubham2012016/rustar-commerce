"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { Product, ProductVariant } from "@/types"

interface ProductContextValue {
  product: Product

  selectedVariant: ProductVariant
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
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.defaultVariantId || product.variants[0]?.id || ""
  )

  const [quantity, setQuantity] = useState(1)

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    product.variants[0]

  const value = useMemo(
    () => ({
      product,
      selectedVariant,
      setSelectedVariant: setSelectedVariantId,
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
