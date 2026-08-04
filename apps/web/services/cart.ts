import { medusa } from "@/lib/medusa"
import { HttpTypes } from "@medusajs/types"
import { resolveRegionId } from "@/services/region"

export type StoreCart = HttpTypes.StoreCart

/**
 * Create a new Medusa cart
 */
export async function createCart() {
  const regionId = await resolveRegionId()

  const { cart } = await medusa.store.cart.create({
    region_id: regionId,
  })

  return cart
}

/**
 * Retrieve an existing cart
 */
export async function retrieveCart(cartId: string) {
  const { cart } = await medusa.store.cart.retrieve(cartId)

  return cart
}

/**
 * Add a product variant to the cart
 */
export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
) {
  const { cart } = await medusa.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  })

  return cart
}

/**
 * Update quantity
 */
export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  // The Medusa JS SDK may return different shapes for this endpoint across
  // versions (sometimes an object with `cart`, sometimes only the
  // `line_item`). Be defensive: if `cart` is present return it, otherwise
  // retrieve the cart explicitly to get the current state.
  const result = await medusa.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  }) as any

  if (result && result.cart) {
    return result.cart as StoreCart
  }

  // Fall back to retrieving the cart when the SDK response doesn't include it.
  const { cart } = await medusa.store.cart.retrieve(cartId)
  return cart
}

/**
 * Remove product
 */
export async function removeLineItem(cartId: string, lineItemId: string) {
  const result = await medusa.store.cart.deleteLineItem(cartId, lineItemId) as any

  if (result && result.parent) {
    return result.parent as StoreCart
  }

  const { cart } = await medusa.store.cart.retrieve(cartId)
  return cart
}

/**
 * Add shipping address
 */
export async function updateAddress(
  cartId: string,
  address: HttpTypes.StoreCreateCart["shipping_address"]
) {
  const { cart } = await medusa.store.cart.update(cartId, {
    shipping_address: address,
  })

  return cart
}

/**
 * Select shipping option
 */
export async function selectShippingOption(cartId: string, optionId: string) {
  const { cart } = await medusa.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  })

  return cart
}

/**
 * Complete cart
 */
export async function completeCart(cartId: string) {
  return medusa.store.cart.complete(cartId)
}
