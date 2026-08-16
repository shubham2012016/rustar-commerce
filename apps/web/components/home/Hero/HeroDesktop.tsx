import type { HttpTypes } from "@medusajs/types"

import HeroSlider from "./HeroSlider"
import ProductCarousel from "./ProductCarousel"

interface HeroDesktopProps {
  products: HttpTypes.StoreProduct[]
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function HeroDesktop({
  products,
  activeIndex,
  setActiveIndex,
}: HeroDesktopProps) {
  const leftProducts = products.slice(0, 3)
  const rightProducts = products.slice(3, 6)

  return (
    <section className="hidden py-12 lg:block">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 items-center gap-8">
          {/* Left */}
          <div className="col-span-6">
            <HeroSlider
              products={leftProducts}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>

          {/* Right */}
          <div className="col-span-6 rounded-3xl border bg-slate-50 p-8">
            <ProductCarousel products={rightProducts} />
          </div>
        </div>
      </div>
    </section>
  )
}
