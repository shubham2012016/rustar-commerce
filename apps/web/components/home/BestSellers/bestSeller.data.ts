import { Product } from "./types"

export const bestSellerProducts: Product[] = [
  {
    id: 1,
    name: "Car & Bike Shampoo",
    slug: "car-bike-shampoo",
    image: "/products/car_bike_shampoo.webp",

    brand: "Rustar Chem",

    price: 299,
    originalPrice: 399,

    rating: 4.8,
    reviews: 1248,

    badge: "Best Seller",

    inStock: true,
  },

  {
    id: 2,
    name: "Chain Lubricant",
    slug: "chain-lubricant",
    image: "/products/chain_lube.webp",

    brand: "Rustar Chem",

    price: 349,
    originalPrice: 449,

    rating: 4.9,
    reviews: 853,

    badge: "Popular",

    inStock: true,
  },

  {
    id: 3,
    name: "Dashboard Polish",
    slug: "dashboard-polish",
    image: "/products/all_in_liquid_polish.webp",

    brand: "Rustar Chem",

    price: 249,
    originalPrice: 329,

    rating: 4.7,
    reviews: 652,

    inStock: true,
  },

  {
    id: 4,
    name: "Tyre Polish",

    slug: "tyre-polish",

    image: "/products/tyre_polish.webp",

    brand: "Rustar Chem",

    price: 279,

    originalPrice: 349,

    rating: 4.8,

    reviews: 492,

    badge: "New",

    inStock: true,
  },

  {
    id: 5,
    name: "Glass Cleaner",

    slug: "glass-cleaner",

    image: "/products/glass_cleaner.webp",

    brand: "Rustar Chem",

    price: 229,

    originalPrice: 299,

    rating: 4.7,

    reviews: 376,

    inStock: true,
  },

  {
    id: 6,
    name: "Foam Cleaner",

    slug: "foam-cleaner",

    image: "/products/foam_cleaner.webp",

    brand: "Rustar Chem",

    price: 319,

    originalPrice: 399,

    rating: 4.9,

    reviews: 582,

    badge: "Trending",

    inStock: true,
  },
]