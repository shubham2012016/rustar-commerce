import {
  Truck,
  ShieldCheck,
  Award,
  BadgeCheck,
} from "lucide-react"

import { FooterTrustItem } from "./types"

export const TRUST_ITEMS: FooterTrustItem[] = [
  {
    title: "Fast Nationwide Delivery",

    description:
      "Quick and reliable shipping across India.",

    icon: Truck,
  },

  {
    title: "Professional Quality",

    description:
      "Engineered for enthusiasts and professionals.",

    icon: Award,
  },

  {
    title: "Secure Payments",

    description:
      "100% secure checkout with trusted gateways.",

    icon: ShieldCheck,
  },

  {
    title: "Made in India",

    description:
      "Manufactured proudly for Indian roads.",

    icon: BadgeCheck,
  },
]