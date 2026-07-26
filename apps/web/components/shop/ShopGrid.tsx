import { getProducts } from "@/lib/data/products"

export default async function ShopGrid() {
  const products = await getProducts(24)

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="rounded-xl border bg-white p-6">
          <h3 className="text-xl font-bold">{product.title}</h3>

          <p className="mt-2 text-gray-500">{product.subtitle}</p>

          <p className="mt-4 text-blue-600">{product.handle}</p>
        </div>
      ))}
    </div>
  )
}
