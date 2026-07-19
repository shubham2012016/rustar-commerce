import Link from "next/link"

import { ArrowRight } from "lucide-react"

interface Props {
  title: string
  description: string
  products: number
}

export default function CategoryCard({
  title,
  description,
  products,
}: Props) {
  return (
    <Link
      href="/shop"
      className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="flex h-full flex-col">
        <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {products} Products
        </span>

        <h3 className="mt-6 text-3xl font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-4 flex-1 leading-7 text-slate-600">
          {description}
        </p>

        <div className="mt-8 flex items-center gap-2 font-semibold text-blue-600">
          Explore

          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}