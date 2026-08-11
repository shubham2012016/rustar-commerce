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
      image:
        (lineItem.thumbnail as string) ??
        ((lineItem.product as any)?.thumbnail as string) ??
        ((lineItem.product as any)?.images?.[0]?.url as string) ??
        ((lineItem.variant as any)?.product?.thumbnail as string) ??
        ((lineItem.variant as any)?.product?.images?.[0]?.url as string) ??
        "",
      price:
        typeof lineItem.unit_price === "number"
          ? lineItem.unit_price / 100
          : Number(lineItem.unit_price ?? 0) / 100,
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

        console.log("[cart] retrieveCart start", {
          cartId: state.cartId,
        })

        if (!state.cartId) {
          return
        }

        set({ loading: true, error: null })

        try {
          console.log("[cart] retrieveCart calling retrieveCart", {
            cartId: state.cartId,
          })

          const cart = await retrieveCart(state.cartId)

          // A completed Medusa cart is permanently closed.
          // Never keep it as the active storefront cart.
          if ((cart as any)?.completed_at) {
            console.log(
              "[cart] completed cart detected, resetting local cart",
              {
                cartId: state.cartId,
                completedAt: (cart as any).completed_at,
              }
            )

            set({
              cartId: null,
              items: [],
              loading: false,
              error: null,
            })

            return
          }

          set({
            items: mapCartItems(cart),
            loading: false,
          })

          console.log("[cart] retrieveCart finished", {
            cartId: state.cartId,
            itemsCount: (cart?.items as unknown[] | undefined)?.length ?? 0,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)

          // Medusa can reject operations on an already completed cart.
          // Treat that cart as invalid and start fresh.
          if (/already completed/i.test(message)) {
            console.log(
              "[cart] completed cart rejected by Medusa, resetting local cart",
              {
                cartId: state.cartId,
              }
            )

            set({
              cartId: null,
              items: [],
              loading: false,
              error: null,
            })

            return
          }

          set({
            loading: false,
            error: message || "Failed to retrieve cart.",
          })

          throw error
        }
      },

      addItem: async (item) => {
        const state = get()

        console.log("[cart] addItem start", { item, cartId: state.cartId })

        set({ loading: true, error: null })

        try {
          if (!get().cartId) {
            console.log("[cart] addItem no cartId found, creating cart")
            await get().createCartIfNeeded()
          }

          let cart

          try {
            console.log("[cart] addItem about to call addLineItem", {
              cartId: get().cartId,
              variantId: item.variantId,
              quantity: item.quantity,
            })

            cart = await addLineItem(
              get().cartId ?? "",
              item.variantId,
              item.quantity
            )
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error)

            // The old persisted cart has been completed by Medusa.
            // Discard it and retry once using a fresh cart.
            if (/already completed/i.test(message)) {
              console.log(
                "[cart] active cart is completed, creating a fresh cart"
              )

              set({
                cartId: null,
                items: [],
                error: null,
              })

              await get().createCartIfNeeded()

              cart = await addLineItem(
                get().cartId ?? "",
                item.variantId,
                item.quantity
              )
            } else {
              throw error
            }
          }

          // Map backend cart items to our UI model
          const mappedItems = mapCartItems(cart)

          // Preserve any local images for items when backend doesn't provide thumbnails.
          // Match by variantId then product id then line item id. Also prefer the
          // image that was passed to addItem (if present) to ensure the image
          // chosen on the product page is used in the cart when the backend
          // response omits thumbnails.
          const previousItems = get().items
          for (const mi of mappedItems) {
            if (!mi.image || mi.image === "") {
              // Prefer the image from the item we just added if it matches.
              if (item && (item as any).image) {
                const addedItem = item as unknown as CartItem
                if (
                  addedItem.variantId === mi.variantId ||
                  addedItem.id === mi.id
                ) {
                  mi.image = addedItem.image
                  continue
                }
              }

              if (previousItems && previousItems.length > 0) {
                const match = previousItems.find(
                  (pi) =>
                    pi.variantId === mi.variantId ||
                    pi.id === mi.id ||
                    pi.lineItemId === mi.lineItemId
                )
                if (match && match.image) {
                  mi.image = match.image
                }
              }
            }
          }

          set({ cartId: cart.id, items: mappedItems, loading: false })
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
