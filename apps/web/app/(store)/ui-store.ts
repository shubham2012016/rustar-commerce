import { create } from "zustand"

interface UIState {
  mobileMenuOpen: boolean
  searchOpen: boolean
  cartOpen: boolean

  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  cartOpen: false,

  setMobileMenuOpen: (open) =>
    set({ mobileMenuOpen: open }),

  setSearchOpen: (open) =>
    set({ searchOpen: open }),

  setCartOpen: (open) =>
    set({ cartOpen: open }),
}))