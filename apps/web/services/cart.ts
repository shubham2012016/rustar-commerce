import { HttpTypes } from "@medusajs/types"

import { medusa } from "@/lib/medusa"
import { resolveRegionId } from "@/services/region"

export type StoreCart = HttpTypes.StoreCart

export interface CheckoutAddressInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  city: string
  state: string
  country: string
  postalCode: string
}

/**
 * Create a new Medusa cart.
 */
export async function createCart() {
  const regionId = await resolveRegionId()

  const { cart } = await medusa.store.cart.create({
    region_id: regionId,
  })

  return cart
}

/**
 * Retrieve an existing cart.
 */
export async function retrieveCart(cartId: string) {
  const { cart } = await medusa.store.cart.retrieve(cartId)

  return cart
}

/**
 * Add a product variant to the cart.
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
 * Update quantity.
 */
export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const result = (await medusa.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  })) as any

  if (result?.cart) {
    return result.cart as StoreCart
  }

  const { cart } = await medusa.store.cart.retrieve(cartId)

  return cart
}

/**
 * Remove product.
 */
export async function removeLineItem(cartId: string, lineItemId: string) {
  const result = (await medusa.store.cart.deleteLineItem(
    cartId,
    lineItemId
  )) as any

  if (result?.parent) {
    return result.parent as StoreCart
  }

  const { cart } = await medusa.store.cart.retrieve(cartId)

  return cart
}

/**
 * Update the cart's shipping address and email.
 */
export async function updateCheckoutAddress(
  cartId: string,
  address: CheckoutAddressInput
) {
  const { cart } = await medusa.store.cart.update(cartId, {
    email: address.email,
    shipping_address: {
      first_name: address.firstName,
      last_name: address.lastName,
      address_1: address.address1,
      city: address.city,
      province: address.state,
      country_code: address.country.toLowerCase(),
      postal_code: address.postalCode,
      phone: address.phone,
    },
  })

  return cart
}

/**
 * Add shipping option to the cart.
 */
export async function selectShippingOption(cartId: string, optionId: string) {
  const { cart } = await medusa.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  })

  return cart
}

/**
 * Prepare the cart for checkout.
 *
 * Saves the shipping address and makes sure that a shipping
 * method is actually attached to the Medusa cart.
 */
export async function prepareCartForCheckout(
  cartId: string,
  address: CheckoutAddressInput
) {
  let cart: any = await updateCheckoutAddress(cartId, address)

  const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
    cart_id: cartId,
  })

  if (!shipping_options?.length) {
    throw new Error(
      "No shipping option is configured for this cart. Configure a shipping option in Medusa Admin."
    )
  }

  const currentShippingMethods = cart?.shipping_methods ?? []

  if (!currentShippingMethods.length) {
    const preferredOption =
      shipping_options.find((option: any) =>
        String(option.name ?? "")
          .toLowerCase()
          .includes("standard")
      ) ?? shipping_options[0]

    cart = await selectShippingOption(cartId, preferredOption.id)
  }

  return cart
}

/**
 * Complete cart.
 */
export async function completeCart(cartId: string) {
  return medusa.store.cart.complete(cartId)
}
