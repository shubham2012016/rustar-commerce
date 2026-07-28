import { CalendarDays, FileText } from "lucide-react"

interface LegalHeroProps {
  title: string
  description: string
  lastUpdated?: string
}

export default function LegalHero({
  title,
  description,
  lastUpdated,
}: LegalHeroProps) {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300">
            <FileText className="h-4 w-4" />
            Legal Information
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
            {title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">{description}</p>

          {lastUpdated && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <CalendarDays className="h-4 w-4 text-orange-400" />
              Last Updated: {lastUpdated}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
