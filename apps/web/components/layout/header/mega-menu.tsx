"use client"

import Link from "next/link"
import { megaMenu } from "./mega-menu.data"

interface Props {
  type: "shop" | "categories"
}

export default function MegaMenu({ type }: Props) {
  const menu = megaMenu[type]

  return (
    <div className="absolute left-0 top-full mt-5 hidden w-[900px] rounded-3xl border bg-white p-8 shadow-2xl group-hover:block">
      <div className="grid grid-cols-3 gap-10">
        {menu.sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-5 text-lg font-semibold">
              {section.title}
            </h3>

            <div className="space-y-3">
              {section.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-slate-600 transition hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}