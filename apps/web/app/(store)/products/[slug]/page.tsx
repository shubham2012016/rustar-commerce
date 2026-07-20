import { notFound } from "next/navigation"

import { PRODUCTS } from "@/data/products"

import { ProductProvider } from "@/components/product/context/ProductContext"

import ImageGallery from "@/components/product/gallery/ImageGallery"

import ProductHeader from "@/components/product/info/ProductHeader"
import PriceCard from "@/components/product/info/PriceCard"
import PurchaseActions from "@/components/product/info/PurchaseActions"
import QuantitySelector from "@/components/product/info/QuantitySelector"
import ShippingInfo from "@/components/product/info/ShippingInfo"
import TrustBadges from "@/components/product/info/TrustBadges"
import VariantSelector from "@/components/product/info/VariantSelector"

import ProductTabs from "@/components/product/tabs/ProductTabs"
import ProductReviews from "@/components/product/reviews/ProductReviews"

import RelatedProducts from "@/components/product/related/RelatedProducts"
import FAQSection from "@/components/product/faq/FAQSection"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const product = PRODUCTS.find((item) => item.slug === slug)

  if (!product) {
    notFound()
  }

  return (
    <ProductProvider product={product}>
      <div className="bg-slate-50">
        {/* Hero Section */}

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            <div className="self-start lg:sticky lg:top-24">
              <ImageGallery />
            </div>

            <div className="space-y-8">
              <ProductHeader />

              <PriceCard />

              <VariantSelector />

              <QuantitySelector />

              <PurchaseActions />

              <ShippingInfo />

              <TrustBadges />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <ProductTabs />
        </section>

        <section className="mx-auto mt-20 max-w-7xl px-6 pb-24 lg:px-8">
          <ProductReviews />
        </section>

        <RelatedProducts />

        <FAQSection />
      </div>
    </ProductProvider>
  )
}
