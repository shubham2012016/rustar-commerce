"use client"

import { useEffect, useState } from "react"

import { useCheckoutStore } from "@/store"

interface AddressForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  city: string
  state: string
  country: string
  postalCode: string
}

const emptyAddress: AddressForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  city: "",
  state: "",
  country: "in",
  postalCode: "",
}

export default function CheckoutAddress() {
  const address = useCheckoutStore((state) => state.address)
  const setAddress = useCheckoutStore((state) => state.setAddress)

  const [form, setForm] = useState<AddressForm>(emptyAddress)

  useEffect(() => {
    if (!address) {
      return
    }

    setForm({
      firstName: address.firstName ?? "",
      lastName: address.lastName ?? "",
      email: address.email ?? "",
      phone: address.phone ?? "",
      address1: address.address1 ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      country: address.country ?? "in",
      postalCode: address.postalCode ?? "",
    })
  }, [address])

  function updateField(field: keyof AddressForm, value: string) {
    const next = {
      ...form,
      [field]: value,
    }

    setForm(next)

    setAddress({
      firstName: next.firstName,
      lastName: next.lastName,
      email: next.email,
      phone: next.phone,
      address1: next.address1,
      city: next.city,
      state: next.state,
      country: next.country,
      postalCode: next.postalCode,
    })
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Shipping Address</h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <input
          value={form.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
          className="rounded-xl border border-slate-300 p-4"
          placeholder="First Name"
          autoComplete="given-name"
        />

        <input
          value={form.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          className="rounded-xl border border-slate-300 p-4"
          placeholder="Last Name"
          autoComplete="family-name"
        />

        <input
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="rounded-xl border border-slate-300 p-4 md:col-span-2"
          placeholder="Email"
          type="email"
          autoComplete="email"
        />

        <input
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="rounded-xl border border-slate-300 p-4 md:col-span-2"
          placeholder="Phone Number"
          type="tel"
          autoComplete="tel"
        />

        <textarea
          value={form.address1}
          onChange={(e) => updateField("address1", e.target.value)}
          className="rounded-xl border border-slate-300 p-4 md:col-span-2"
          rows={4}
          placeholder="Full Address"
          autoComplete="street-address"
        />

        <input
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
          className="rounded-xl border border-slate-300 p-4"
          placeholder="City"
          autoComplete="address-level2"
        />

        <input
          value={form.state}
          onChange={(e) => updateField("state", e.target.value)}
          className="rounded-xl border border-slate-300 p-4"
          placeholder="State"
          autoComplete="address-level1"
        />

        <input
          value={form.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
          className="rounded-xl border border-slate-300 p-4"
          placeholder="PIN Code"
          inputMode="numeric"
          autoComplete="postal-code"
        />

        <input
          value="India"
          readOnly
          className="rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-600"
        />
      </div>
    </section>
  )
}
