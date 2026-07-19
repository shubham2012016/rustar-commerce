import {
  CartHeader,
  CartItems,
  CartSummary,
} from "@/components/cart"

export default function CartPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <CartHeader />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <CartItems />

          <CartSummary />
        </div>
      </section>
    </main>
  )
}