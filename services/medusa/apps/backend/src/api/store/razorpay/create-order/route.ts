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
    /*
     * Step 1:
     * Create / initialize the Medusa payment collection
     * for this cart.
     */
    const { result: paymentCollection } =
      await createPaymentCollectionForCartWorkflow(req.scope).run({
        input: {
          cart_id: cartId,
        },
      })

    console.log("[razorpay/create-order] Payment collection ready", {
      cartId,
      paymentCollectionId: paymentCollection.id,
    })

    /*
     * Step 2:
     * Create the Medusa payment session.
     *
     * This invokes:
     *
     * RazorpayPaymentProviderService.initiatePayment()
     *
     * which creates the actual Razorpay order.
     */
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

    const data = paymentSession.data as Record<string, any>

    const razorpayOrderId = data?.razorpay_order_id
    const amount = Number(data?.amount ?? paymentSession.amount)
    const currency =
      data?.currency ?? paymentSession.currency_code?.toUpperCase()

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
