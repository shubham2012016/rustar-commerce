import FeatureCard from "./FeatureCard"
import { features } from "./whyChooseUs.data"

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <h2 className="text-5xl font-bold">
            Why Choose Rustar Chem
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Built for professionals, trusted by dealers,
            and loved by automotive enthusiasts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>

      </div>
    </section>
  )
}