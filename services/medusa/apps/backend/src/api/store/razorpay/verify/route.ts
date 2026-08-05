import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { ICartModuleService } from "@medusajs/framework/types"
import { verifySignature } from "../../../../lib/payment"
import { completeCartWorkflow } from "@medusajs/core-flows"

interface VerifyPaymentRequest {
  cartId: string
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as VerifyPaymentRequest
  const cartId = body?.cartId?.toString().trim()
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  if (!cartId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Missing required cart or Razorpay payment fields.",
    })
  }

  const isValid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  )

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid Razorpay signature.",
    })
  }

  const cartService = req.scope.resolve("cart") as ICartModuleService

  try {
    const cart = await cartService.retrieveCart(cartId)

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      })
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        (error as Error).message ??
        "Failed to verify payment and complete the cart.",
    })
  }
}
