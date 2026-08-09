import axios from "axios"

export interface RazorpayOrderResponse {
  success: boolean
  order: {
    id: string
    amount: number
    currency: string
    receipt: string
  }
}

export interface VerifyPaymentPayload {
  cartId: string
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

const API_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function createRazorpayOrder(cartId: string) {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const { data } = await axios.post<RazorpayOrderResponse>(
    `${API_URL}/store/razorpay/create-order`,
    {
      cartId,
    },
    {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
    }
  )

  return data
}

export async function verifyRazorpayPayment(payload: VerifyPaymentPayload) {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const { data } = await axios.post(
    `${API_URL}/store/razorpay/verify`,
    payload,
    {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
    }
  )

  return data
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      resolve(true)
      return
    }

    const script = document.createElement("script")

    script.src = "https://checkout.razorpay.com/v1/checkout.js"

    script.onload = () => resolve(true)

    script.onerror = () => resolve(false)

    document.body.appendChild(script)
  })
}
