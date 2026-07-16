"use client"

import { useEffect, useState } from "react"

import AnnouncementBar from "./announcement-bar"
import DesktopNav from "./desktop-nav"
import HeaderActions from "./header-actions"
import Logo from "./logo"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Logo />

          <DesktopNav />

          <HeaderActions />
        </div>
      </header>
    </>
  )
}
