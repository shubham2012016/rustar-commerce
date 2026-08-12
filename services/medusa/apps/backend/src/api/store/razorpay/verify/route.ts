import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import type { ICartModuleService } from "@medusajs/framework/types"

import { completeCartWorkflow } from "@medusajs/core-flows"

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

interface VerifyPaymentRequest {
  cartId: string
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

const RAZORPAY_PROVIDER_ID = "pp_razorpay_razorpay"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as VerifyPaymentRequest

  const cartId = body?.cartId?.toString().trim()

  const razorpayOrderId = body?.razorpay_order_id?.toString().trim()

  const razorpayPaymentId = body?.razorpay_payment_id?.toString().trim()

  const razorpaySignature = body?.razorpay_signature?.toString().trim()

  if (!cartId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Missing required cart or Razorpay payment fields.",
    })
  }

  const cartService = req.scope.resolve(Modules.CART) as ICartModuleService

  try {
    const cart = await cartService.retrieveCart(cartId)

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      })
    }

    if (cart.completed_at) {
      return res.status(200).json({
        success: true,
        orderId: cart.id,
        cartId,
        alreadyCompleted: true,
      })
    }

    /*
     * Retrieve the cart's payment collection and payment sessions.
     */
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "payment_collection.id",
        "payment_collection.payment_sessions.*",
      ],
      filters: {
        id: cartId,
      },
    })

    const cartWithPayment = carts?.[0]

    const paymentCollection = cartWithPayment?.payment_collection

    if (!paymentCollection?.id) {
      throw new Error("Payment collection has not been initialized for cart.")
    }

    const paymentSession = paymentCollection.payment_sessions?.find(
      (session: any) => session.provider_id === RAZORPAY_PROVIDER_ID
    )

    if (!paymentSession) {
      throw new Error("Razorpay payment session was not found for cart.")
    }

    /*
     * Store Razorpay callback data inside the Medusa
     * payment session.
     *
     * completeCartWorkflow will later pass this data
     * to RazorpayPaymentProviderService.authorizePayment().
     */
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT) as any

    await paymentModuleService.updatePaymentSession({
      id: paymentSession.id,
      currency_code: paymentSession.currency_code,
      amount: paymentSession.amount,
      data: {
        ...(paymentSession.data || {}),
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      },
    })

    console.log("[razorpay/verify] Payment session updated", {
      cartId,
      paymentSessionId: paymentSession.id,
      razorpayOrderId,
      razorpayPaymentId,
    })

    /*
     * IMPORTANT:
     *
     * completeCartWorkflow will now call
     * RazorpayPaymentProviderService.authorizePayment()
     *
     * That method performs:
     * - Razorpay payment retrieval
     * - order/payment relationship check
     * - signature verification
     * - captured/authorized status check
     */
    const { result } = await completeCartWorkflow(req.scope).run({
      input: {
        id: cartId,
      },
    })

    return res.status(200).json({
      success: true,
      orderId: result.id,
      cartId,
    })
  } catch (error: any) {
    console.error("[razorpay/verify] Failed", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    })

    return res.status(500).json({
      success: false,
      message:
        error?.message || "Failed to verify payment and complete the cart.",
    })
  }
}
