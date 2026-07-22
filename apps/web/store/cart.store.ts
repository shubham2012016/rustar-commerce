"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { CartItem, CartState } from "@/types"

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          console.log("ADDING TO CART:", item)
          console.log("STATE BEFORE", state.items)
          console.log("ADDING", item)
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.id === item.id && cartItem.variantId === item.variantId
          )

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id && cartItem.variantId === item.variantId
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + item.quantity,
                    }
                  : cartItem
              ),
            }
          }
          console.log("STATE AFTER", {
            items: [...state.items, item],
          })
          return {
            items: [...state.items, item],
          }
        }),

      removeItem: (id, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.variantId === variantId)
          ),
        })),

      updateQuantity: (id, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.variantId === variantId
              ? {
                  ...item,
                  quantity: Math.max(1, quantity),
                }
              : item
          ),
        })),

      clearCart: () =>
        set({
          items: [],
        }),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: "rustar-cart",
    }
  )
)
