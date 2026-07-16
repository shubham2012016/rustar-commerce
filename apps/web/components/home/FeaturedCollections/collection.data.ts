import { Collection } from "./types"

export const collections: Collection[] = [
  {
    id: 1,
    title: "Car Wash Collection",

    description:
      "Everything needed for a perfect exterior wash.",

    image: "/collections/car-wash.webp",

    href: "/collections/car-wash",

    productCount: 12,
  },

  {
    id: 2,
    title: "Bike Care Collection",

    description:
      "Complete maintenance products for motorcycles.",

    image: "/collections/bike-care.webp",

    href: "/collections/bike-care",

    productCount: 9,
  },

  {
    id: 3,
    title: "Interior Care",

    description:
      "Dashboard, upholstery and cabin cleaning solutions.",

    image: "/collections/interior.webp",

    href: "/collections/interior",

    productCount: 8,
  },
]