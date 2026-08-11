import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { SHIPROCKET_MODULE } from "../../../../modules/shiprocket"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const shiprocketService = req.scope.resolve(SHIPROCKET_MODULE)

    const result = await shiprocketService.createOrder({
      order_id: `TEST-${Date.now()}`,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),

      pickup_location: "Home",

      billing_customer_name: "Test Customer",
      billing_last_name: "",
      billing_address: "Test Address",
      billing_address_2: "",
      billing_city: "Delhi",
      billing_pincode: "110041",
      billing_state: "Delhi",
      billing_country: "India",
      billing_email: "test@example.com",
      billing_phone: "9876543210",

      shipping_is_billing: true,

      order_items: [
        {
          name: "Rustar Chem Test Product",
          sku: "TEST-SKU-001",
          units: 1,
          selling_price: 149,
          discount: 0,
          tax: 0,
          hsn: "",
        },
      ],

      payment_method: "PREPAID",

      sub_total: 149,
      total_discount: 0,

      weight: 0.5,
      length: 20,
      breadth: 15,
      height: 10,
    })

    res.json({
      success: true,
      message: "Shiprocket order created successfully",
      data: result,
    })
  } catch (error) {
    console.error("Shiprocket test-create-order error:", error)

    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown Shiprocket error",
    })
  }
}
