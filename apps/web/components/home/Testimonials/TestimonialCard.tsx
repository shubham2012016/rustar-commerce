"use client"

import { BadgeCheck, Star } from "lucide-react"

import { Testimonial } from "./types"

interface Props {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
      {/* Glow */}
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-blue-100/60 blur-3xl transition-all duration-500 group-hover:scale-125" />

      {/* Avatar */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xl font-bold text-white shadow-lg">
          {testimonial.initials}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {testimonial.name}
          </h3>

          <p className="text-sm text-slate-500">{testimonial.location}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-6 flex items-center gap-1">
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      {/* Review */}
      <p className="mt-6 leading-8 text-slate-600">
        &quot;{testimonial.review}&quot;
      </p>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900">{testimonial.product}</p>

          <p className="text-sm text-slate-500">Purchased Product</p>
        </div>

        {testimonial.verified && (
          <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            <BadgeCheck size={16} />
            Verified
          </div>
        )}
      </div>
    </div>
  )
}
