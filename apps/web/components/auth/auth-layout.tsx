"use client"

import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
          {/* Left */}
          <div className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 p-16 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Rustar Chem</h1>

              <p className="mt-6 text-lg text-slate-300">
                Premium automotive care products engineered for performance,
                durability, and reliability.
              </p>
            </div>

            <div className="space-y-4">
              <div>✔ Secure Checkout</div>
              <div>✔ Genuine Products</div>
              <div>✔ Fast Delivery Across India</div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center justify-center p-8 md:p-16">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
