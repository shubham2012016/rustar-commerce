export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary?: boolean
}

export interface ProductVariant {
  id: string

  sku: string

  name: string

  value: string

  price: number

  compareAtPrice?: number

  stock: number

  inStock: boolean
}

export interface ProductFeature {
  id: string
  title: string
  description: string
  icon: string
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface ProductFAQ {
  id: string
  question: string
  answer: string
}

export interface ProductReview {
  id: string
  customerName: string
  customerAvatar?: string
  rating: number
  title: string
  review: string
  verified: boolean
  createdAt: string
}

export interface ProductRatingDistribution {
  stars: 5 | 4 | 3 | 2 | 1
  count: number
}

export interface Product {
  id: string

  slug: string

  name: string

  shortDescription: string

  description: string

  brand: string

  category: string

  currency: "INR"

  defaultVariantId: string

  rating: number

  reviewCount: number

  images: ProductImage[]

  variants: ProductVariant[]

  features: ProductFeature[]

  specifications: ProductSpecification[]

  faqs: ProductFAQ[]

  reviews: ProductReview[]

  ratingDistribution: ProductRatingDistribution[]

  tags: string[]

  badges: string[]
}
