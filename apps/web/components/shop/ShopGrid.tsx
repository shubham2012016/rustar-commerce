import { RELATED_PRODUCTS } from "@/components/product/related/related-products.data"

export default function ShopGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {RELATED_PRODUCTS.map((product) => (
        <div key={product.id}>
          {/* We'll replace this with the shared ProductCard */}
          <p>{product.name}</p>
        </div>
      ))}
    </div>
  )
}