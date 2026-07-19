export default function ShopSidebar() {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-xl font-bold">
          Categories
        </h3>

        <div className="space-y-3">
          {[
            "Bike Care",
            "Car Care",
            "Cleaning",
            "Accessories",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3"
            >
              <input type="checkbox" />

              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-xl font-bold">
          Availability
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" />

            <span>In Stock</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />

            <span>Out of Stock</span>
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-xl font-bold">
          Price
        </h3>

        <input
          type="range"
          min="0"
          max="5000"
          className="w-full"
        />

        <div className="mt-4 flex justify-between text-sm text-slate-500">
          <span>₹0</span>

          <span>₹5000</span>
        </div>
      </div>
    </div>
  )
}