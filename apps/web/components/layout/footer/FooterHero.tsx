import { BRAND } from "./brand.data"

export default function FooterHero() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 px-8 py-20 text-center lg:px-16">
      {/* Background Glow */}

      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
            Trusted Automotive Brand
          </span>
        </div>

        <h2 className="mx-auto mt-8 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
          Trusted by Thousands of Vehicle Owners Across India
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
          {BRAND.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300">
            ★ 4.8 Customer Rating
          </div>

          <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300">
            25,000+ Happy Customers
          </div>

          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300">
            Made for Indian Roads
          </div>
        </div>
      </div>
    </section>
  )
}