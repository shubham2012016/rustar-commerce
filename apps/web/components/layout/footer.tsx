import Link from "next/link"
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6"

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top */}

        <div className="grid gap-14 py-20 lg:grid-cols-5">
          {/* Brand */}

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white">Rustar Chem</h2>

            <p className="mt-5 max-w-md leading-8 text-slate-400">
              Premium automotive detailing products engineered for professionals
              and enthusiasts. Trusted solutions for car care, bike care and
              industrial maintenance.
            </p>

            <div className="mt-8 flex max-w-md">
              <input
                placeholder="Enter your email"
                className="flex-1 rounded-l-xl border border-slate-700 bg-slate-900 px-5 py-4 outline-none"
              />

              <button className="rounded-r-xl bg-blue-600 px-7 font-semibold text-white transition hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>

          {/* Shop */}

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Shop</h3>

            <div className="space-y-4 flex flex-col">
              <Link href="/categories/car-care">Car Care</Link>

              <Link href="/categories/bike-care">Bike Care</Link>

              <Link href="/categories/chain-care">Chain Care</Link>

              <Link href="/products">All Products</Link>
            </div>
          </div>

          {/* Company */}

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Company</h3>

            <div className="space-y-4 flex flex-col">
              <Link href="/about">About Us</Link>

              <Link href="/blog">Blog</Link>

              <Link href="/contact">Contact</Link>

              <Link href="/careers">Careers</Link>
            </div>
          </div>

          {/* Support */}

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Support</h3>

            <div className="space-y-4 flex flex-col">
              <Link href="/shipping">Shipping Policy</Link>

              <Link href="/returns">Returns</Link>

              <Link href="/privacy">Privacy Policy</Link>

              <Link href="/terms">Terms & Conditions</Link>
            </div>
          </div>
        </div>

        {/* Features */}

        <div className="grid gap-6 border-y border-slate-800 py-10 text-center text-sm lg:grid-cols-4">
          <div>
            🚚
            <p className="mt-2 font-medium">Fast Nationwide Delivery</p>
          </div>

          <div>
            🔒
            <p className="mt-2 font-medium">Secure Payments</p>
          </div>

          <div>
            ⭐<p className="mt-2 font-medium">Premium Quality Products</p>
          </div>

          <div>
            🇮🇳
            <p className="mt-2 font-medium">Proudly Made in India</p>
          </div>
        </div>

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-6 py-8 lg:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 Rustar Chem. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link href="#">
              <FaFacebookF />
            </Link>

            <Link href="#">
              <FaInstagram />
            </Link>

            <Link href="#">
              <FaYoutube />
            </Link>

            <Link href="#">
              <FaLinkedinIn />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
