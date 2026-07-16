export interface HeroProduct {
  id: string
  name: string
  slug: string

  image: string

  price: number
  originalPrice?: number

  rating: number
  reviews: number

  badge?: {
    text: string
    variant: "new" | "bestseller" | "popular" | "premium"
  }
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;

  image: string;

  primaryButton: {
    label: string;
    href: string;
  };

  secondaryButton: {
    label: string;
    href: string;
  };

  background: string;
}
