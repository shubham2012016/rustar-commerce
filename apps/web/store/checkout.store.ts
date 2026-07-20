"use client"

import { create } from "zustand"

import type { CartItem } from "@/types"

interface CheckoutState {
  items: CartItem[]

  setItems: (items: CartItem[]) => void

  clear: () => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  items: [],

  setItems: (items) => set({ items }),

  clear: () => set({ items: [] }),
}))
