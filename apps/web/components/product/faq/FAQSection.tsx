import { PRODUCT } from "@/data/products/product.data"

import FAQItem from "./FAQItem"

export default function FAQSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 text-center">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Questions & Answers
        </span>

        <h2 className="mt-4 text-4xl font-bold text-slate-900">
          Frequently Asked Questions
        </h2>

        <p className="mt-4 text-slate-600">
          Everything you need to know before purchasing.
        </p>
      </div>

      <div className="space-y-5">
        {PRODUCT.faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </section>
  )
}