"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import type { HttpTypes } from "@medusajs/types"

interface HeroSliderProps {
  products: HttpTypes.StoreProduct[]
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function HeroSlider({
  products,
  activeIndex,
  setActiveIndex,
}: HeroSliderProps) {
  const heroProducts = products.filter(
    (product) =>
      Boolean(product.variants?.[0]) &&
      Boolean(product.thumbnail ?? product.images?.[0]?.url)
  )

  const slide = heroProducts[activeIndex]

  useEffect(() => {
    if (heroProducts.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroProducts.length, setActiveIndex])

  if (!slide) {
    return null
  }

  const image = slide.thumbnail ?? slide.images?.[0]?.url ?? ""

  const productHref = `/products/${slide.handle}`

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-14">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-20 left-20 h-52 w-52 rounded-full bg-sky-200/30 blur-3xl" />

      <div
        key={slide.id}
        className="animate-in fade-in grid grid-cols-2 items-center gap-8 duration-500"
      >
        <div>
          <h1 className="text-6xl leading-tight font-bold">Choose Any Combo</h1>

          <div className="mt-10 flex gap-4">
            <Link
              href={productHref}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white"
            >
              View Product
            </Link>

            <Link href="/shop" className="rounded-xl border px-6 py-3">
              Shop Now
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <Image
            src={image}
            alt={slide.title}
            width={520}
            height={520}
            className="drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      </div>

      <button
        onClick={() =>
          setActiveIndex(
            (activeIndex - 1 + heroProducts.length) % heroProducts.length
          )
        }
        className="absolute top-1/2 left-6 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
      >
        ←
      </button>

      <button
        onClick={() => setActiveIndex((activeIndex + 1) % heroProducts.length)}
        className="absolute top-1/2 right-6 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
      >
        →
      </button>

      <div className="mt-10 flex gap-3">
        {heroProducts.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={`h-3 rounded-full transition-all ${
              activeIndex === index ? "w-10 bg-blue-600" : "w-3 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
