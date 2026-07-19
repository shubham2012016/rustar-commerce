import { TRUST_ITEMS } from "./trust.data"

export default function FooterTrust() {
  return (
    <section className="mt-14">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-white/[0.07]"
            >
              {/* Glow */}

              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-600/10 blur-3xl transition-all duration-500 group-hover:bg-blue-600/20" />

              {/* Icon */}

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-lg shadow-blue-600/30 transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Icon
                  size={30}
                  className="text-white"
                />
              </div>

              {/* Title */}

              <h3 className="relative mt-8 text-2xl font-bold text-white">
                {item.title}
              </h3>

              {/* Description */}

              <p className="relative mt-4 leading-8 text-slate-300">
                {item.description}
              </p>

              {/* Bottom Accent */}

              <div className="relative mt-8 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 group-hover:w-28" />
            </div>
          )
        })}
      </div>
    </section>
  )
}