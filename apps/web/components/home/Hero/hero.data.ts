import type { HeroSlide } from "./types"

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
