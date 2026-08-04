export interface CreatePaymentRequest {
  cartId: string
  amount: number
  currency: string
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}