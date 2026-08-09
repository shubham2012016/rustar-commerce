import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import type { ICartModuleService } from "@medusajs/framework/types"

import Razorpay from "razorpay"

interface CreateOrderRequest {
  cartId: string
}

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

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    console.error("[razorpay/create-order] Razorpay credentials are missing")

    return res.status(500).json({
      success: false,
      message: "Razorpay credentials are not configured on the backend.",
    })
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })

  const cartService = req.scope.resolve("cart") as ICartModuleService

  try {
    const cart: any = await cartService.retrieveCart(cartId, {
      select: ["id", "currency_code", "completed_at", "total", "raw_total"],
    })

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

    let amount = 0

    if (typeof cart.raw_total === "number") {
      amount = cart.raw_total
    } else if (typeof cart.raw_total === "string") {
      amount = Number(cart.raw_total)
    } else if (
      cart.raw_total &&
      typeof cart.raw_total === "object" &&
      "value" in cart.raw_total
    ) {
      amount = Number(cart.raw_total.value)
    } else if (typeof cart.total === "number") {
      amount = cart.total
    } else if (typeof cart.total === "string") {
      amount = Number(cart.total)
    } else if (
      cart.total &&
      typeof cart.total === "object" &&
      "numeric_" in cart.total
    ) {
      amount = Number(cart.total.numeric_)
    }

    const currency = (cart.currency_code || "INR").toUpperCase()

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid cart amount: ${amount}`,
      })
    }

    /*
     * Medusa cart total is in major currency units.
     *
     * ₹149 = 149 INR
     *
     * Razorpay requires the smallest currency unit.
     *
     * ₹149 = 14900 paise
     */
    const razorpayAmount = Math.round(amount * 100)

    console.log("[razorpay/create-order] Amount conversion", {
      cartAmount: amount,
      razorpayAmount,
      currency,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        medusa_cart_id: cartId,
      },
    })

    if (!order?.id) {
      throw new Error("Razorpay did not return an order ID.")
    }

    console.log("[razorpay/create-order] Razorpay order created", {
      cartId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    })
  } catch (error: any) {
    console.error("[razorpay/create-order] Failed", {
      name: error?.name,
      message: error?.message,
      statusCode: error?.statusCode,
    })

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create Razorpay order.",
    })
  }
}
