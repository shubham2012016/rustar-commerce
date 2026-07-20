import type { Product } from "@/types"

export const bikeChainLubricant: Product = {
  id: "bike-chain-lubricant-500ml",

  slug: "bike-chain-lubricant-500ml",

  sku: "RC-BCL-500",

  name: "Rustar Chem Premium Bike Chain Lubricant 500ml",

  shortDescription:
    "Advanced synthetic chain lubricant engineered for smooth performance, reduced friction and long-lasting protection.",

  description:
    "Rustar Chem Premium Bike Chain Lubricant is specially formulated to reduce friction, prevent rust, repel dirt and provide long-lasting lubrication for motorcycles and bicycles under all weather conditions.",

  brand: "Rustar Chem",

  category: "Bike Care",

  price: 399,

  compareAtPrice: 499,

  currency: "INR",

  rating: 4.8,

  reviewCount: 1264,

  stock: 84,

  images: [
    {
      id: "1",
      url: "/products/chain-lube/1.webp",
      alt: "Front View",
    },
    {
      id: "2",
      url: "/products/chain-lube/2.webp",
      alt: "Back View",
    },
    {
      id: "3",
      url: "/products/chain-lube/3.webp",
      alt: "45 Degree View",
    },
    {
      id: "4",
      url: "/products/chain-lube/4.webp",
      alt: "Usage",
    },
    {
      id: "5",
      url: "/products/chain-lube/5.webp",
      alt: "Bottle Closeup",
    },
    {
      id: "6",
      url: "/products/chain-lube/6.webp",
      alt: "Packaging",
    },
  ],

  variants: [
    {
      id: "100",
      name: "Size",
      value: "250 ml",
      inStock: true,
    },
    {
      id: "101",
      name: "Size",
      value: "500 ml",
      inStock: true,
    },
    {
      id: "102",
      name: "Size",
      value: "1 Litre",
      inStock: true,
    },
  ],

  features: [
    {
      id: "1",
      title: "Long Lasting Lubrication",
      description: "Provides smooth lubrication even during long rides.",
      icon: "Shield",
    },
    {
      id: "2",
      title: "Rust Protection",
      description: "Creates a protective layer against moisture and corrosion.",
      icon: "Droplets",
    },
    {
      id: "3",
      title: "Dust Resistant Formula",
      description: "Reduces dirt build-up for cleaner chain performance.",
      icon: "Wind",
    },
    {
      id: "4",
      title: "High Temperature Stability",
      description: "Performs consistently even in extreme riding conditions.",
      icon: "Flame",
    },
  ],

  specifications: [
    {
      label: "Brand",
      value: "Rustar Chem",
    },
    {
      label: "Product Type",
      value: "Chain Lubricant",
    },
    {
      label: "Vehicle Type",
      value: "Motorcycle & Bicycle",
    },
    {
      label: "Net Quantity",
      value: "500 ml",
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
      question: "How often should I lubricate my chain?",
      answer:
        "For regular city riding, every 500–700 km is recommended. Clean the chain before each application.",
    },
    {
      id: "2",
      question: "Can this lubricant be used during monsoon?",
      answer:
        "Yes. It is formulated to resist water wash-off and provide excellent protection during wet conditions.",
    },
    {
      id: "3",
      question: "Does it prevent rust?",
      answer:
        "Yes. It forms a protective anti-corrosion coating over the chain.",
    },
  ],

  reviews: [
    {
      id: "1",
      customerName: "Rahul Sharma",
      rating: 5,
      title: "Excellent Chain Lubricant",
      review:
        "The chain became noticeably smoother after one application. Highly recommended.",
      verified: true,
      createdAt: "2026-07-10",
    },
    {
      id: "2",
      customerName: "Aman Verma",
      rating: 5,
      title: "Worth the Price",
      review:
        "Very little dirt accumulation compared to my previous lubricant.",
      verified: true,
      createdAt: "2026-07-08",
    },
    {
      id: "3",
      customerName: "Rohit Singh",
      rating: 4,
      title: "Good Product",
      review: "Smooth shifting and quieter chain after using it.",
      verified: true,
      createdAt: "2026-07-02",
    },
  ],

  ratingDistribution: [
    {
      stars: 5,
      count: 1034,
    },
    {
      stars: 4,
      count: 167,
    },
    {
      stars: 3,
      count: 39,
    },
    {
      stars: 2,
      count: 14,
    },
    {
      stars: 1,
      count: 10,
    },
  ],

  tags: ["Best Seller", "Bike Care", "Chain Lube", "Premium", "Made in India"],

  badges: [
    "Free Shipping",
    "Cash on Delivery",
    "Secure Payments",
    "Made in India",
  ],
}
