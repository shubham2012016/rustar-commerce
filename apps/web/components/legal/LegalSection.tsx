import { ReactNode } from "react"

interface LegalSectionProps {
  id?: string
  title: string
  children: ReactNode
}

export default function LegalSection({
  id,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      <div className="prose prose-slate prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-8 prose-li:text-slate-600 prose-li:leading-8 prose-strong:text-slate-900 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-700 max-w-none">
        {children}
      </div>
    </section>
  )
}
