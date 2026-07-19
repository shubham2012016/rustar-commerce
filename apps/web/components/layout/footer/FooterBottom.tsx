import Link from "next/link"

import { PAYMENT_METHODS } from "./payment.data"

const LEGAL_LINKS = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
  {
    label: "Shipping Policy",
    href: "/shipping-policy",
  },
  {
    label: "Return Policy",
    href: "/return-policy",
  },
]

export default function FooterBottom() {
  return (
    <section className="mt-20 border-t border-white/10 pt-10">
      <div className="flex flex-col gap-10">
        {/* Top Row */}

        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          {/* Payment Methods */}

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Accepted Payments
            </p>

            <div className="flex flex-wrap gap-3">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.label}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/10"
                >
                  {method.label}
                </div>
              ))}
            </div>
          </div>

          {/* Quality Badge */}

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Proudly Made in India 🇮🇳
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Premium automotive care products engineered for Indian roads.
            </p>
          </div>
        </div>

        {/* Bottom Row */}

        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Rustar Chem. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}