import Link from "next/link"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"

import { BRAND } from "./brand.data"
import { FOOTER_LINKS } from "./links.data"
import { SOCIALS } from "./social.data"

export default function FooterLinks() {
  return (
    <section className="mt-20">
      <div className="grid gap-14 lg:grid-cols-12">
        {/* ================================================= */}
        {/* Brand */}
        {/* ================================================= */}

        <div className="lg:col-span-4">
          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.3em] text-blue-300 uppercase">
            {BRAND.tagline}
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-white">
            {BRAND.name}
          </h2>

          <p className="mt-6 max-w-md leading-8 text-slate-300">
            {BRAND.description}
          </p>

          {/* Social */}

          <div className="mt-10 flex flex-wrap gap-4">
            {SOCIALS.map((social) => {
              const Icon = social.icon

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600"
                >
                  <Icon
                    size={20}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* ================================================= */}
        {/* Navigation */}
        {/* ================================================= */}

        {FOOTER_LINKS.map((group) => (
          <div key={group.title} className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white">{group.title}</h3>

            <div className="mt-8 space-y-4">
              {group.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-2 text-slate-300 transition-colors duration-300 hover:text-white"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />

                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* ================================================= */}
        {/* Contact */}
        {/* ================================================= */}

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-white">Contact</h3>

          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-cyan-400" />

                <div>
                  <p className="font-semibold text-white">Address</p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {BRAND.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 text-cyan-400" />

                <div>
                  <p className="font-semibold text-white">Phone</p>

                  <p className="mt-1 text-sm text-slate-300">{BRAND.phone}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 text-cyan-400" />

                <div>
                  <p className="font-semibold text-white">Email</p>

                  <p className="mt-1 text-sm break-all text-slate-300">
                    {BRAND.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
