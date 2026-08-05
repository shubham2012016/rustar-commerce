"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Eye, EyeOff, Loader2 } from "lucide-react"

import { loginSchema, type LoginFormValues } from "@/schemas/auth"
import { useAuthStore } from "@/store/auth.store"

export default function LoginForm() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const searchParams = useSearchParams()

  async function onSubmit(data: LoginFormValues) {
    try {
      await login({
        email: data.email,
        password: data.password,
      })

      const redirect = searchParams.get("redirect") ?? "/"
      router.replace(redirect)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Invalid email or password.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-orange-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 transition outline-none focus:border-orange-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-600 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  )
}
