"use client"

import Image from "next/image"
import Link from "next/link"

import { Collection } from "./types"

interface Props {
  collection: Collection
}

export default function CollectionCard({
  collection,
}: Props) {
  return (
    <Link
      href={collection.href}
      className="group overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-8">
        <span className="text-sm text-blue-600 font-semibold">
          {collection.productCount} Products
        </span>

        <h3 className="text-3xl font-bold">
          {collection.title}
        </h3>

        <p className="text-slate-600">
          {collection.description}
        </p>

        <span className="inline-flex font-semibold text-blue-600">
          Shop Collection →
        </span>
      </div>
    </Link>
  )
}