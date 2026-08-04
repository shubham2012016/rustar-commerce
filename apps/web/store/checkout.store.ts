"use client"

import { create } from "zustand"

import type { CartItem } from "@/types"

export type PaymentMethod = "razorpay" | "cod"

interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  country: string
  postalCode: string
}

interface CheckoutState {
  items: CartItem[]

  address: Address | null

  paymentMethod: PaymentMethod

  loading: boolean

  razorpayOrderId: string | null

  razorpayPaymentId: string | null

  razorpaySignature: string | null

  setItems: (items: CartItem[]) => void

  setAddress: (address: Address) => void

  setPaymentMethod: (method: PaymentMethod) => void

  setLoading: (loading: boolean) => void

  setRazorpayData: (
    orderId: string,
    paymentId: string,
    signature: string
  ) => void

  clear: () => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  items: [],

  address: null,

  paymentMethod: "razorpay",

  loading: false,

  razorpayOrderId: null,

  razorpayPaymentId: null,

  razorpaySignature: null,

  setItems: (items) => set({ items }),

  setAddress: (address) => set({ address }),

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  setLoading: (loading) => set({ loading }),

  setRazorpayData: (razorpayOrderId, razorpayPaymentId, razorpaySignature) =>
    set({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    }),

  clear: () =>
    set({
      items: [],
      address: null,
      paymentMethod: "razorpay",
      loading: false,
      razorpayOrderId: null,
      razorpayPaymentId: null,
      razorpaySignature: null,
    }),
}))
