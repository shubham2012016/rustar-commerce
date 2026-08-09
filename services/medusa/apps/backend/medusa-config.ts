import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils"

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
  ],
})
