"use client"

import Image from "next/image"
import { Search } from "lucide-react"

import { heroProducts } from "./hero.data"

export default function HeroMobile() {
  return (
    <section className="overflow-hidden rounded-b-[36px] bg-gradient-to-br from-[#dfe8df] via-[#d7e2d8] to-[#cfdccf] px-4 pt-4 pb-10 lg:hidden">
      {/* Logo */}

      <div className="inline-flex rounded-xl bg-white px-4 py-2 shadow-md">
        <span className="text-xl font-bold">
          Rustar <span className="text-blue-600">Chem</span>
        </span>
      </div>

      {/* Search */}

      <div className="relative mt-4">
        <Search
          size={18}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
        />

        <input
          placeholder="Search for products..."
          className="h-12 w-full rounded-full bg-white pr-5 pl-11 text-sm shadow-md outline-none"
        />
      </div>

      {/* Heading */}

      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold text-white">Premium Class</h1>

        <p className="mt-2 text-white/80">
          Ultimate Protection & Extreme Gloss
        </p>
      </div>

      {/* Products */}

      <div className="scrollbar-hide mt-8 flex gap-4 overflow-x-auto pb-2">
        {heroProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[180px] rounded-3xl bg-white p-4 shadow-xl"
          >
            <div className="flex justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={120}
                height={120}
                className="h-32 w-auto object-contain"
              />
            </div>

            <h3 className="mt-4 line-clamp-2 font-semibold">{product.name}</h3>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-yellow-500">★</span>

              <span className="text-sm">{product.rating}</span>

              <span className="text-xs text-slate-500">
                ({product.reviews})
              </span>
            </div>

            <div className="mt-3 text-xl font-bold">₹{product.price}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
