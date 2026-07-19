"use client"

import { useState } from "react"

import { PRODUCT } from "@/data/products/product.data"

import GalleryActions from "./GalleryActions"
import ImageLightbox from "./ImageLightbox"
import ImageThumbnail from "./ImageThumbnail"
import ImageZoom from "./ImageZoom"

export default function ImageGallery() {
  const images = PRODUCT.images

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  function previousImage() {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  function nextImage() {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[96px_1fr]">
        {/* Thumbnail Column */}

        <div className="order-2 flex gap-4 overflow-x-auto lg:order-1 lg:flex-col">
          {images.map((image, index) => (
            <ImageThumbnail
              key={image.id}
              image={image}
              active={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        {/* Main Image */}

        <div className="order-1 lg:order-2">
          <div className="relative">
            <ImageZoom image={images[selectedIndex]} />

            <GalleryActions
              onFullscreen={() => setLightboxOpen(true)}
              onWishlist={() => {
                console.log("Wishlist")
              }}
              onShare={() => {
                if (navigator.share) {
                  navigator.share({
                    title: PRODUCT.name,
                    text: PRODUCT.shortDescription,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
            />
          </div>
        </div>
      </div>

      <ImageLightbox
        images={images}
        currentIndex={selectedIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={previousImage}
        onNext={nextImage}
      />
    </>
  )
}
