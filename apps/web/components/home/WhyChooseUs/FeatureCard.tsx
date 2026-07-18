"use client"

import { BadgeCheck, ShieldCheck, Truck, Users } from "lucide-react"

import { Feature } from "./types"

interface Props {
  feature: Feature
}

export default function FeatureCard({ feature }: Props) {
  const icons = {
    shield: ShieldCheck,
    truck: Truck,
    users: Users,
    badge: BadgeCheck,
  }

  const Icon = icons[feature.icon as keyof typeof icons]

  return (
    <div className="group relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]">
      {/* Glow */}
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-blue-100/60 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="relative z-10">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white shadow-lg">
          <Icon className="h-8 w-8" />
        </div>

        <h3 className="mt-7 text-2xl font-bold text-slate-900">
          {feature.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-600">{feature.description}</p>

        <div className="mt-8 h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 group-hover:w-20" />
      </div>
    </div>
  )
}
