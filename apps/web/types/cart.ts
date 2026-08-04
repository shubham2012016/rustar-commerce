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

  lineItemId?: string
}

export interface CartState {
  cartId: string | null

  loading: boolean

  error: string | null

  items: CartItem[]

  createCartIfNeeded: () => Promise<void>

  addItem: (item: CartItem) => Promise<void>

  removeItem: (id: string, variantId: string) => Promise<void>

  updateQuantity: (
    id: string,
    variantId: string,
    quantity: number
  ) => Promise<void>

  retrieveCart: () => Promise<void>

  clearCart: () => void

  getSubtotal: () => number

  getItemCount: () => number
}
