import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

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

  console.log("[razorpay/create-order] Request received", {
    cartId,
  })

  if (!cartId) {
    return res.status(400).json({
      success: false,
      message: "cartId is required.",
    })
  }

  try {
    /**
     * ---------------------------------------------------------
     * STEP 1: Check whether the cart already has a payment
     * collection.
     * ---------------------------------------------------------
     */
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "currency_code",
        "total",
        "payment_collection.*",
        "payment_collection.payment_sessions.*",
      ],
      filters: {
        id: cartId,
      },
    })

    if (!carts?.length) {
      return res.status(404).json({
        success: false,
        message: `Cart ${cartId} not found.`,
      })
    }

    const cart = carts[0] as any

    console.log("[razorpay/create-order] Cart loaded", {
      cartId: cart.id,
      total: cart.total,
      currency: cart.currency_code,
      existingPaymentCollection: cart.payment_collection?.id || null,
      existingPaymentSessions:
        cart.payment_collection?.payment_sessions?.length || 0,
    })

    /**
     * ---------------------------------------------------------
     * STEP 2:
     * Reuse the existing payment collection if one already
     * exists.
     *
     * Only create a new payment collection when the cart
     * doesn't have one.
     * ---------------------------------------------------------
     */
    let paymentCollection: any = cart.payment_collection

    if (!paymentCollection?.id) {
      console.log(
        "[razorpay/create-order] No payment collection found. Creating one..."
      )

      const { result } = await createPaymentCollectionForCartWorkflow(
        req.scope
      ).run({
        input: {
          cart_id: cartId,
        },
      })

      paymentCollection = result

      console.log("[razorpay/create-order] Payment collection created", {
        paymentCollectionId: paymentCollection.id,
      })
    } else {
      console.log(
        "[razorpay/create-order] Reusing existing payment collection",
        {
          paymentCollectionId: paymentCollection.id,
        }
      )
    }

    /**
     * ---------------------------------------------------------
     * STEP 3:
     * If a Razorpay payment session already exists and contains
     * a Razorpay order ID, reuse it.
     *
     * This prevents duplicate Razorpay orders if the frontend
     * calls this endpoint more than once.
     * ---------------------------------------------------------
     */
    const existingSessions = paymentCollection.payment_sessions || []

    const existingRazorpaySession = existingSessions.find(
      (session: any) =>
        session?.provider_id === RAZORPAY_PROVIDER_ID &&
        session?.data?.razorpay_order_id
    )

    if (existingRazorpaySession) {
      const data = existingRazorpaySession.data as Record<string, any>

      const razorpayOrderId = data?.razorpay_order_id
      const amount = Number(
        data?.amount ??
          existingRazorpaySession.amount ??
          paymentCollection.amount
      )

      const currency =
        data?.currency ??
        existingRazorpaySession.currency_code?.toUpperCase() ??
        cart.currency_code?.toUpperCase()

      console.log(
        "[razorpay/create-order] Reusing existing Razorpay payment session",
        {
          paymentSessionId: existingRazorpaySession.id,
          razorpayOrderId,
          amount,
          currency,
        }
      )

      return res.status(200).json({
        success: true,
        order: {
          id: razorpayOrderId,
          amount,
          currency,
        },
        paymentSessionId: existingRazorpaySession.id,
        paymentCollectionId: paymentCollection.id,
      })
    }

    /**
     * ---------------------------------------------------------
     * STEP 4:
     * No usable Razorpay session exists.
     *
     * Create a new payment session inside the EXISTING
     * payment collection.
     * ---------------------------------------------------------
     */
    console.log("[razorpay/create-order] Creating Razorpay payment session", {
      paymentCollectionId: paymentCollection.id,
      providerId: RAZORPAY_PROVIDER_ID,
    })

    const { result: paymentSession } = await createPaymentSessionsWorkflow(
      req.scope
    ).run({
      input: {
        payment_collection_id: paymentCollection.id,
        provider_id: RAZORPAY_PROVIDER_ID,
      },
    })

    console.log("[razorpay/create-order] Payment session created", {
      cartId,
      paymentSessionId: paymentSession.id,
      providerId: paymentSession.provider_id,
      data: paymentSession.data,
    })

    /**
     * ---------------------------------------------------------
     * STEP 5:
     * Extract Razorpay order information.
     * ---------------------------------------------------------
     */
    const data = paymentSession.data as Record<string, any>

    const razorpayOrderId = data?.razorpay_order_id

    const amount = Number(
      data?.amount ?? paymentSession.amount ?? paymentCollection.amount
    )

    const currency =
      data?.currency ??
      paymentSession.currency_code?.toUpperCase() ??
      cart.currency_code?.toUpperCase()

    if (!razorpayOrderId) {
      throw new Error(
        "Razorpay order ID was not returned by the payment provider."
      )
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(
        `Invalid Razorpay payment amount returned by provider: ${amount}`
      )
    }

    if (!currency) {
      throw new Error("Payment currency was not returned by provider.")
    }

    /**
     * ---------------------------------------------------------
     * STEP 6:
     * Return Razorpay order information to frontend.
     * ---------------------------------------------------------
     */
    return res.status(200).json({
      success: true,
      order: {
        id: razorpayOrderId,
        amount,
        currency,
      },
      paymentSessionId: paymentSession.id,
      paymentCollectionId: paymentCollection.id,
    })
  } catch (error: any) {
    console.error("[razorpay/create-order] Failed", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    })

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create Razorpay payment session.",
    })
  }
}
