import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import ShiprocketModuleService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [ShiprocketModuleService],
})
