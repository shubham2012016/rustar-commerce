import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import {
  createPaymentCollectionForCartWorkflow,
  createPaymentSessionsWorkflow,
} from "@medusajs/core-flows"

interface CreateOrderRequest {
  cartId: string
}

const RAZORPAY_PROVIDER_ID = "pp_razorpay_razorpay"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as CreateOrderRequest

  const cartId = body?.cartId?.toString().trim()

  console.log("[razorpay/create-order] Request received", { cartId })

  if (!cartId) {
    return res.status(400).json({
      success: false,
      message: "cartId is required.",
    })
  }

  try {
    const query = req.scope.resolve("query")

    let { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "currency_code",
        "completed_at",
        "total",
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
        message: "Cart already completed.",
      })
    }

    let paymentCollection = cart.payment_collection

    if (!paymentCollection) {
      const { result } = await createPaymentCollectionForCartWorkflow(
        req.scope
      ).run({
        input: {
          cart_id: cartId,
        },
      })

      paymentCollection = result

      const refreshed = await query.graph({
        entity: "cart",
        fields: [
          "id",
          "currency_code",
          "completed_at",
          "total",
          "payment_collection.*",
          "payment_collection.payment_sessions.*",
        ],
        filters: {
          id: [cartId],
        },
      })

      carts = refreshed.data
      paymentCollection = carts?.[0]?.payment_collection
    }

    if (!paymentCollection?.id) {
      return res.status(500).json({
        success: false,
        message: "Payment collection could not be created.",
      })
    }

    let paymentSession = paymentCollection.payment_sessions?.find(
      (session: any) =>
        session.provider_id === RAZORPAY_PROVIDER_ID &&
        session.status === "pending"
    )

    if (!paymentSession) {
      const { result } = await createPaymentSessionsWorkflow(req.scope).run({
        input: {
          payment_collection_id: paymentCollection.id,
          provider_id: RAZORPAY_PROVIDER_ID,
        },
      })

      paymentSession = result
    }

    if (!paymentSession) {
      return res.status(500).json({
        success: false,
        message: "Razorpay payment session could not be created.",
      })
    }

    const data = (paymentSession.data || {}) as Record<string, any>

    const razorpayOrderId = data.razorpay_order_id

    if (!razorpayOrderId) {
      return res.status(500).json({
        success: false,
        message: "Razorpay order ID was not created.",
      })
    }

    console.log("[razorpay/create-order] Payment session ready", {
      cartId,
      paymentSessionId: paymentSession.id,
      razorpayOrderId,
      amount: paymentSession.amount,
      currency: paymentSession.currency_code || cart.currency_code,
    })

    return res.status(200).json({
      success: true,
      order: {
        id: razorpayOrderId,
        amount: Number(paymentSession.amount),
        currency: (
          paymentSession.currency_code ||
          cart.currency_code ||
          "INR"
        ).toUpperCase(),
      },
      payment_session_id: paymentSession.id,
    })
  } catch (error: any) {
    console.error("[razorpay/create-order] Failed", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    })

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create Razorpay order.",
    })
  }
}
