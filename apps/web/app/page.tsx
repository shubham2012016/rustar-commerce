import Hero from "@/components/home/Hero/Hero"
import { CategoriesGrid } from "@/components/home/Categories"
import { BestSellers } from "@/components/home/BestSellers"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
import { FeaturedCollections } from "@/components/home/FeaturedCollections"
import Testimonials from "@/components/home/Testimonials"
import Newsletter from "@/components/home/Newsletter/Newsletter"

import { getHeroProducts } from "@/lib/data/products"

export default async function HomePage() {
  const heroProducts = await getHeroProducts(6)

  return (
    <>
      <Hero products={heroProducts} />

      <CategoriesGrid />
      <BestSellers />
      <WhyChooseUs />
      <FeaturedCollections />
      <Testimonials />
      <Newsletter />
    </>
  )
}
