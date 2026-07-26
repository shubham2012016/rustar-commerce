"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useEffect, useRef } from "react"

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 150)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-24 left-1/2 z-[100] w-[92%] max-w-2xl -translate-x-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl"
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.22,
            }}
          >
            <div className="flex items-center gap-3 p-4">
              <Search className="h-5 w-5 text-slate-500" />

              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
              />

              <button
                onClick={onClose}
                className="rounded-lg p-2 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-t px-4 py-5 text-sm text-slate-500">
              Start typing to search Rustar Chem products.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
