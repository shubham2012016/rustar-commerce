import { PRODUCT } from "@/data/products/product.data"

export default function DescriptionTab() {
  return (
    <article className="prose prose-slate max-w-none">
      <p>{PRODUCT.description}</p>
    </article>
  )
}