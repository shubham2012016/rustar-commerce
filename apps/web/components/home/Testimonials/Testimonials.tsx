import { Sparkles, Star } from "lucide-react"

import TestimonialCard from "./TestimonialCard"
import { testimonials } from "./testimonial.data"

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

      <div className="absolute top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="absolute -right-20 bottom-10 -z-10 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Customer Reviews
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Trusted by
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Thousands of Customers
            </span>
          </h2>

          <div className="mt-8 flex flex-col items-center">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={22}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <h3 className="mt-4 text-5xl font-black text-slate-900">4.8 / 5</h3>

            <p className="mt-2 text-slate-600">
              Based on 8,500+ verified customer reviews
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          {[
            { value: "5000+", label: "Happy Customers" },
            { value: "98%", label: "Repeat Purchase Rate" },
            { value: "50+", label: "Premium Products" },
            { value: "4.8★", label: "Average Rating" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <h3 className="text-5xl font-black text-blue-600">
                {item.value}
              </h3>

              <p className="mt-2 text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
