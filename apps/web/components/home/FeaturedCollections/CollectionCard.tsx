"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Collection } from "./types"

interface Props {
  collection: Collection
  featured?: boolean
}

export default function CollectionCard({
  collection,
  featured = false,
}: Props) {
  return (
    <Link
      href={collection.href}
      className="group relative block overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]"
    >
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl transition duration-500 group-hover:scale-125" />

      <div className={`relative ${featured ? "h-[420px]" : "h-[340px]"}`}>
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-8 text-white">
        <div className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          {collection.productCount} Products
        </div>

        <h3
          className={`mt-5 ${
            featured ? "text-5xl" : "text-3xl"
          } leading-tight font-black`}
        >
          {collection.title}
        </h3>

        <p className="mt-4 max-w-lg text-white/80">{collection.description}</p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition-all group-hover:gap-4">
          Shop Collection
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  )
}
