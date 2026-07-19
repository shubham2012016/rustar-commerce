"use client"

import Image from "next/image"
import clsx from "clsx"

import type { ProductImage } from "@/types"

interface ImageThumbnailProps {
  image: ProductImage
  active: boolean
  onClick: () => void
}

export default function ImageThumbnail({
  image,
  active,
  onClick,
}: ImageThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group relative aspect-square w-20 overflow-hidden rounded-2xl border transition-all duration-300",
        active
          ? "border-blue-600 ring-2 ring-blue-500/30"
          : "border-slate-200 hover:border-blue-400"
      )}
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes="80px"
        className="object-cover transition duration-300 group-hover:scale-105"
      />
    </button>
  )
}
