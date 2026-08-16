"use client"

import { useState } from "react"

import HeroDesktop from "./HeroDesktop"
import HeroMobile from "./HeroMobile"

import type { HttpTypes } from "@medusajs/types"

interface HeroProps {
  products: HttpTypes.StoreProduct[]
}

export default function Hero({ products }: HeroProps) {
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0)
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)

  return (
    <>
      <HeroDesktop
        products={products}
        activeIndex={desktopActiveIndex}
        setActiveIndex={setDesktopActiveIndex}
      />

      <HeroMobile
        products={products}
        activeIndex={mobileActiveIndex}
        setActiveIndex={setMobileActiveIndex}
      />
    </>
  )
}
