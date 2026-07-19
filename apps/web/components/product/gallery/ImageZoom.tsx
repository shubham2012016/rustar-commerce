"use client"

import Image from "next/image"
import { useState } from "react"

import type { ProductImage } from "@/types"

interface ImageZoomProps {
  image: ProductImage
}

export default function ImageZoom({ image }: ImageZoomProps) {
  const [transformOrigin, setTransformOrigin] = useState("center center")

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()

    const x = ((event.clientX - rect.left) / rect.width) * 100

    const y = ((event.clientY - rect.top) / rect.height) * 100

    setTransformOrigin(`${x}% ${y}%`)
  }

  function handleMouseLeave() {
    setTransformOrigin("center center")
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-square overflow-hidden rounded-[32px] border border-slate-200 bg-white"
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        priority
        sizes="(max-width:768px) 100vw, 50vw"
        className="object-contain p-10 transition-transform duration-300 group-hover:scale-150"
        style={{
          transformOrigin,
        }}
      />
    </div>
  )
}
