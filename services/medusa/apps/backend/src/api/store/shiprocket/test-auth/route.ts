import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SHIPROCKET_MODULE } from "../../../../modules/shiprocket"
import ShiprocketModuleService from "../../../../modules/shiprocket/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const shiprocketService =
      req.scope.resolve<ShiprocketModuleService>(SHIPROCKET_MODULE)

    const token = await shiprocketService.authenticate()

    res.status(200).json({
      success: true,
      message: "Shiprocket authentication successful",
      token_received: Boolean(token),
    })
  } catch (error) {
    console.error("[shiprocket/test-auth] Failed:", error)

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Shiprocket authentication failed",
    })
  }
}
