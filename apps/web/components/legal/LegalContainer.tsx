import { ReactNode } from "react"

interface LegalContainerProps {
  children: ReactNode
}

export default function LegalContainer({ children }: LegalContainerProps) {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">{children}</div>
      </div>
    </div>
  )
}
