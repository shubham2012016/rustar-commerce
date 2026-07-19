export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />

        <div className="space-y-6">
          <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-28 animate-pulse rounded bg-slate-200" />
          <div className="h-12 animate-pulse rounded bg-slate-200" />
          <div className="h-12 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}