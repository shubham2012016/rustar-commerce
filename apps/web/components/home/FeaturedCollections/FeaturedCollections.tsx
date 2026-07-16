import CollectionCard from "./CollectionCard"
import { collections } from "./collection.data"

export default function FeaturedCollections() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12">
          <h2 className="text-5xl font-bold">
            Featured Collections
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Explore curated product collections for every detailing need.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>

      </div>
    </section>
  )
}