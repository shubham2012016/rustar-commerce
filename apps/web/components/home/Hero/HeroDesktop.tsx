import HeroSlider from "./HeroSlider"
import ProductCarousel from "./ProductCarousel"

interface HeroDesktopProps {
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function HeroDesktop({
  activeIndex,
  setActiveIndex,
}: HeroDesktopProps) {
  return (
    <section className="hidden py-12 lg:block">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 items-center gap-8">
          {/* Left */}
          <div className="col-span-6">
            <HeroSlider
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>

          {/* Right */}
          <div className="col-span-6 rounded-3xl border bg-slate-50 p-8">
            <ProductCarousel
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
