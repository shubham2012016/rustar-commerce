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

      /*
       * Medusa amount received here is treated as the major-unit
       * amount and converted to Razorpay's smallest currency unit.
       *
       * Example:
       * ₹149 -> 14900 paise
       */
      const razorpayAmount = Math.round(amount * 100)

      this.logger_?.info?.(
        `[Razorpay] Amount conversion: Medusa=${amount} ${currency}, Razorpay=${razorpayAmount} subunits`
      )

      const order = await this.razorpayRequest("/orders", "POST", {
        amount: razorpayAmount,
        currency,
        receipt: `medusa_${Date.now()}`,
        notes: {
          payment_session_id: input.data?.session_id?.toString() || "",
        },
      })

      if (!order?.id) {
        throw new Error("Razorpay did not return an order ID")
      }

      this.logger_?.info?.(
        `[Razorpay] Created order ${order.id} for payment session ${
          input.data?.session_id || "unknown"
        }`
      )

      return {
        id: order.id,
        data: {
          ...input.data,
          razorpay_order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
        },
      }
    } catch (error: any) {
      this.logger_?.error?.(
        `[Razorpay] initiatePayment failed: ${error?.message || error}`
      )

      if (error instanceof MedusaError) {
        throw error
      }

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

    const razorpayOrderId = data?.razorpay_order_id?.toString()
    const razorpayPaymentId = data?.razorpay_payment_id?.toString()
    const razorpaySignature = data?.razorpay_signature?.toString()

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

      /*
       * A successful Razorpay payment can be:
       *
       * captured  -> already paid
       * authorized -> payment authorized but not captured yet
       *
       * Both are valid at authorization stage.
       */
      if (payment.status !== "captured" && payment.status !== "authorized") {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          `Razorpay payment is not successful. Status: ${payment.status}`
        )
      }

      this.logger_?.info?.(
        `[Razorpay] Payment ${razorpayPaymentId} verified successfully. Status: ${payment.status}`
      )

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
        `[Razorpay] authorizePayment failed: ${error?.message || error}`
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
    const paymentId = input.data?.razorpay_payment_id?.toString()

    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay payment ID is required for capture"
      )
    }

    try {
      /*
       * Always retrieve the payment directly from Razorpay first.
       *
       * We intentionally do NOT use input.amount here.
       *
       * initiatePayment() converts Medusa's amount into paise,
       * while Medusa's CapturePaymentInput amount can have different
       * amount semantics depending on the payment workflow.
       *
       * Razorpay already knows the exact amount that was authorized.
       * Using currentPayment.amount guarantees that we capture the
       * exact authorized amount and avoids a major-unit/subunit mismatch.
       */
      const currentPayment = await this.razorpayRequest(
        `/payments/${paymentId}`,
        "GET"
      )

      this.logger_?.info?.(
        `[Razorpay] Capture requested for payment ${paymentId}. ` +
          `Current status=${currentPayment.status}, ` +
          `authorized amount=${currentPayment.amount}, ` +
          `currency=${currentPayment.currency}`
      )

      /*
       * Idempotency:
       *
       * already captured -> nothing else to do
       * authorized -> capture it
       * anything else -> fail safely
       */
      if (currentPayment.status === "captured") {
        this.logger_?.info?.(
          `[Razorpay] Payment ${paymentId} is already captured`
        )

        return {
          data: {
            ...input.data,
            razorpay_payment_status: "captured",
            razorpay_payment: currentPayment,
          },
        }
      }

      if (currentPayment.status !== "authorized") {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_CAPTURE_ERROR,
          `Razorpay payment cannot be captured. Current status: ${currentPayment.status}`
        )
      }

      const razorpayAmount = Number(currentPayment.amount)

      if (!Number.isFinite(razorpayAmount) || razorpayAmount <= 0) {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_CAPTURE_ERROR,
          `Invalid Razorpay authorized amount: ${currentPayment.amount}`
        )
      }

      const currency = String(
        currentPayment.currency || input.currency_code || "INR"
      ).toUpperCase()

      this.logger_?.info?.(
        `[Razorpay] Capturing payment ${paymentId} for ` +
          `${razorpayAmount} ${currency} subunits`
      )

      const capturedPayment = await this.razorpayRequest(
        `/payments/${paymentId}/capture`,
        "POST",
        {
          amount: razorpayAmount,
          currency,
        }
      )

      if (capturedPayment.status !== "captured") {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_CAPTURE_ERROR,
          `Razorpay capture did not complete. Current status: ${capturedPayment.status}`
        )
      }

      this.logger_?.info?.(
        `[Razorpay] Payment ${paymentId} captured successfully. ` +
          `Amount=${capturedPayment.amount} ${capturedPayment.currency}`
      )

      return {
        data: {
          ...input.data,
          razorpay_payment_status: capturedPayment.status,
          razorpay_payment: capturedPayment,
          razorpay_payment_id: paymentId,
        },
      }
    } catch (error: any) {
      this.logger_?.error?.(
        `[Razorpay] capturePayment failed: ${error?.message || error}`
      )

      if (error instanceof MedusaError) {
        throw error
      }

      throw new MedusaError(
        MedusaError.Types.PAYMENT_CAPTURE_ERROR,
        `Razorpay payment capture failed: ${error?.message || error}`
      )
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

      /*
       * Keep the existing refund conversion unchanged for now.
       * We are not mixing refund amount semantics into this fix.
       */
      const razorpayAmount = Math.round(amount * 100)

      this.logger_?.info?.(
        `[Razorpay] Refund amount conversion: Medusa=${amount} ${currency}, Razorpay=${razorpayAmount} subunits`
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
      if (error instanceof MedusaError) {
        throw error
      }

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
          return {
            status: "captured",
          }

        case "authorized":
          return {
            status: "authorized",
          }

        case "failed":
          return {
            status: "error",
          }

        default:
          return {
            status: "pending",
          }
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
