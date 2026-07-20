export interface CartItem {
  id: string

  slug: string

  sku: string

  name: string

  image: string

  price: number

  quantity: number

  variantId: string

  variantName: string

  stock: number
}

export interface CartState {
  items: CartItem[]

  addItem: (item: CartItem) => void

  removeItem: (id: string, variantId: string) => void

  updateQuantity: (id: string, variantId: string, quantity: number) => void

  clearCart: () => void

  getSubtotal: () => number

  getItemCount: () => number
}
