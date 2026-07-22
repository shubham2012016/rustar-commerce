"use client"

import { useProduct } from "@/components/product/context/ProductContext"  

export default function DescriptionTab() {
  const { product } = useProduct()

  return (
    <article className="prose prose-slate max-w-none">
      <p>{product.description}</p>
    </article>
  )
}