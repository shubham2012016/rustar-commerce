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

  /**
   * Capture an authorized Razorpay payment.
   *
   * This method is intentionally idempotent:
   *
   * - captured -> return success without calling capture again
   * - authorized -> capture it
   * - anything else -> fail
   */
  private async captureRazorpayPayment(
    paymentId: string,
    amount: number,
    currency: string
  ) {
    const currentPayment = await this.razorpayRequest(
      `/payments/${paymentId}`,
      "GET"
    )

    if (!currentPayment?.id) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_CAPTURE_ERROR,
        "Razorpay payment could not be retrieved before capture"
      )
    }

    if (currentPayment.status === "captured") {
      this.logger_?.info?.(
        `[Razorpay] Payment ${paymentId} is already captured`
      )

      return currentPayment
    }

    if (currentPayment.status !== "authorized") {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_CAPTURE_ERROR,
        `Razorpay payment cannot be captured. Current status: ${currentPayment.status}`
      )
    }

    const razorpayAmount = Math.round(amount * 100)

    if (
      Number.isFinite(Number(currentPayment.amount)) &&
      Number(currentPayment.amount) !== razorpayAmount
    ) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_CAPTURE_ERROR,
        `Capture amount mismatch. Razorpay authorized ${currentPayment.amount} subunits, but Medusa requested ${razorpayAmount} subunits.`
      )
    }

    this.logger_?.info?.(
      `[Razorpay] Capturing payment=${paymentId}, Medusa amount=${amount} ${currency}, Razorpay amount=${razorpayAmount}`
    )

    try {
      const capturedPayment = await this.razorpayRequest(
        `/payments/${paymentId}/capture`,
        "POST",
        {
          amount: razorpayAmount,
          currency,
        }
      )

      if (!capturedPayment?.id) {
        throw new Error("Razorpay did not return a payment after capture")
      }

      if (capturedPayment.status !== "captured") {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_CAPTURE_ERROR,
          `Razorpay capture did not complete. Current status: ${capturedPayment.status}`
        )
      }

      this.logger_?.info?.(
        `[Razorpay] Payment ${paymentId} captured successfully`
      )

      return capturedPayment
    } catch (error: any) {
      /*
       * Automatic capture can race with our explicit capture call.
       *
       * If Razorpay captured it between our status check and capture
       * request, fetch the payment again and accept the captured state.
       */
      try {
        const latestPayment = await this.razorpayRequest(
          `/payments/${paymentId}`,
          "GET"
        )

        if (latestPayment?.status === "captured") {
          this.logger_?.info?.(
            `[Razorpay] Payment ${paymentId} was captured concurrently`
          )

          return latestPayment
        }
      } catch {
        // Preserve the original capture error below.
      }

      throw error
    }
  }

  /**
   * Creates a Razorpay order.
   *
   * Medusa gives us the amount in major currency units.
   *
   * Example:
   *   Medusa:   ₹149
   *   Razorpay: 14900 paise
   */
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

      const currency = String(input.currency_code || "INR").toUpperCase()

      if (currency !== "INR") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Razorpay integration currently supports INR only. Received: ${currency}`
        )
      }

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

  /**
   * Verifies the Razorpay payment and makes sure it is actually captured.
   */
  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    try {
      const razorpayOrderId = input.data?.razorpay_order_id?.toString()

      const razorpayPaymentId = input.data?.razorpay_payment_id?.toString()

      const razorpaySignature = input.data?.razorpay_signature?.toString()

      if (!razorpayOrderId) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Razorpay order ID is missing"
        )
      }

      if (!razorpayPaymentId) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Razorpay payment ID is missing"
        )
      }

      if (!razorpaySignature) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Razorpay payment signature is missing"
        )
      }

      const payment = await this.razorpayRequest(
        `/payments/${razorpayPaymentId}`,
        "GET"
      )

      if (!payment?.id) {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          "Razorpay payment could not be retrieved"
        )
      }

      if (payment.order_id !== razorpayOrderId) {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          "Razorpay payment does not belong to the expected order"
        )
      }

      const crypto = await import("node:crypto")

      const generatedSignature = crypto
        .createHmac("sha256", this.options_.key_secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex")

      if (generatedSignature !== razorpaySignature) {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          "Invalid Razorpay payment signature"
        )
      }

      if (payment.status !== "captured" && payment.status !== "authorized") {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          `Razorpay payment is not successful. Current status: ${payment.status}`
        )
      }

      if (payment.status === "captured") {
        this.logger_?.info?.(
          `[Razorpay] Payment ${razorpayPaymentId} is already captured`
        )

        return {
          status: "captured",
          data: {
            ...input.data,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
            razorpay_payment_status: "captured",
            razorpay_payment: payment,
            razorpay_capture_id: razorpayPaymentId,
          },
        }
      }

      const amount = Number(input.amount)

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid Razorpay authorization amount"
        )
      }

      const currency = String(input.currency_code || "INR").toUpperCase()

      const capturedPayment = await this.captureRazorpayPayment(
        razorpayPaymentId,
        amount,
        currency
      )

      return {
        status: "captured",
        data: {
          ...input.data,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          razorpay_payment_status: capturedPayment.status,
          razorpay_payment: capturedPayment,
          razorpay_capture_id: capturedPayment.id,
        },
      }
    } catch (error: any) {
      this.logger_?.error?.(
        `[Razorpay] authorizePayment failed: ${error?.message || error}`
      )

      if (error instanceof MedusaError) {
        throw error
      }

      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Razorpay payment authorization failed: ${error?.message || error}`
      )
    }
  }

  /**
   * Called by Medusa when an authorized payment is captured
   * from the Admin dashboard or through the Payment Module.
   */
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
      const amount = Number(input.amount)

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid Razorpay capture amount"
        )
      }

      const currency = String(input.currency_code || "INR").toUpperCase()

      if (currency !== "INR") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Razorpay capture currently supports INR only. Received: ${currency}`
        )
      }

      const capturedPayment = await this.captureRazorpayPayment(
        paymentId,
        amount,
        currency
      )

      return {
        data: {
          ...input.data,
          razorpay_payment_id: capturedPayment.id,
          razorpay_payment: capturedPayment,
          razorpay_payment_status: capturedPayment.status,
          razorpay_capture_id: capturedPayment.id,
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
        `Failed to capture Razorpay payment: ${error?.message || error}`
      )
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const paymentId = input.data?.razorpay_payment_id?.toString()

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
          razorpay_refund_status: refund.status,
        },
      }
    } catch (error: any) {
      this.logger_?.error?.(
        `[Razorpay] refundPayment failed: ${error?.message || error}`
      )

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
    const paymentId = input.data?.razorpay_payment_id?.toString()

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
          razorpay_payment_status: payment.status,
        },
      }
    } catch (error: any) {
      this.logger_?.warn?.(
        `[Razorpay] retrievePayment failed: ${error?.message || error}`
      )

      return {
        data: input.data,
      }
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const paymentId = input.data?.razorpay_payment_id?.toString()

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
    } catch (error: any) {
      this.logger_?.warn?.(
        `[Razorpay] getPaymentStatus failed: ${error?.message || error}`
      )

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
