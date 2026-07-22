"use client"

import { useProduct } from "@/components/product/context/ProductContext"

import ReviewCard from "./ReviewCard"

export default function ReviewList() {
  const { product } = useProduct()

  if (!product.reviews.length) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-slate-900">No Reviews Yet</h3>

        <p className="mt-2 text-slate-500">
          Be the first customer to review this product.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {product.reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </section>
  )
}
