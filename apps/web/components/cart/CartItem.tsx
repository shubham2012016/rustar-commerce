import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"

export default function CartItem() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src="/products/chain-lube/1.webp"
            alt="Bike Chain Lubricant"
            fill
            className="object-contain p-4"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900">
            Rustar Chem Premium Bike Chain Lubricant
          </h3>

          <p className="mt-2 text-slate-500">
            500 ml
          </p>

          <p className="mt-4 text-2xl font-bold text-slate-900">
            ₹399
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-slate-200">
              <button
                type="button"
                className="p-3 hover:bg-slate-100"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="px-5 font-semibold">
                1
              </span>

              <button
                type="button"
                className="p-3 hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}