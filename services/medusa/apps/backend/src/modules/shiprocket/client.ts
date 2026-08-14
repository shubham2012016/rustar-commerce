const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external"

type ShiprocketCredentials = {
  email: string
  password: string
}

type ShiprocketAuthResponse = {
  token: string
}

export class ShiprocketClient {
  private email: string
  private password: string
  private token?: string

  constructor(credentials: ShiprocketCredentials) {
    this.email = credentials.email
    this.password = credentials.password
  }

  async trackAWB(awb: string) {
    return this.request(`/courier/track/awb/${encodeURIComponent(awb)}`)
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${SHIPROCKET_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",

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

  async authenticate(): Promise<string> {
    const response = await this.request<ShiprocketAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: this.email,
        password: this.password,
      }),
    })

    this.token = response.token

    return response.token
  }

  async ensureAuthenticated(): Promise<void> {
    if (!this.token) {
      await this.authenticate()
    }
  }

  async createOrder(payload: Record<string, unknown>) {
    await this.ensureAuthenticated()

    return this.request<unknown>("/orders/create/adhoc", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async assignAWB(shipmentId: number, courierId?: number) {
    await this.ensureAuthenticated()

    return this.request<unknown>("/courier/assign/awb", {
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

  async schedulePickup(shipmentId: number) {
    await this.ensureAuthenticated()

    return this.request<unknown>("/courier/generate/pickup", {
      method: "POST",
      body: JSON.stringify({
        shipment_id: [shipmentId],
      }),
    })
  }

  async generateLabel(shipmentId: number) {
    await this.ensureAuthenticated()

    return this.request<unknown>("/courier/generate/label", {
      method: "POST",
      body: JSON.stringify({
        shipment_id: [shipmentId],
      }),
    })
  }

  async getShipmentDetails(shipmentId: number) {
    await this.ensureAuthenticated()

    return this.request<unknown>(`/shipments/${shipmentId}`, {
      method: "GET",
    })
  }

  async cancelShipment(awb: string) {
    await this.ensureAuthenticated()

    return this.request<unknown>("/orders/cancel/shipment/awbs", {
      method: "POST",
      body: JSON.stringify({
        awbs: [awb],
      }),
    })
  }
}
