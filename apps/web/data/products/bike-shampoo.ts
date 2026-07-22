import type { Product } from "@/types"

export const bikeShampoo: Product = {
  id: "bike-shampoo",

  slug: "bike-shampoo",

  name: "Rustar Car & Bike Shampoo",

  shortDescription:
    "Premium concentrated shampoo that removes dirt, grease, mud and road grime while preserving your vehicle's paint finish.",

  description:
    "Rustar Car & Bike Shampoo is a high-foaming cleaning solution designed for motorcycles, scooters and cars. Its advanced formula lifts stubborn dirt and traffic film without damaging paint, plastic, rubber or chrome surfaces. Suitable for regular washing and leaves a clean glossy finish.",

  brand: "Rustar Chem",

  category: "Vehicle Care",

  currency: "INR",

  defaultVariantId: "500ml",

  rating: 4.8,

  reviewCount: 1236,

  images: [
    {
      id: "1",
      url: "/products/bike-shampoo/1.webp",
      alt: "Rustar Car & Bike Shampoo",
      isPrimary: true,
    },
  ],

  variants: [
    {
      id: "500ml",
      sku: "RC-BS-500ML",
      name: "Size",
      value: "500 ml",
      price: 500,
      compareAtPrice: 599,
      stock: 100,
      inStock: true,
    },
  ],

  features: [
    {
      id: "1",
      title: "Rich Foam Formula",
      description:
        "Produces thick foam that loosens dirt and road grime effectively.",
      icon: "Droplets",
    },
    {
      id: "2",
      title: "Safe On Paint",
      description:
        "Gentle cleaning formula that helps maintain paint shine and finish.",
      icon: "Shield",
    },
    {
      id: "3",
      title: "Multi Surface Cleaning",
      description:
        "Suitable for painted surfaces, plastic panels, chrome and alloy wheels.",
      icon: "Sparkles",
    },
    {
      id: "4",
      title: "Easy To Rinse",
      description:
        "Leaves minimal residue and rinses away quickly with clean water.",
      icon: "Waves",
    },
  ],

  specifications: [
    {
      label: "Brand",
      value: "Rustar Chem",
    },
    {
      label: "Product Type",
      value: "Car & Bike Shampoo",
    },
    {
      label: "Net Quantity",
      value: "500 ml",
    },
    {
      label: "Suitable For",
      value: "Cars, Motorcycles & Scooters",
    },
    {
      label: "Country of Origin",
      value: "India",
    },
    {
      label: "Shelf Life",
      value: "24 Months",
    },
  ],

  faqs: [
    {
      id: "1",
      question: "Can it be used on cars and bikes?",
      answer:
        "Yes. It is formulated for motorcycles, scooters, hatchbacks, sedans and SUVs.",
    },
    {
      id: "2",
      question: "Will it damage paint or ceramic coating?",
      answer:
        "No. It is designed to clean effectively while being safe on painted surfaces when used as directed.",
    },
    {
      id: "3",
      question: "Does it remove mud and grease?",
      answer:
        "Yes. The concentrated formula helps lift mud, grease, dust and road grime with ease.",
    },
  ],

  reviews: [
    {
      id: "1",
      customerName: "Rahul Sharma",
      rating: 5,
      title: "Excellent Cleaning",
      review:
        "Very rich foam and the bike looks shiny after every wash. Highly recommended.",
      verified: true,
      createdAt: "2026-07-10",
    },
    {
      id: "2",
      customerName: "Aman Verma",
      rating: 5,
      title: "Worth Buying",
      review:
        "Removes stubborn dirt easily and doesn't leave white marks after drying.",
      verified: true,
      createdAt: "2026-07-08",
    },
    {
      id: "3",
      customerName: "Rohit Singh",
      rating: 4,
      title: "Good Product",
      review:
        "Nice fragrance, good foam and safe for regular washing.",
      verified: true,
      createdAt: "2026-07-04",
    },
  ],

  ratingDistribution: [
    {
      stars: 5,
      count: 1012,
    },
    {
      stars: 4,
      count: 156,
    },
    {
      stars: 3,
      count: 41,
    },
    {
      stars: 2,
      count: 15,
    },
    {
      stars: 1,
      count: 12,
    },
  ],

  tags: [
    "Car Care",
    "Bike Care",
    "Vehicle Shampoo",
    "Premium",
    "Made in India",
  ],

  badges: [
    "Best Seller",
    "Free Shipping",
    "Cash on Delivery",
    "Secure Payments",
    "Made in India",
  ],
}