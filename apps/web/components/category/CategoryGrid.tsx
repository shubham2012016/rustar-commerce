import CategoryCard from "./CategoryCard"

const categories = [
  {
    title: "Bike Care",
    description:
      "Lubricants, cleaners and maintenance products for motorcycles.",
    products: 12,
  },
  {
    title: "Car Care",
    description:
      "Premium shampoos, waxes and detailing essentials.",
    products: 18,
  },
  {
    title: "Cleaning",
    description:
      "Powerful cleaning solutions for every surface.",
    products: 8,
  },
  {
    title: "Accessories",
    description:
      "Essential accessories for professional detailing.",
    products: 10,
  },
]

export default function CategoryGrid() {
  return (
    <section className="grid gap-8 md:grid-cols-2">
      {categories.map((category) => (
        <CategoryCard
          key={category.title}
          {...category}
        />
      ))}
    </section>
  )
}