"use client"

import { create } from "zustand"

import type { LoginInput, RegisterInput } from "@/lib/auth"

import {
  getCustomer,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
} from "@/lib/auth"

export interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

interface AuthState {
  customer: Customer | null

  isAuthenticated: boolean

  loading: boolean

  initialized: boolean

  setCustomer: (customer: Customer | null) => void

  setLoading: (loading: boolean) => void

  register: (data: RegisterInput) => Promise<void>

  login: (data: LoginInput) => Promise<void>

  logout: () => Promise<void>

  refreshCustomer: () => Promise<void>

  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,

  isAuthenticated: false,

  loading: false,

  initialized: false,

  setCustomer: (customer) =>
    set({
      customer,
      isAuthenticated: !!customer,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  register: async (data) => {
    set({ loading: true })

    try {
      await registerCustomer(data)

      const customer = await getCustomer()

      set({
        customer,
        isAuthenticated: !!customer,
      })
    } finally {
      set({
        loading: false,
      })
    }
  },

  login: async (data) => {
    set({
      loading: true,
    })

    try {
      const customer = await loginCustomer(data)

      set({
        customer,
        isAuthenticated: true,
      })
    } finally {
      set({
        loading: false,
      })
    }
  },

  logout: async () => {
    set({
      loading: true,
    })

    try {
      await logoutCustomer()

      set({
        customer: null,
        isAuthenticated: false,
      })
    } finally {
      set({
        loading: false,
      })
    }
  },

  refreshCustomer: async () => {
    const customer = await getCustomer()

    set({
      customer,
      isAuthenticated: !!customer,
    })
  },

  initialize: async () => {
    try {
      const customer = await getCustomer()

      set({
        customer,
        isAuthenticated: !!customer,
        initialized: true,
      })
    } catch {
      set({
        initialized: true,
      })
    }
  },
}))
