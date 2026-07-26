"use client"

import { useEffect, useState } from "react"

import DesktopNav from "./desktop-nav"
import Logo from "./logo"

import SearchButton from "./search-button"
import WishlistButton from "./wishlist-button"
import AccountMenu from "./account-menu"
import CartButton from "./cart-button"
import MobileNav from "./mobile-nav"

export default function ScrollHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const value = window.scrollY > 10

      setScrolled((prev) => (prev === value ? prev : value))
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={[
        "sticky top-0 z-50",
        "transition-all duration-300",
        scrolled
          ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white",
      ].join(" ")}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-8 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Logo />

        <DesktopNav />

        <div className="hidden items-center justify-end gap-2 lg:flex">
          <SearchButton />

          <WishlistButton />

          <AccountMenu />

          <CartButton />
        </div>

        <div className="flex items-center justify-end gap-2 lg:hidden">
          <SearchButton />

          <CartButton />

          <MobileNav />
        </div>
      </div>
    </header>
  )
}