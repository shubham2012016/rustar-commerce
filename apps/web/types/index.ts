    export * from "./product"
    export * from "./cart"

    export interface WishlistItem {
  id: string
  slug: string
  sku: string
  name: string
  image: string
  price: number
  variantId: string
  variantName: string
  stock: number
}

export interface WishlistState {
  items: WishlistItem[]

  addItem: (item: WishlistItem) => void

  removeItem: (id: string, variantId: string) => void

  toggleItem: (item: WishlistItem) => void

  isWishlisted: (id: string, variantId: string) => boolean

  clearWishlist: () => void

  getItemCount: () => number
}