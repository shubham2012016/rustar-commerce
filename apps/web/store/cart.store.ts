"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  addLineItem,
  createCart,
  retrieveCart,
  removeLineItem,
  updateLineItem,
} from "@/services/cart"
import type { CartItem, CartState } from "@/types"

function mapCartItems(
  cart: { items?: unknown[] } | undefined | null
): CartItem[] {
  if (!cart || !Array.isArray(cart.items)) {
    return []
  }

  return cart.items.map((item) => {
    const lineItem = item as Record<string, unknown>

    console.log("================================")
    console.log("MEDUSA LINE ITEM")
    console.log(lineItem)
    console.log("thumbnail:", lineItem.thumbnail)
    console.log("metadata:", lineItem.metadata)
    console.log("variant:", lineItem.variant)
    console.log("PRODUCT OBJECT", JSON.stringify(lineItem.product, null, 2))
    console.log("================================")

    const inventoryQuantity = lineItem.inventory_quantity as number | undefined

    return {
      id:
        (lineItem.product_id as string) ??
        (lineItem.variant_id as string) ??
        (lineItem.id as string) ??
        "",
      slug:
        ((lineItem.metadata as Record<string, unknown> | undefined)?.slug as
          string | undefined) ?? "",
      sku: (lineItem.sku as string) ?? "",
      name: (lineItem.title as string) ?? "",
      image: (lineItem.thumbnail as string) ?? "",
      price: (lineItem.unit_price as number) ?? 0,
      quantity: (lineItem.quantity as number) ?? 0,
      variantId: (lineItem.variant_id as string) ?? "",
      variantName: (lineItem.title as string) ?? "",
      stock:
        inventoryQuantity == null ? Number.MAX_SAFE_INTEGER : inventoryQuantity,
      lineItemId: (lineItem.id as string) ?? "",
    }
  })
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      loading: false,
      error: null,
      items: [],

      createCartIfNeeded: async () => {
        const state = get()

        console.log("[cart] createCartIfNeeded start", { cartId: state.cartId })

        if (state.cartId) {
          return
        }

        set({ loading: true, error: null })

        try {
          console.log(
            "[cart] createCartIfNeeded resolving region and creating cart"
          )
          const cart = await createCart()
          set({ cartId: cart.id, items: mapCartItems(cart), loading: false })
          console.log("[cart] createCartIfNeeded created", { cartId: cart.id })
        } catch (error) {
          set({
            loading: false,
            error: (error as Error).message ?? "Failed to create cart.",
          })
          throw error
        }
      },

      retrieveCart: async () => {
        const state = get()

        console.log("[cart] retrieveCart start", { cartId: state.cartId })

        if (!state.cartId) {
          return
        }

        set({ loading: true, error: null })

        try {
          console.log("[cart] retrieveCart calling retrieveCart", {
            cartId: state.cartId,
          })
          const cart = await retrieveCart(state.cartId)
          set({ items: mapCartItems(cart), loading: false })
          console.log("[cart] retrieveCart finished", {
            cartId: state.cartId,
            itemsCount: (cart?.items as unknown[] | undefined)?.length ?? 0,
          })
        } catch (error) {
          set({
            loading: false,
            error: (error as Error).message ?? "Failed to retrieve cart.",
          })
          throw error
        }
      },

      addItem: async (item) => {
        const state = get()

        console.log("[cart] addItem start", { item, cartId: state.cartId })

        set({ loading: true, error: null })

        try {
          if (!state.cartId) {
            console.log("[cart] addItem no cartId found, creating cart")
            await get().createCartIfNeeded()
          }

          console.log("[cart] addItem about to call addLineItem", {
            cartId: get().cartId,
            variantId: item.variantId,
            quantity: item.quantity,
          })
          const cart = await addLineItem(
            get().cartId ?? "",
            item.variantId,
            item.quantity
          )
          set({ cartId: cart.id, items: mapCartItems(cart), loading: false })
          console.log("[cart] addItem succeeded", { cartId: cart.id })
        } catch (error) {
          set({
            loading: false,
            error: (error as Error).message ?? "Failed to add item to cart.",
          })
          console.log("[cart] addItem failed", { error })
          throw error
        }
      },

      removeItem: async (id, variantId) => {
        const state = get()
        const lineItemId = state.items.find(
          (item) => item.id === id && item.variantId === variantId
        )?.lineItemId

        console.log("[cart] removeItem start", {
          id,
          variantId,
          cartId: state.cartId,
          lineItemId,
        })

        if (!state.cartId || !lineItemId) {
          console.log(
            "[cart] removeItem missing cartId or lineItemId, aborting",
            { cartId: state.cartId, lineItemId }
          )
          return
        }

        set({ loading: true, error: null })

        try {
          console.log("[cart] removeItem calling removeLineItem", {
            cartId: state.cartId,
            lineItemId,
          })
          const cart = await removeLineItem(state.cartId, lineItemId)
          set({ items: mapCartItems(cart), loading: false })
          console.log("[cart] removeItem succeeded", { cartId: state.cartId })
        } catch (error) {
          set({
            loading: false,
            error:
              (error as Error).message ?? "Failed to remove item from cart.",
          })
          console.log("[cart] removeItem failed", { error })
          throw error
        }
      },

      updateQuantity: async (id, variantId, quantity) => {
        const state = get()
        const lineItemId = state.items.find(
          (item) => item.id === id && item.variantId === variantId
        )?.lineItemId

        console.log("[cart] updateQuantity start", {
          id,
          variantId,
          quantity,
          cartId: state.cartId,
          lineItemId,
        })

        if (!state.cartId || !lineItemId) {
          console.log(
            "[cart] updateQuantity missing cartId or lineItemId, aborting",
            { cartId: state.cartId, lineItemId }
          )
          return
        }

        set({ loading: true, error: null })

        try {
          console.log("[cart] updateQuantity calling updateLineItem", {
            cartId: state.cartId,
            lineItemId,
            quantity,
          })
          const cart = await updateLineItem(state.cartId, lineItemId, quantity)
          set({ items: mapCartItems(cart), loading: false })
          console.log("[cart] updateQuantity succeeded", {
            cartId: state.cartId,
          })
        } catch (error) {
          set({
            loading: false,
            error:
              (error as Error).message ??
              "Failed to update cart item quantity.",
          })
          console.log("[cart] updateQuantity failed", { error })
          throw error
        }
      },

      clearCart: () => set({ cartId: null, items: [], error: null }),

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
      partialize: (state) => ({
        cartId: state.cartId,
        loading: state.loading,
        error: state.error,
      }),
    }
  )
)
