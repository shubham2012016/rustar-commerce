"use client"

import {
  ShieldCheck,
  Truck,
  Users,
  BadgeCheck,
} from "lucide-react"

import { Feature } from "./types"

interface Props {
  feature: Feature
}

export default function FeatureCard({
  feature,
}: Props) {
  const icons = {
    shield: ShieldCheck,
    truck: Truck,
    users: Users,
    badge: BadgeCheck,
  }

  const Icon =
    icons[feature.icon as keyof typeof icons]

  return (
    <div className="rounded-3xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 inline-flex rounded-2xl bg-blue-100 p-4">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>

      <h3 className="text-2xl font-bold">
        {feature.title}
      </h3>

      <p className="mt-4 text-slate-600">
        {feature.description}
      </p>
    </div>
  )
}