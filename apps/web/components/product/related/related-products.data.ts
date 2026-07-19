import type { Product } from "@/types"

export const RELATED_PRODUCTS: Product[] = [
  {
    id: "bike-shampoo",
    slug: "bike-shampoo",
    sku: "RC-BS-500",
    name: "Rustar Chem Bike Shampoo",
    shortDescription: "Premium bike shampoo.",
    description: "High foam pH-neutral bike shampoo.",
    brand: "Rustar Chem",
    category: "Bike Care",

    price: 299,
    compareAtPrice: 399,
    currency: "INR",

    rating: 4.8,
    reviewCount: 824,

    stock: 50,

    images: [
      {
        id: "1",
        url: "/products/bike-shampoo/1.webp",
        alt: "Bike Shampoo",
      },
    ],

    variants: [],
    features: [],
    specifications: [],
    faqs: [],
    reviews: [],
    ratingDistribution: [],
    tags: [],
    badges: ["Best Seller"],
  },

  {
    id: "car-shampoo",
    slug: "car-shampoo",
    sku: "RC-CS-500",
    name: "Rustar Chem Car Shampoo",
    shortDescription: "Premium car shampoo.",
    description: "Rich foam with paint protection.",

    brand: "Rustar Chem",
    category: "Car Care",

    price: 349,
    compareAtPrice: 449,
    currency: "INR",

    rating: 4.9,
    reviewCount: 962,

    stock: 60,

    images: [
      {
        id: "1",
        url: "/products/car-shampoo/1.webp",
        alt: "Car Shampoo",
      },
    ],

    variants: [],
    features: [],
    specifications: [],
    faqs: [],
    reviews: [],
    ratingDistribution: [],
    tags: [],
    badges: ["Popular"],
  },
]