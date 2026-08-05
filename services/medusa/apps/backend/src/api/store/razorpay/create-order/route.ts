import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { ICartModuleService } from "@medusajs/framework/types"
import razorpay from "../../../../lib/razorpay"

interface CreateOrderRequest {
  cartId: string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as CreateOrderRequest

  console.log("[razorpay/create-order] POST received", {
    url: req.url,
    publishableKey: req.headers["x-publishable-api-key"],
    body,
  })

  const cartId = body?.cartId?.toString().trim()

  if (!cartId) {
    return res.status(400).json({
      success: false,
      message: "cartId is required.",
    })
  }

  const cartService = req.scope.resolve("cart") as ICartModuleService

  try {
    const cart = await cartService.retrieveCart(cartId)

    console.log("========================================")
    console.log("MEDUSA CART")
    console.log(JSON.stringify(cart, null, 2))
    console.log("----------------------------------------")
    console.log("cart.total =", cart.total)
    console.log("cart.raw_total =", cart.raw_total)
    console.log("cart.currency_code =", cart.currency_code)
    console.log("typeof total =", typeof cart.total)
    console.log("typeof raw_total =", typeof cart.raw_total)
    console.log("========================================")

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      })
    }

    if (cart.completed_at) {
      return res.status(400).json({
        success: false,
        message: "Cart has already been completed.",
      })
    }

    const rawAmount = cart.raw_total ?? cart.total
    const amount = Number(rawAmount)
    const currency = (cart.currency_code ?? "INR").toString().toUpperCase()

    if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
      return res.status(400).json({
        success: false,
        message:
          "Cart total must be a positive integer amount in the smallest currency unit.",
      })
    }

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: true,
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message ?? "Failed to create Razorpay order.",
    })
  }
}
