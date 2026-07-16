import { bestSellerProducts } from "./bestSeller.data"
import ProductCard from "./ProductCard"

export default function BestSellers() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12">
          <h2 className="text-5xl font-bold">
            Best Sellers
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Discover our most popular automotive care products.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {bestSellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  )
}