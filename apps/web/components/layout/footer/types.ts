import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons"

export interface FooterBrand {
  name: string
  tagline: string
  description: string
  email: string
  phone: string
  address: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

export interface FooterTrustItem {
  title: string
  description: string
  icon: LucideIcon
}

export interface FooterPaymentItem {
  label: string
}

export interface FooterSocialItem {
  label: string
  href: string
  icon: IconType
}