import { getProducts } from "@/lib/data/products"
import { mapProduct } from "@/lib/mappers/product"

import ShopProductCard from "./ShopProductCard"

export default async function ShopGrid() {
  const medusaProducts = await getProducts(24)

  const products = medusaProducts.map(mapProduct)

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ShopProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
