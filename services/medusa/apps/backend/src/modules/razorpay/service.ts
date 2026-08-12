import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"

import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
} from "@medusajs/framework/types"

import { verifySignature } from "../../lib/payment"

type RazorpayOptions = {
  key_id: string
  key_secret: string
}

type InjectedDependencies = {
  logger: any
}

class RazorpayPaymentProviderService extends AbstractPaymentProvider {
  static identifier = "razorpay"

  protected logger_: any
  protected options_: RazorpayOptions

  constructor(container: InjectedDependencies, options: RazorpayOptions) {
    super(container, options)

    this.logger_ = container.logger
    this.options_ = options
  }

  static validateOptions(options: Record<string, any>): void {
    if (!options.key_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "RAZORPAY_KEY_ID is required"
      )
    }

    if (!options.key_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "RAZORPAY_KEY_SECRET is required"
      )
    }
  }

  private async razorpayRequest(
    path: string,
    method: "GET" | "POST" | "PATCH",
    body?: Record<string, any>
  ) {
    const credentials = Buffer.from(
      `${this.options_.key_id}:${this.options_.key_secret}`
    ).toString("base64")

    const response = await fetch(`https://api.razorpay.com/v1${path}`, {
      method,
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data?.error?.description ||
          data?.error?.reason ||
          `Razorpay API request failed with status ${response.status}`
      )
    }

    return data
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    try {
      const amount = Number(input.amount)

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid Razorpay payment amount"
        )
      }

      const currency = input.currency_code.toUpperCase()

      // Medusa amount: ₹149
      // Razorpay expects smallest currency unit:
      // ₹149 = 14900 paise
      const razorpayAmount = Math.round(amount * 100)

      this.logger_?.info?.(
        `Razorpay amount conversion: Medusa=${amount} ${currency}, Razorpay=${razorpayAmount} subunits`
      )

      const order = await this.razorpayRequest("/orders", "POST", {
        amount: razorpayAmount,
        currency,
        receipt: `medusa_${Date.now()}`,
        notes: {
          payment_session_id: input.data?.session_id || "",
        },
      })

      return {
        id: order.id,
        data: {
          razorpay_order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
        },
      }
    } catch (error: any) {
      this.logger_?.error?.(
        `Razorpay initiatePayment failed: ${error?.message || error}`
      )

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to initiate Razorpay payment: ${error?.message || error}`
      )
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const data = input.data as Record<string, any>

    const razorpayOrderId = data?.razorpay_order_id

    const razorpayPaymentId = data?.razorpay_payment_id

    const razorpaySignature = data?.razorpay_signature

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay payment verification data is missing"
      )
    }

    const isValid = verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    )

    if (!isValid) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        "Invalid Razorpay payment signature"
      )
    }

    try {
      const payment = await this.razorpayRequest(
        `/payments/${razorpayPaymentId}`,
        "GET"
      )

      if (payment.order_id && payment.order_id !== razorpayOrderId) {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          "Razorpay payment does not belong to the expected order"
        )
      }

      if (payment.status !== "captured" && payment.status !== "authorized") {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          `Razorpay payment is not successful. Status: ${payment.status}`
        )
      }

      return {
        status: "authorized",
        data: {
          ...data,
          razorpay_payment: payment,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature,
        },
      }
    } catch (error: any) {
      if (error instanceof MedusaError) {
        throw error
      }

      this.logger_?.error?.(
        `Razorpay authorizePayment failed: ${error?.message || error}`
      )

      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Failed to authorize Razorpay payment: ${error?.message || error}`
      )
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return {
      data: {
        ...input.data,
      },
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const paymentId = input.data?.razorpay_payment_id

    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay payment ID is required for refund"
      )
    }

    try {
      const amount = Number(input.amount)

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid refund amount"
        )
      }

      const currency = String(input.currency_code || "INR").toUpperCase()

      if (currency !== "INR") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Razorpay refunds currently support INR only. Received: ${currency}`
        )
      }

      // Medusa amount: ₹149
      // Razorpay refund amount: 14900 paise
      const razorpayAmount = Math.round(amount * 100)

      this.logger_?.info?.(
        `Razorpay refund amount conversion: Medusa=${amount} ${currency}, Razorpay=${razorpayAmount} subunits`
      )

      const refund = await this.razorpayRequest(
        `/payments/${paymentId}/refund`,
        "POST",
        {
          amount: razorpayAmount,
        }
      )

      return {
        data: {
          ...input.data,
          razorpay_refund_id: refund.id,
        },
      }
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Razorpay refund failed: ${error?.message || error}`
      )
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: {
        ...input.data,
      },
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return {
      data: {
        ...input.data,
      },
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const paymentId = input.data?.razorpay_payment_id

    if (!paymentId) {
      return {
        data: input.data,
      }
    }

    try {
      const payment = await this.razorpayRequest(
        `/payments/${paymentId}`,
        "GET"
      )

      return {
        data: {
          ...input.data,
          razorpay_payment: payment,
        },
      }
    } catch {
      return {
        data: input.data,
      }
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const paymentId = input.data?.razorpay_payment_id

    if (!paymentId) {
      return {
        status: "pending",
      }
    }

    try {
      const payment = await this.razorpayRequest(
        `/payments/${paymentId}`,
        "GET"
      )

      switch (payment.status) {
        case "captured":
          return { status: "captured" }

        case "authorized":
          return { status: "authorized" }

        case "failed":
          return { status: "error" }

        default:
          return { status: "pending" }
      }
    } catch {
      return {
        status: "pending",
      }
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return {
      data: {
        ...input.data,
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }
}

export default RazorpayPaymentProviderService
