"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  CircleUserRound,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react"

import { AnimatePresence, motion } from "framer-motion"

import { navigation } from "./navigation"
import { megaMenu } from "./mega-menu.data"

import Logo from "./logo"

function getMegaMenuType(label: string): keyof typeof megaMenu {
  return label === "Shop" ? "shop" : "categories"
}

export default function MobileNav() {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const [expanded, setExpanded] = useState<string | null>(null)

  // -----------------------------------
  // Close on route change
  // -----------------------------------

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // -----------------------------------
  // Lock body scroll
  // -----------------------------------

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ""
      return
    }

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // -----------------------------------
  // ESC closes drawer
  // -----------------------------------

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  function toggleSection(label: string) {
    setExpanded((current) => (current === label ? null : label))
  }

  return (
    <>
      {/* Mobile Toggle */}

      <button
        aria-label="Open Menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-orange-500 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}

            <motion.div
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.28,
              }}
              className="fixed top-0 left-0 z-[100] flex h-screen w-[88%] max-w-sm flex-col bg-white shadow-2xl"
            >
              {/* Header */}

              <div className="flex items-center justify-between border-b p-5">
                <Logo />

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}

              {/* Welcome Section */}

              {/* Account Banner */}

              <div className="border-b bg-slate-50">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-6 py-5 transition hover:bg-slate-100"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      Welcome 👋
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Login to manage orders and wishlist.
                    </p>
                  </div>

                  <div className="rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-600">
                    Login →
                  </div>
                </Link>
              </div>

              {/* Navigation */}

              <div className="flex-1 overflow-y-auto">
                <nav className="py-3">
                  {navigation.map((item) => {
                    const active = pathname === item.href

                    if (!item.megaMenu) {
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`flex items-center justify-between px-6 py-4 transition ${
                            active
                              ? "bg-orange-50 font-semibold text-orange-600"
                              : "hover:bg-slate-50"
                          } `}
                        >
                          {item.label}
                        </Link>
                      )
                    }

                    const menu = megaMenu[getMegaMenuType(item.label)]

                    return (
                      <div
                        key={item.label}
                        className="border-b border-slate-100"
                      >
                        <button
                          onClick={() => toggleSection(item.label)}
                          className="flex w-full items-center justify-between px-6 py-4 font-medium"
                        >
                          {item.label}

                          <motion.div
                            animate={{
                              rotate: expanded === item.label ? 180 : 0,
                            }}
                          >
                            <ChevronDown className="h-5 w-5" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expanded === item.label && (
                            <motion.div
                              initial={{
                                height: 0,
                                opacity: 0,
                              }}
                              animate={{
                                height: "auto",
                                opacity: 1,
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.22,
                              }}
                              className="overflow-hidden"
                            >
                              <div className="py-2">
                                <Link
                                  href={item.href}
                                  className="block px-10 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-orange-600"
                                >
                                  View All {item.label}
                                </Link>

                                {menu.sections.map((section) => (
                                  <div
                                    key={section.title}
                                    className="border-t border-slate-100 py-3"
                                  >
                                    <p className="px-10 pb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                                      {section.title}
                                    </p>

                                    {section.links.map((link) => (
                                      <Link
                                        key={link.label}
                                        href={link.href}
                                        className="block px-10 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-orange-600"
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </nav>
              </div>

              {/* Bottom Actions */}

              <div className="border-t">
                <div className="px-6 py-5">
                  <p className="mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Your Account
                  </p>

                  <div className="space-y-2">
                    <Link
                      href="/wishlist"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-4 transition hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5" />
                        Wishlist
                      </div>
                      →
                    </Link>

                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-4 transition hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <CircleUserRound className="h-5 w-5" />
                        My Account
                      </div>
                      →
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-4 transition hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5" />
                        My Orders
                      </div>
                      →
                    </Link>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <Link
                    href="/dealer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                  >
                    Become a Dealer
                  </Link>
                </div>

                <div className="border-t px-5 py-4">
                  <p className="text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Rustar Chem.
                    <br />
                    Premium Automotive Care Products.
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
