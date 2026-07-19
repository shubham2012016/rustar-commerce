"use client"

import { ArrowRight, Mail } from "lucide-react"

export default function FooterNewsletter() {
  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-blue-950/40 via-slate-900 to-cyan-950/30 p-8 lg:p-12">
        {/* Background Glow */}

        <div className="absolute top-0 -left-24 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
          {/* Left */}

          <div>
            <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold tracking-[0.3em] text-cyan-300 uppercase">
              Stay Updated
            </span>

            <h2 className="mt-6 text-3xl leading-tight font-black text-white lg:text-5xl">
              Get exclusive offers, product launches & detailing tips.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Subscribe to receive exclusive discounts, maintenance guides,
              detailing tutorials and updates on our newest automotive care
              products.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                Exclusive Offers
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                New Product Alerts
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                Vehicle Care Tips
              </span>
            </div>
          </div>

          {/* Right */}

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex h-full flex-col justify-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/30">
                <Mail className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Join Our Community
              </h3>

              <p className="mt-3 leading-7 text-slate-300">
                Be the first to know about discounts, launches and automotive
                detailing tips.
              </p>

              <form className="mt-8 space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white transition-all outline-none placeholder:text-slate-500 focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Subscribe Now
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-slate-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
