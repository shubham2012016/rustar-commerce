"use client";

import { MessageSquarePlus } from "lucide-react"

export default function WriteReviewButton() {
  const handleWriteReview = () => {
    // TODO:
    // Open review modal
    // Check authentication
    // Verify purchase
    // Submit review to backend
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Share Your Experience
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Purchased this product? Help other customers by sharing your honest
        experience and rating.
      </p>

      <button
        type="button"
        onClick={handleWriteReview}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
      >
        <MessageSquarePlus className="h-5 w-5" />
        Write a Review
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">
        Only verified customers can submit reviews.
      </p>
    </section>
  )
}
