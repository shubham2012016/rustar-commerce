"use client"

import { useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"

import { heroProducts } from "./hero.data"
import HeroProductCard from "./HeroProductCard"

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
    dragFree: false,
  })

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.scrollTo(activeIndex)
  }, [activeIndex, emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, setActiveIndex])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {heroProducts.map((product, index) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_33.3333%] px-3"
              onClick={() => setActiveIndex(index)}
            >
              <HeroProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
