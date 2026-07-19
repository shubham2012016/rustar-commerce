import type { ReactNode } from "react"

interface ProductLayoutProps {
  children: ReactNode
}

export default function ProductLayout({
  children,
}: ProductLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      {children}
    </main>
  )
}