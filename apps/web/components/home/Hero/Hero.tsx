"use client"

import { useState } from "react"

import HeroDesktop from "./HeroDesktop"
import HeroMobile from "./HeroMobile"

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <HeroDesktop activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <HeroMobile activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </>
  )
}
