"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  CircleUserRound,
  LogIn,
  LogOut,
  Package,
  Settings,
  User,
  UserPlus,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { useAuthStore } from "@/store/auth.store"

export default function AccountMenu() {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  const customer = useAuthStore((state) => state.customer)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const initialized = useAuthStore((state) => state.initialized)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  async function handleLogout() {
    setOpen(false)

    await logout()

    router.push("/")
    router.refresh()
  }

  const fullName =
    `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim()

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Account"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-orange-500 hover:text-orange-500 hover:shadow-md active:scale-95"
      >
        <CircleUserRound className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {!initialized ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Loading...
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="border-b p-5">
                  <h3 className="font-semibold text-slate-900">
                    {fullName || "Welcome"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {customer?.email}
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
                  >
                    <User className="h-5 w-5" />
                    My Profile
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
                  >
                    <Package className="h-5 w-5" />
                    My Orders
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-b p-5">
                  <h3 className="font-semibold text-slate-900">
                    Welcome to Rustar Chem
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Sign in to access your orders and wishlist.
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
                  >
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
