"use client"

import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

import type { ProductImage } from "@/types"

interface ImageLightboxProps {
  images: ProductImage[]
  currentIndex: number
  open: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export default function ImageLightbox({
  images,
  currentIndex,
  open,
  onClose,
  onPrevious,
  onNext,
}: ImageLightboxProps) {
  if (!open) return null

  const image = images[currentIndex]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Close */}

      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Previous */}

      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      {/* Next */}

      <button
        type="button"
        onClick={onNext}
        className="absolute right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Image */}

      <div className="relative h-[85vh] w-[85vw]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          sizes="90vw"
          className="object-contain"
        />
      </div>

      {/* Counter */}

      <div className="absolute bottom-8 rounded-full bg-white/10 px-5 py-2 text-sm text-white backdrop-blur">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}   