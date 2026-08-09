import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { completeCartWorkflow } from "@medusajs/core-flows"

import { verifySignature } from "../../../../lib/payment"

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

  try {
    const isValid = verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    )

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay signature.",
      })
    }

    const query = req.scope.resolve("query")

    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "completed_at",
        "payment_collection.*",
        "payment_collection.payment_sessions.*",
      ],
      filters: {
        id: [cartId],
      },
    })

    const cart: any = carts?.[0]

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      })
    }

    if (cart.completed_at) {
      return res.status(400).json({
        success: false,
        message: "Cart is already completed.",
      })
    }

    const sessions = cart.payment_collection?.payment_sessions || []

    let paymentSession: any = sessions.find(
      (session: any) =>
        session.provider_id === RAZORPAY_PROVIDER_ID &&
        session.data?.razorpay_order_id === razorpayOrderId
    )

    if (!paymentSession) {
      paymentSession = sessions.find(
        (session: any) =>
          session.provider_id === RAZORPAY_PROVIDER_ID &&
          session.status === "pending"
      )
    }

    if (!paymentSession) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment session not found for this cart.",
      })
    }

    const paymentModuleService = req.scope.resolve("payment") as any

    const updatedData = {
      ...(paymentSession.data || {}),
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    }

    await paymentModuleService.updatePaymentSession({
      id: paymentSession.id,
      status: paymentSession.status,
      currency_code: paymentSession.currency_code,
      amount: paymentSession.amount,
      data: updatedData,
    })

    const authorizedPayment =
      await paymentModuleService.authorizePaymentSession(paymentSession.id)

    if (!authorizedPayment) {
      throw new Error("Razorpay payment authorization failed.")
    }

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
