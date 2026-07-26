"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { CircleUserRound, LogIn, Package, Settings, User, UserPlus } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function AccountMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Account"
        onClick={() => setOpen((prev) => !prev)}
        className="
          inline-flex h-10 w-10 items-center justify-center
          rounded-full border border-slate-200 bg-white
          text-slate-700 transition-all duration-200
          hover:border-blue-600 hover:text-blue-600 hover:shadow-md
          active:scale-95
        "
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
            className="
              absolute right-0 mt-3 w-72
              rounded-2xl border border-slate-200
              bg-white shadow-2xl overflow-hidden
              z-50
            "
          >
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
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
              >
                <LogIn className="h-5 w-5" />
                Login
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
              >
                <UserPlus className="h-5 w-5" />
                Create Account
              </Link>

              <Link
                href="/account"
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
              >
                <User className="h-5 w-5" />
                My Profile
              </Link>

              <Link
                href="/orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
              >
                <Package className="h-5 w-5" />
                Orders
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}