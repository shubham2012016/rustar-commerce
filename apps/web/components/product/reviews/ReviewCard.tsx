import { CheckCircle2, ThumbsUp } from "lucide-react"

import type { ProductReview } from "@/types"

interface ReviewCardProps {
  review: ProductReview
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
          {review.customerAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.customerAvatar}
              alt={review.customerName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            review.customerName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                {review.customerName}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={`text-lg ${
                        index < review.rating
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>

                {review.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>

            <span className="text-sm text-slate-500">{review.createdAt}</span>
          </div>

          <h4 className="mt-4 text-lg font-semibold text-slate-900">
            {review.title}
          </h4>

          <p className="mt-2 leading-7 text-slate-600">{review.review}</p>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ThumbsUp className="h-4 w-4" />
            Helpful
          </button>
        </div>
      </div>
    </article>
  )
}
