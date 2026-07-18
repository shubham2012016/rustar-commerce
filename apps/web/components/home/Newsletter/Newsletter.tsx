import { ArrowRight, Mail } from "lucide-react"

export default function Newsletter() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8 text-white shadow-[0_30px_80px_rgba(37,99,235,0.35)] md:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <Mail className="h-8 w-8" />
            </div>

            <h2 className="mt-8 text-4xl font-black md:text-5xl">
              Stay Updated with Rustar Chem
            </h2>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Subscribe to receive exclusive offers, new product launches,
              detailing tips and dealer updates.
            </p>

            <div className="mt-10 flex flex-col gap-4 md:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-14 flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 text-white placeholder:text-blue-100 focus:outline-none"
              />

              <button
                type="button"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 font-semibold text-blue-700 transition hover:scale-[1.02]"
              >
                Subscribe
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-5 text-sm text-blue-100">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
