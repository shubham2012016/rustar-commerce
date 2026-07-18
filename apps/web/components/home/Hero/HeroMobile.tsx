"use client"

import HeroSliderMobile from "./HeroSliderMobile"
import ProductCarousel from "./ProductCarousel"

interface HeroMobileProps {
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function HeroMobile({
  activeIndex,
  setActiveIndex,
}: HeroMobileProps) {
  return (
    <section className="space-y-8 px-4 py-5 lg:hidden">
      <HeroSliderMobile
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <section className="mt-2">
        <div className="mb-6 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              Featured Products
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Best Sellers
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Explore our most loved automotive care products.
            </p>
          </div>
        </div>

        <ProductCarousel
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </section>
    </section>
  )
}