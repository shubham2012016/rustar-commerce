"use client"

import { ChangeEvent } from "react"
import { Minus, Plus } from "lucide-react"

import { useProduct } from "@/components/product/context/ProductContext"

export default function QuantitySelector() {
  const { selectedVariant, quantity, setQuantity } = useProduct()

  function decrease() {
    setQuantity(Math.max(1, quantity - 1))
  }

  function increase() {
    setQuantity(Math.min(selectedVariant.stock, quantity + 1))
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value)

    if (Number.isNaN(value)) return

    setQuantity(Math.min(selectedVariant.stock, Math.max(1, value)))
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Quantity</h3>

        <span className="text-sm text-slate-500">
          Max {selectedVariant.stock}
        </span>
      </div>

      <div className="inline-flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={decrease}
          disabled={quantity === 1}
          className="flex h-14 w-14 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-5 w-5" />
        </button>

        <input
          type="number"
          min={1}
          max={selectedVariant.stock}
          value={quantity}
          onChange={handleInputChange}
          className="h-14 w-20 border-x border-slate-200 text-center text-lg font-semibold outline-none"
        />

        <button
          type="button"
          onClick={increase}
          disabled={quantity >= selectedVariant.stock}
          className="flex h-14 w-14 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
