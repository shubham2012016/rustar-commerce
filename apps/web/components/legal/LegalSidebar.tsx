"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarItem {
  id: string
  label: string
}

interface LegalSidebarProps {
  items: SidebarItem[]
}

export default function LegalSidebar({
  items,
}: LegalSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          On this page
        </h2>

        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}