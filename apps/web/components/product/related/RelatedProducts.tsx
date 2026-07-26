import { getProducts } from "@/lib/data/products"
import { mapProduct } from "@/lib/mappers/product"

import RelatedProductCard from "./RelatedProductCard"

export default async function RelatedProducts() {
  const medusaProducts = await getProducts(8)

  const products = medusaProducts.map((product) => mapProduct(product))

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-10">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Recommended Products
        </span>

        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          You May Also Like
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          Complete your maintenance kit with other premium Rustar Chem products
          trusted by riders across India.
        </p>
      </div>

      <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-2">
        {products.map((product) => (
          <div key={product.id} className="w-[280px] shrink-0 sm:w-[320px]">
            <RelatedProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
