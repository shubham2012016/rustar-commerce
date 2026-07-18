"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  category: {
    id: number
    title: string
    description: string
    image: string
    href: string
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="group relative block overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
    >
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-100/40 blur-3xl transition-all duration-500 group-hover:scale-110" />

      {/* Product Image */}
      <div className="relative flex h-[250px] items-center justify-center overflow-hidden lg:h-[260px]">
        <div className="absolute h-44 w-44 rounded-full bg-white shadow-[0_25px_80px_rgba(37,99,235,0.12)]" />

        <Image
          src={category.image}
          alt={category.title}
          width={320}
          height={320}
          sizes="(min-width:1280px) 320px, (min-width:768px) 50vw, 100vw"
          className="relative z-10 h-[220px] w-auto object-contain drop-shadow-[0_28px_35px_rgba(15,23,42,0.18)] transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 lg:h-[240px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-7 pb-6">
        <div className="mb-3 my-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase">
          Category
        </div>

        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {category.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-[15px] leading-6 text-slate-600">
          {category.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
            Explore Category
          </span>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </Link>
  )
}
