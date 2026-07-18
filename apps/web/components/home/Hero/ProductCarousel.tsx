"use client"

import { useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"

import HeroProductCard from "./HeroProductCard"
import { heroProducts } from "./hero.data"

interface ProductCarouselProps {
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function ProductCarousel({
  activeIndex,
  setActiveIndex,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  })

  /**
   * Hero controls the active slide.
   * Carousel simply follows Hero.
   */
  useEffect(() => {
    if (!emblaApi) return

    if (emblaApi.selectedScrollSnap() !== activeIndex) {
      emblaApi.scrollTo(activeIndex)
    }
  }, [activeIndex, emblaApi])

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="-ml-2 flex">
        {heroProducts.map((product, index) => {
          const active = index === activeIndex

          return (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_84%] pl-2 sm:flex-[0_0_62%] lg:flex-[0_0_33.333%]"
            >
              <div
                onClick={() => setActiveIndex(index)}
                className={`cursor-pointer transition-all duration-500 ${
                  active ? "opacity-100" : "opacity-75 lg:opacity-100"
                } `}
              >
                <HeroProductCard product={product} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
