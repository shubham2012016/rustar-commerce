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
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-50">
        <Image
          src={category.image}
          alt={category.title}
          width={220}
          height={220}
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="space-y-3 p-6">
        <h3 className="text-2xl font-bold text-slate-900">{category.title}</h3>

        <p className="text-sm leading-6 text-slate-600">
          {category.description}
        </p>

        <div className="flex items-center gap-2 pt-2 font-semibold text-blue-600 transition-all group-hover:gap-3">
          <span>Explore</span>
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  )
}
