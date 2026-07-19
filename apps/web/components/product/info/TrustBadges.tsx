import { Award, ShieldCheck, Sparkles, Truck } from "lucide-react"

const BADGES = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
  },
  {
    icon: Award,
    title: "Premium Quality",
  },
  {
    icon: Sparkles,
    title: "Made in India",
  },
]

export default function TrustBadges() {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {BADGES.map((badge) => {
        const Icon = badge.icon

        return (
          <div
            key={badge.title}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>

            <span className="font-semibold text-slate-800">{badge.title}</span>
          </div>
        )
      })}
    </section>
  )
}
