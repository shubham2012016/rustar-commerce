import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})  

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  )
}