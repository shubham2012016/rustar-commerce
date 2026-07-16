"use client"

import Image from "next/image"
import { useEffect } from "react"

import { heroSlides } from "./hero.data"

interface HeroSliderProps {
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function HeroSlider({
  activeIndex,
  setActiveIndex,
}: HeroSliderProps) {
  const slide = heroSlides[activeIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [setActiveIndex])

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-14">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-20 left-20 h-52 w-52 rounded-full bg-sky-200/30 blur-3xl" />

      <div
        key={slide.id}
        className="grid animate-in grid-cols-2 items-center gap-8 fade-in duration-500"
      >
        <div>
          <h1 className="text-6xl font-bold leading-tight">
            {slide.title}
          </h1>

          <p className="mt-6 max-w-lg text-lg text-gray-600">
            {slide.subtitle}
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-xl bg-blue-600 px-6 py-3 text-white">
              {slide.primaryButton.label}
            </button>

            <button className="rounded-xl border px-6 py-3">
              {slide.secondaryButton.label}
            </button>
          </div>
        </div>

        <div className="relative flex justify-center">
          <Image
            src={slide.image}
            alt={slide.title}
            width={520}
            height={520}
            className="drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      </div>

      <button
        onClick={() =>
          setActiveIndex(
            (activeIndex - 1 + heroSlides.length) % heroSlides.length
          )
        }
        className="absolute top-1/2 left-6 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
      >
        ←
      </button>

      <button
        onClick={() =>
          setActiveIndex(
            (activeIndex + 1) % heroSlides.length
          )
        }
        className="absolute top-1/2 right-6 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
      >
        →
      </button>

      <div className="mt-10 flex gap-3">
        {heroSlides.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={`h-3 rounded-full transition-all ${
              activeIndex === index
                ? "w-10 bg-blue-600"
                : "w-3 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}