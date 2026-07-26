import { z } from "zod"

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),

    lastName: z.string().min(2, "Last name must be at least 2 characters"),

    email: z.email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain one uppercase letter")
      .regex(/[a-z]/, "Must contain one lowercase letter")
      .regex(/[0-9]/, "Must contain one number"),

    confirmPassword: z.string(),

    acceptTerms: z.literal(true, {
      error: "You must accept the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
