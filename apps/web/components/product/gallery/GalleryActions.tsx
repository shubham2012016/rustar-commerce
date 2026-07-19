"use client"

import { Heart, Share2, Expand } from "lucide-react"

interface GalleryActionsProps {
  onWishlist?: () => void
  onShare?: () => void
  onFullscreen?: () => void
}

export default function GalleryActions({
  onWishlist,
  onShare,
  onFullscreen,
}: GalleryActionsProps) {
  const buttonClass =
    "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white hover:shadow-blue-500/30"

  return (
    <div className="absolute top-5 right-5 z-20 flex flex-col gap-3">
      <button
        type="button"
        aria-label="Add to wishlist"
        className={buttonClass}
        onClick={onWishlist}
      >
        <Heart className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Share product"
        className={buttonClass}
        onClick={onShare}
      >
        <Share2 className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="View fullscreen"
        className={buttonClass}
        onClick={onFullscreen}
      >
        <Expand className="h-5 w-5" />
      </button>
    </div>
  )
}
