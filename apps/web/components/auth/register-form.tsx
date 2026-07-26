"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Eye, EyeOff, Loader2 } from "lucide-react"

import { useAuthStore } from "@/store/auth.store"
import { registerSchema, type RegisterFormValues } from "@/schemas/auth"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const router = useRouter()

  const registerCustomer = useAuthStore((state) => state.register)

  const loading = useAuthStore((state) => state.loading)

  const password = watch("password", "")

  const passwordStrength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
  ].filter(Boolean).length

  async function onSubmit(data: RegisterFormValues) {
    try {
      await registerCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })

      router.replace("/")
    } catch (error) {
      console.error(error)
      alert("Unable to create account.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* First + Last */}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            First Name
          </label>

          <input
            {...register("firstName")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-orange-500"
          />

          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Last Name
          </label>

          <input
            {...register("lastName")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-orange-500"
          />

          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email Address
        </label>

        <input
          type="email"
          {...register("email")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-orange-500"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 transition outline-none focus:border-orange-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}

        {/* Password Strength */}

        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full ${
                passwordStrength >= level ? "bg-green-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Confirm Password */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 transition outline-none focus:border-orange-500"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" {...register("acceptTerms")} className="mt-1" />

        <span className="text-slate-600">
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-medium text-orange-600 hover:underline"
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-orange-600 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {errors.acceptTerms && (
        <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
      )}

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-600 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  )
}
