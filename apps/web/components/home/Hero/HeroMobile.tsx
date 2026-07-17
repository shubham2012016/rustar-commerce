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

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              Featured Products
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Best Sellers
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
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