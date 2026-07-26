export interface NavigationItem {
  label: string
  href: string
  megaMenu?: boolean
}

export const navigation: NavigationItem[] = [
  {
    label: "Shop",
    href: "/shop",
    megaMenu: true,
  },
  {
    label: "Categories",
    href: "/categories",
    megaMenu: true,
  },
  {
    label: "Dealers",
    href: "/dealer",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
]
