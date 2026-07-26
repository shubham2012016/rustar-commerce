"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { WishlistState } from "@/types"

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (wishlistItem) =>
              wishlistItem.id === item.id &&
              wishlistItem.variantId === item.variantId
          )

          if (exists) {
            return state
          }

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

      toggleItem: (item) => {
        const exists = get().items.some(
          (wishlistItem) =>
            wishlistItem.id === item.id &&
            wishlistItem.variantId === item.variantId
        )

        if (exists) {
          get().removeItem(item.id, item.variantId)
        } else {
          get().addItem(item)
        }
      },

      isWishlisted: (id, variantId) =>
        get().items.some(
          (item) => item.id === id && item.variantId === variantId
        ),

      clearWishlist: () =>
        set({
          items: [],
        }),

      getItemCount: () => get().items.length,
    }),
    {
      name: "rustar-wishlist",
    }
  )
)
