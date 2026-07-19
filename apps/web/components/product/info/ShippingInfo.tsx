"use client"

import { useState } from "react"

import { MapPin, Truck, BadgeCheck, RotateCcw } from "lucide-react"

export default function ShippingInfo() {
  const [pincode, setPincode] = useState("")

  function checkAvailability() {
    // TODO:
    // Shiprocket API Integration
    console.log("Checking:", pincode)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">Delivery Information</h3>

      <p className="mt-2 text-slate-500">
        Enter your PIN code to check delivery availability.
      </p>

      {/* Pincode */}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter PIN Code"
          className="h-14 w-full rounded-2xl border border-slate-300 px-5 transition outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={checkAvailability}
          className="h-14 w-full rounded-2xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          Check
        </button>
      </div>

      {/* Shipping Details */}

      <div className="mt-8 space-y-5">
        <div className="flex items-start gap-4">
          <Truck className="mt-1 h-5 w-5 text-blue-600" />

          <div>
            <p className="font-semibold text-slate-900">Free Shipping</p>

            <p className="text-sm text-slate-500">
              Available on eligible orders across India.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="mt-1 h-5 w-5 text-blue-600" />

          <div>
            <p className="font-semibold text-slate-900">Estimated Delivery</p>

            <p className="text-sm text-slate-500">
              Usually delivered within 3–7 business days.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <BadgeCheck className="mt-1 h-5 w-5 text-emerald-600" />

          <div>
            <p className="font-semibold text-slate-900">Cash on Delivery</p>

            <p className="text-sm text-slate-500">
              Available for most serviceable locations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <RotateCcw className="mt-1 h-5 w-5 text-orange-500" />

          <div>
            <p className="font-semibold text-slate-900">Easy Returns</p>

            <p className="text-sm text-slate-500">
              7-day return policy on eligible products.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
