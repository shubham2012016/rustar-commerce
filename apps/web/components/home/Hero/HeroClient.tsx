"use client"

import { useMemo, useState } from "react"

import HeroDesktop from "./HeroDesktop"
import HeroMobile from "./HeroMobile"
import type { HeroProduct, HeroSlide } from "./types"

interface HeroClientProps {
  products: HeroProduct[]
}

export default function HeroClient({ products }: HeroClientProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = useMemo<HeroSlide[]>(() => {
    return products.map((product) => ({
      id: product.id,

      title: product.name,

      subtitle:
        product.subtitle || "Professional automotive care for cars and bikes.",

      image: product.image,

      primaryButton: {
        label: "View Product",
        href: `/products/${product.slug}`,
      },

      secondaryButton: {
        label: "Shop All",
        href: "/shop",
      },

      background: "light",
    }))
  }, [products])

  if (products.length === 0) {
    return null
  }

  return (
    <>
      <HeroDesktop
        products={products}
        slides={slides}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <HeroMobile
        products={products}
        slides={slides}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  )
}
