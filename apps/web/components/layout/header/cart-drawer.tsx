"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBag, Trash2, X } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

import type { CartItem } from "@/types"
import { useCartStore } from "@/store/cart.store"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const cartId = useCartStore((state) => state.cartId)
  const items = useCartStore((state) => state.items)
  const retrieveCart = useCartStore((state) => state.retrieveCart)

  useEffect(() => {
    if (!open || !cartId || items.length > 0) return

    retrieveCart().catch(() => {
      // Silent retrieval failure; UI will remain in sync with store state.
    })
  }, [open, cartId, items.length, retrieveCart])

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose])

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.28,
              ease: "easeInOut",
            }}
            className="fixed top-0 right-0 z-[100] flex h-screen w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">Shopping Cart</h2>

                <p className="text-sm text-slate-500">{items.length} item(s)</p>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <ShoppingBag className="mb-6 h-16 w-16 text-slate-300" />

                  <h3 className="text-lg font-semibold">Your cart is empty</h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Add premium Rustar Chem products to continue.
                  </p>

                  <button
                    onClick={onClose}
                    className="mt-8 rounded-xl bg-orange-600 px-6 py-3 text-white transition hover:bg-orange-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5 p-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl border p-3"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl border bg-slate-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <h4 className="font-medium">{item.name}</h4>

                        <p className="text-sm text-slate-500">₹{item.price}</p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border">
                            <button className="px-3 py-1">-</button>

                            <span className="px-3">{item.quantity}</span>

                            <button className="px-3 py-1">+</button>
                          </div>

                          <button className="text-red-600">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}

            {items.length > 0 && (
              <div className="border-t p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-slate-500">Subtotal</span>

                  <span className="text-xl font-bold">₹{subtotal}</span>
                </div>

                <div className="grid gap-3">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="rounded-xl border py-3 text-center font-medium transition hover:bg-slate-100"
                  >
                    View Cart
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="rounded-xl bg-orange-600 py-3 text-center font-medium text-white transition hover:bg-orange-700"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
