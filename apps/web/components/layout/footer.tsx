import { ShieldCheck, Truck, Star, BadgeCheck } from "lucide-react"

import FooterLinks from "./FooterLinks"
import FooterBottom from "./FooterBottom"

const trustCards = [
  {
    title: "Fast Nationwide Delivery",
    description: "Quick & reliable shipping across India.",
    icon: Truck,
  },
  {
    title: "Premium Quality",
    description: "Professional-grade automotive chemicals.",
    icon: Star,
  },
  {
    title: "Secure Payments",
    description: "100% encrypted & trusted payment gateway.",
    icon: ShieldCheck,
  },
  {
    title: "Made in India",
    description: "Proudly manufactured for Indian roads.",
    icon: BadgeCheck,
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#030817] text-white">
      {/* ================================================= */}
      {/* Top Accent */}
      {/* ================================================= */}

      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

      {/* ================================================= */}
      {/* Background Glow */}
      {/* ================================================= */}

      <div className="absolute top-0 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_55%)]" />

      {/* ================================================= */}
      {/* Content */}
      {/* ================================================= */}

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        {/* ============================ */}
        {/* Heading */}
        {/* ============================ */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-xs font-semibold tracking-[0.28em] text-blue-300 uppercase">
            Trusted Automotive Brand
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
            Trusted by Thousands of Vehicle Owners
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Premium car care, bike care and maintenance products engineered for
            enthusiasts, professionals and workshops across India.
          </p>
        </div>

        {/* ============================ */}
        {/* Trust Cards */}
        {/* ============================ */}

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustCards.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/30 transition-transform duration-300 group-hover:scale-110">
                <Icon size={26} />
              </div>

              <h3 className="mt-6 text-xl font-bold">{title}</h3>

              <p className="mt-3 leading-7 text-slate-300">{description}</p>
            </div>
          ))}
        </div>

        {/* Divider */}

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ============================ */}
        {/* Footer Links */}
        {/* ============================ */}

        <FooterLinks />

        {/* ============================ */}
        {/* Footer Bottom */}
        {/* ============================ */}

        <FooterBottom />
      </div>
    </footer>
  )
}
