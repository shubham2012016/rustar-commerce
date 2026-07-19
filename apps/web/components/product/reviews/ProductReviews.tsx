import RatingDistribution from "./RatingDistribution"
import RatingSummary from "./RatingSummary"
import ReviewList from "./ReviewList"
import WriteReviewButton from "./WriteReviewButton"

export default function ProductReviews() {
  return (
    <section className="mx-auto max-w-7xl py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Customer Reviews
        </h2>

        <p className="mt-2 text-slate-600">
          Read verified customer experiences and see why thousands of riders
          trust our products.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <RatingSummary />

          <RatingDistribution />

          <WriteReviewButton />
        </div>

        <ReviewList />
      </div>
    </section>
  )
}