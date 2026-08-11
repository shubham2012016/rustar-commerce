import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,

      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },

  admin: {
    disable: process.env.ADMIN_DISABLED === "true",
    path: "/app",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },

  modules: [
    // ============================================================
    // PAYMENT
    // ============================================================
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/razorpay",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_KEY_ID!,
              key_secret: process.env.RAZORPAY_KEY_SECRET!,
            },
          },
        ],
      },
    },

    // ============================================================
    // FULFILLMENT
    // ============================================================
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "./src/modules/shiprocket",
            id: "shiprocket",
            options: {
              email: process.env.SHIPROCKET_EMAIL!,
              password: process.env.SHIPROCKET_PASSWORD!,
              pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION!,

              autoSchedulePickup:
                process.env.SHIPROCKET_AUTO_SCHEDULE_PICKUP === "true",

              defaultWeightKg: Number(
                process.env.SHIPROCKET_DEFAULT_WEIGHT_KG ?? 0.5
              ),

              defaultLengthCm: Number(
                process.env.SHIPROCKET_DEFAULT_LENGTH_CM ?? 20
              ),

              defaultBreadthCm: Number(
                process.env.SHIPROCKET_DEFAULT_BREADTH_CM ?? 15
              ),

              defaultHeightCm: Number(
                process.env.SHIPROCKET_DEFAULT_HEIGHT_CM ?? 10
              ),
            },
          },
        ],
      },
    },
  ],
})
