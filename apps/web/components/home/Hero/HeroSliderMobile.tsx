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

      <div className="absolute inset-0 overflow-hidden">
        {/* Top Glow */}

        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[90px]" />

        {/* Right Accent */}

        <div className="absolute top-24 -right-16 h-64 w-64 rounded-full bg-sky-300/20 blur-[90px]" />

        {/* Bottom Accent */}

        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-300/10 blur-[100px]" />

        {/* Decorative Rings */}

        <div className="absolute top-[170px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full border border-slate-200/60" />

        <div className="absolute top-[195px] left-1/2 h-[270px] w-[270px] -translate-x-1/2 rounded-full border border-slate-200/50" />

        {/* Floating Decorative Shapes */}

        <div className="absolute top-32 left-10 h-3 w-3 rounded-full bg-blue-500/30" />

        <div className="absolute top-48 right-12 h-2 w-2 rounded-full bg-sky-500/40" />

        <div className="absolute bottom-28 left-16 h-2 w-2 rounded-full bg-slate-400/30" />
      </div>

      <div className="relative px-6 pt-6 pb-8">
        {/* Badge */}

        <div className="flex justify-center">
          <span className="rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-blue-700 uppercase">
            PROFESSIONAL AUTOMOTIVE CARE
          </span>
        </div>

        {/* Product */}

        <div className="relative mt-4 flex justify-center">
          <div className="absolute top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute top-1/2 h-60 w-60 -translate-y-1/2 rounded-full border border-white/70" />

          <Image
            src={slide.image}
            alt={slide.title}
            width={380}
            height={380}
            priority
            className="relative z-10 h-[300px] w-auto animate-[float_4s_ease-in-out_infinite] object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,.22)]"
          />
        </div>

        {/* Heading */}

        <div className="mt-4 text-center">
          <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-[36px] leading-none font-black tracking-tight text-transparent">
            {slide.title}
          </h1>

          <p className="mx-auto mt-3 max-w-[290px] text-[15px] leading-6 text-slate-600">
            {slide.subtitle}
          </p>
        </div>

        {/* Buttons */}

        <div className="mt-6 space-y-4">
          <Link
            href={slide.primaryButton.href}
            className="group flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 text-base font-semibold text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700"
          >
            {slide.primaryButton.label}

            <ArrowRight
              size={18}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href={slide.secondaryButton.href}
            className="flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            {slide.secondaryButton.label}
          </Link>
        </div>

        {/* Indicators */}

        <div className="mt-5 flex justify-center gap-3">
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
