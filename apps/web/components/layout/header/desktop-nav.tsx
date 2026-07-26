"use client"

import Link from "next/link"
import { navigation } from "./navigation"
import MegaMenu from "./mega-menu"

export default function DesktopNav() {
  return (
    <div className="hidden items-center gap-10 lg:flex">
      {navigation.map((item) => (
        <div key={item.label} className="group relative">
          <Link
            href={item.href}
            className="relative font-medium text-slate-700 hover:text-blue-600"
          >
            {item.label}
          </Link>

          {item.megaMenu && (
            <MegaMenu type={item.label === "Shop" ? "shop" : "categories"} />
          )}
        </div>
      ))}
    </div>
  )
}
