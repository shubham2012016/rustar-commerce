import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { ICartModuleService } from "@medusajs/framework/types"
import Razorpay from "razorpay"
import fs from "node:fs"
import path from "node:path"

interface CreateOrderRequest {
  cartId: string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  console.log("========================================")
  console.log("Creating Razorpay client directly...")
  console.log({
    key: process.env.RAZORPAY_KEY_ID,
    secretLength: process.env.RAZORPAY_KEY_SECRET?.length,
  })
  console.log("========================================")

  console.log("========================================")
  console.log("Loading .env manually...")
  console.log("========================================")

  const envText = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8")

  const ENV: Record<string, string> = {}

  for (const line of envText.split("\n")) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue

    const i = line.indexOf("=")

    ENV[line.substring(0, i).trim()] = line.substring(i + 1).trim()
  }

  console.log({
    processKey: process.env.RAZORPAY_KEY_ID,
    fileKey: ENV.RAZORPAY_KEY_ID,

    processSecretLength: process.env.RAZORPAY_KEY_SECRET?.length,
    fileSecretLength: ENV.RAZORPAY_KEY_SECRET?.length,

    processKeyCodes: [...(process.env.RAZORPAY_KEY_ID ?? "")].map((c) =>
      c.charCodeAt(0)
    ),
    fileKeyCodes: [...(ENV.RAZORPAY_KEY_ID ?? "")].map((c) => c.charCodeAt(0)),

    processSecretCodes: [...(process.env.RAZORPAY_KEY_SECRET ?? "")].map((c) =>
      c.charCodeAt(0)
    ),
    fileSecretCodes: [...(ENV.RAZORPAY_KEY_SECRET ?? "")].map((c) =>
      c.charCodeAt(0)
    ),
  })

  const razorpay = new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET,
  })

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
    const cart: any = await cartService.retrieveCart(cartId, {
      select: ["id", "currency_code", "completed_at", "total", "raw_total"],
    })

    console.log("========================================")
    console.log("MEDUSA CART")
    console.log(JSON.stringify(cart, null, 2))
    console.log("----------------------------------------")
    console.log("cart.total =", cart.total)
    console.log("cart.raw_total =", cart.raw_total)
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
        message: "Cart already completed.",
      })
    }

    let amount = 0

    if (typeof cart.raw_total === "number") {
      amount = cart.raw_total
    } else if (typeof cart.raw_total === "string") {
      amount = Number(cart.raw_total)
    } else if (cart.raw_total?.value) {
      amount = Number(cart.raw_total.value)
    } else if (typeof cart.total === "number") {
      amount = cart.total
    } else if (typeof cart.total === "string") {
      amount = Number(cart.total)
    } else if (cart.total?.numeric_ !== undefined) {
      amount = Number(cart.total.numeric_)
    }

    const currency = (cart.currency_code ?? "INR").toUpperCase()

    console.log("========================================")
    console.log("FINAL AMOUNT =", amount)
    console.log("FINAL CURRENCY =", currency)
    console.log("========================================")

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid amount: ${amount}`,
      })
    }

    // ==========================
    // AUTHENTICATION TEST
    // ==========================
    console.log("========================================")
    console.log("Testing Razorpay authentication...")
    console.log("========================================")

    const payments = await razorpay.payments.all({
      count: 1,
    })

    console.log("========================================")
    console.log("Authentication successful!")
    console.log(payments)
    console.log("========================================")

    // ==========================
    // CREATE ORDER
    // ==========================
    console.log("KEY", JSON.stringify(process.env.RAZORPAY_KEY_ID))
    console.log("SECRET", JSON.stringify(process.env.RAZORPAY_KEY_SECRET))

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    })

    console.log("========================================")
    console.log("RAZORPAY ORDER CREATED")
    console.log(order)
    console.log("========================================")

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
    console.error("========================================")
    console.error("CREATE ORDER ERROR")
    console.error("========================================")
    console.error("Name:", error?.name)
    console.error("Message:", error?.message)
    console.error("Status:", error?.statusCode)
    console.error("Error:", error?.error)
    console.error("Stack:", error?.stack)
    console.error("Raw:", error)
    console.error("========================================")

    return res.status(500).json({
      success: false,
      message: error?.message ?? "Failed to create Razorpay order.",
    })
  }
}
