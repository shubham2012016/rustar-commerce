import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

import "./globals.css"

import Providers from "@/providers"

import { SITE } from "@/constants/site"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },

  description: SITE.description,

  keywords: [
    "Car Care",
    "Bike Care",
    "Chain Lube",
    "Rustar Chem",
    "Automotive Chemicals",
    "Motorcycle Care",
  ],

  authors: [
    {
      name: "Rustar Chem",
    },
  ],

  creator: "Rustar Chem",

  publisher: "Rustar Chem",

  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden bg-white text-slate-900 antialiased`}
      >
        <Providers>
          <Header />

          <main>{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  )
}
