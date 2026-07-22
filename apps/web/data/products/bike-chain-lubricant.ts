import type { Product } from "@/types"

export const bikeChainLubricant: Product = {
  id: "chain-lubricant",

  slug: "chain-lubricant",

  name: "Rustar Chain Lubricant",

  shortDescription:
    "High-performance chain lubricant that reduces friction, minimizes wear and protects against rust in all riding conditions.",

  description:
    "Rustar Chain Lubricant is specially engineered for motorcycles and bicycles. The advanced anti-wear formula penetrates deep into chain links, reduces friction, prevents corrosion and delivers smooth power transmission while resisting water, dust and road contaminants.",

  brand: "Rustar Chem",

  category: "Bike Care",

  currency: "INR",

  defaultVariantId: "500ml",

  rating: 4.9,

  reviewCount: 1847,

  images: [
    {
      id: "1",
      url: "public/products/chain-lubricant/1.webp",
      alt: "Rustar Chain Lubricant",
      isPrimary: true,
    },
  ],

  variants: [
    {
      id: "500ml",
      sku: "RC-CL-500ML",
      name: "Size",
      value: "500 ml",
      price: 450,
      compareAtPrice: 549,
      stock: 125,
      inStock: true,
    },
  ],

  features: [
    {
      id: "1",
      title: "Long Lasting Lubrication",
      description:
        "Maintains smooth chain movement for longer riding intervals.",
      icon: "Shield",
    },
    {
      id: "2",
      title: "Rust Protection",
      description: "Forms a protective coating against moisture and corrosion.",
      icon: "Droplets",
    },
    {
      id: "3",
      title: "Dust Resistant",
      description: "Helps reduce dust and dirt accumulation on the chain.",
      icon: "Wind",
    },
    {
      id: "4",
      title: "Smooth Performance",
      description: "Improves gear shifting and reduces drivetrain noise.",
      icon: "Zap",
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
      label: "Suitable For",
      value: "Motorcycles & Bicycles",
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
        "For regular riding, lubricate every 500–700 km or after riding in rain or muddy conditions.",
    },
    {
      id: "2",
      question: "Can I use it on O-ring chains?",
      answer:
        "Yes. The lubricant is suitable for standard, O-ring and X-ring chains.",
    },
    {
      id: "3",
      question: "Should I clean the chain before use?",
      answer:
        "Yes. Cleaning the chain before lubrication provides the best performance and longer chain life.",
    },
  ],

  reviews: [
    {
      id: "1",
      customerName: "Rahul Sharma",
      rating: 5,
      title: "Excellent Performance",
      review:
        "The chain feels much smoother and quieter after using this lubricant.",
      verified: true,
      createdAt: "2026-07-12",
    },
    {
      id: "2",
      customerName: "Aman Verma",
      rating: 5,
      title: "Highly Recommended",
      review:
        "Great protection during rainy rides. Dirt buildup is noticeably lower.",
      verified: true,
      createdAt: "2026-07-09",
    },
    {
      id: "3",
      customerName: "Rohit Singh",
      rating: 4,
      title: "Good Quality",
      review: "Easy to apply and lasts longer than other lubricants I've used.",
      verified: true,
      createdAt: "2026-07-05",
    },
  ],

  ratingDistribution: [
    {
      stars: 5,
      count: 1515,
    },
    {
      stars: 4,
      count: 220,
    },
    {
      stars: 3,
      count: 71,
    },
    {
      stars: 2,
      count: 25,
    },
    {
      stars: 1,
      count: 16,
    },
  ],

  tags: [
    "Bike Care",
    "Chain Lubricant",
    "Premium",
    "Anti Rust",
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
