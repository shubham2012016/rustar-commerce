const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external"

type ShiprocketCredentials = {
  email: string
  password: string
}

type ShiprocketAuthResponse = {
  token: string
}

type ShiprocketCreateOrderResponse = Record<string, any>

type ShiprocketAWBResponse = Record<string, any>

type ShiprocketLabelResponse = Record<string, any>

type ShiprocketPickupResponse = Record<string, any>

type ShiprocketTrackingResponse = Record<string, any>

export class ShiprocketClient {
  private email: string

  private password: string

  private token?: string

  constructor(credentials: ShiprocketCredentials) {
    this.email = credentials.email

    this.password = credentials.password
  }

  // ============================================================
  // TRACKING
  // ============================================================

  async trackAWB(awb: string): Promise<ShiprocketTrackingResponse> {
    await this.ensureAuthenticated()

    return this.request<ShiprocketTrackingResponse>(
      `/courier/track/awb/${encodeURIComponent(awb)}`
    )
  }

  // ============================================================
  // HTTP REQUEST
  // ============================================================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${SHIPROCKET_BASE_URL}${endpoint}`, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        Accept: "application/json",

        ...(this.token
          ? {
              Authorization: `Bearer ${this.token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    })

    const text = await response.text()

    let data: unknown

    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = text
    }

    if (!response.ok) {
      throw new Error(
        `Shiprocket API error (${response.status}): ${JSON.stringify(data)}`
      )
    }

    return data as T
  }

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  async authenticate(): Promise<string> {
    const response = await this.request<ShiprocketAuthResponse>("/auth/login", {
      method: "POST",

      body: JSON.stringify({
        email: this.email,

        password: this.password,
      }),
    })

    if (!response?.token) {
      throw new Error(
        "Shiprocket authentication succeeded but no token was returned."
      )
    }

    this.token = response.token

    return response.token
  }

  async ensureAuthenticated(): Promise<void> {
    if (!this.token) {
      await this.authenticate()
    }
  }

  // ============================================================
  // CREATE ORDER
  // ============================================================

  async createOrder(
    payload: Record<string, unknown>
  ): Promise<ShiprocketCreateOrderResponse> {
    await this.ensureAuthenticated()

    return this.request<ShiprocketCreateOrderResponse>("/orders/create/adhoc", {
      method: "POST",

      body: JSON.stringify(payload),
    })
  }

  // ============================================================
  // ASSIGN AWB
  // ============================================================

  async assignAWB(
    shipmentId: number,
    courierId?: number
  ): Promise<ShiprocketAWBResponse> {
    await this.ensureAuthenticated()

    return this.request<ShiprocketAWBResponse>("/courier/assign/awb", {
      method: "POST",

      body: JSON.stringify({
        shipment_id: shipmentId,

        ...(courierId
          ? {
              courier_id: courierId,
            }
          : {}),
      }),
    })
  }

  // ============================================================
  // SCHEDULE PICKUP
  // ============================================================

  async schedulePickup(shipmentId: number): Promise<ShiprocketPickupResponse> {
    await this.ensureAuthenticated()

    return this.request<ShiprocketPickupResponse>("/courier/generate/pickup", {
      method: "POST",

      body: JSON.stringify({
        shipment_id: [shipmentId],
      }),
    })
  }

  // ============================================================
  // GENERATE SHIPPING LABEL
  // ============================================================

  async generateLabel(shipmentId: number): Promise<ShiprocketLabelResponse> {
    await this.ensureAuthenticated()

    return this.request<ShiprocketLabelResponse>("/courier/generate/label", {
      method: "POST",

      body: JSON.stringify({
        shipment_id: [shipmentId],
      }),
    })
  }

  // ============================================================
  // SHIPMENT DETAILS
  // ============================================================

  async getShipmentDetails(shipmentId: number): Promise<Record<string, any>> {
    await this.ensureAuthenticated()

    return this.request<Record<string, any>>(`/shipments/${shipmentId}`, {
      method: "GET",
    })
  }

  // ============================================================
  // CANCEL SHIPMENT
  // ============================================================

  async cancelShipment(awb: string): Promise<Record<string, any>> {
    await this.ensureAuthenticated()

    return this.request<Record<string, any>>("/orders/cancel/shipment/awbs", {
      method: "POST",

      body: JSON.stringify({
        awbs: [awb],
      }),
    })
  }
}
