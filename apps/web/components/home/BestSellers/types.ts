export interface Product {
  id: number
  name: string
  slug: string
  image: string

  brand: string

  price: number
  originalPrice: number

  rating: number
  reviews: number

  badge?: string

  inStock: boolean
}