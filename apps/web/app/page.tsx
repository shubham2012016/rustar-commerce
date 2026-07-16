import Hero from "@/components/home/Hero/Hero"
import { CategoriesGrid } from "@/components/home/Categories"
import { BestSellers } from "@/components/home/BestSellers"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
import { FeaturedCollections } from "@/components/home/FeaturedCollections"


export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesGrid />
      <BestSellers />
      <WhyChooseUs />
      <FeaturedCollections />
    </>
    
  )
}
