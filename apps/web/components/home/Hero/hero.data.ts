import type { HeroProduct, HeroSlide } from "./types"

export const heroProducts: HeroProduct[] = [
  {
    id: "1",
    name: "Bike Shampoo",
    slug: "bike-shampoo",
    image: "/products/bike-shampoo/1.webp",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 1248,
    badge: {
      text: "Best Seller",
      variant: "bestseller",
    },
  },

  {
    id: "2",
    name: "Chain Lube",
    slug: "chain-lube",
    image: "/products/chain-lubricant/1.webp",
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviews: 853,
    badge: {
      text: "Popular",
      variant: "popular",
    },
  },

  {
    id: "3",
    name: "Dashboard Polish",
    slug: "dashboard-polish",
    image: "/products/dashboard-polish/1.webp",
    price: 249,
    originalPrice: 329,
    rating: 4.7,
    reviews: 652,
  },
]

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Premium Care",
    subtitle: "Professional detailing products for cars and bikes.",
    image: "/products/bike-shampoo/1.webp",

    primaryButton: {
      label: "Shop Now",
      href: "/shop",
    },

    secondaryButton: {
      label: "Explore",
      href: "/categories",
    },

    background: "light",
  },
  {
    id: "2",
    title: "Chain Lubricants",
    subtitle: "Reduce wear and improve chain life.",
    image: "/products/chain-lubricant/1.webp",

    primaryButton: {
      label: "Buy Now",
      href: "/shop",
    },

    secondaryButton: {
      label: "Learn More",
      href: "/products/chain-lube",
    },

    background: "light",
  },
  {
    id: "3",
    title: "Dashboard Polish",
    subtitle: "Restore shine and protect interiors.",
    image: "/products/dashboard-polish/1.webp",

    primaryButton: {
      label: "Shop",
      href: "/shop",
    },

    secondaryButton: {
      label: "Details",
      href: "/products/dashboard-polish",
    },

    background: "light",
  },
]
