"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { ArrowRight } from "lucide-react"

import { heroSlides } from "./hero.data"

interface HeroSliderMobileProps {
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function HeroSliderMobile({
  activeIndex,
  setActiveIndex,
}: HeroSliderMobileProps) {
  const slide = heroSlides[activeIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [setActiveIndex])

  return (
    <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute top-24 right-[-70px] h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="absolute bottom-[-70px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative px-6 pt-10 pb-12">
        {/* Badge */}

        <div className="flex justify-center">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-bold tracking-[0.25em] text-blue-700 uppercase">
            PROFESSIONAL AUTOMOTIVE CARE
          </span>
        </div>

        {/* Product */}

        <div className="relative mt-8 flex justify-center">
          <div className="absolute top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute top-1/2 h-52 w-52 -translate-y-1/2 rounded-full border border-white/70" />

          <Image
            src={slide.image}
            alt={slide.title}
            width={320}
            height={320}
            priority
            className="relative z-10 h-72 w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,.18)] transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Heading */}

        <div className="mt-8 text-center">
          <h1 className="text-[42px] leading-[1.05] font-black tracking-tight text-slate-900">
            {slide.title}
          </h1>

          <p className="mx-auto mt-5 max-w-xs text-[17px] leading-8 text-slate-600">
            {slide.subtitle}
          </p>
        </div>

        {/* Buttons */}

        <div className="mt-10 space-y-4">
          <Link
            href={slide.primaryButton.href}
            className="group flex h-14 items-center justify-center rounded-2xl bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700"
          >
            {slide.primaryButton.label}

            <ArrowRight
              size={18}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href={slide.secondaryButton.href}
            className="flex h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            {slide.secondaryButton.label}
          </Link>
        </div>

        {/* Indicators */}

        <div className="mt-8 flex justify-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 ${
                activeIndex === index
                  ? "h-2.5 w-10 rounded-full bg-blue-600"
                  : "h-2.5 w-2.5 rounded-full bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
