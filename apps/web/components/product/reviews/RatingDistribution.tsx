import { PRODUCT } from "@/data/products/product.data"

export default function RatingDistribution() {
  const total = PRODUCT.ratingDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  )

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Rating Breakdown
      </h2>

      <div className="space-y-5">
        {PRODUCT.ratingDistribution
          .slice()
          .sort((a, b) => b.stars - a.stars)
          .map((item) => {
            const percentage =
              total === 0 ? 0 : (item.count / total) * 100

            return (
              <div
                key={`rating-${item.stars}-${item.count}`}
                className="grid grid-cols-[50px_1fr_60px] items-center gap-4"
              >
                <span className="text-sm font-semibold text-slate-700">
                  {item.stars} &#9733;
                </span>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="text-right text-sm text-slate-500">
                  {item.count}
                </span>
              </div>
            )
          })}
      </div>
    </section>
  )
}
