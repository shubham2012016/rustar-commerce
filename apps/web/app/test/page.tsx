import { medusa } from "@/lib/medusa"

export default async function TestPage() {
  try {
    const result = await medusa.store.product.list({
      limit: 10,
    })

    return (
      <main className="p-10">
        <h1 className="mb-6 text-3xl font-bold text-green-600">
          Medusa Connection Successful
        </h1>

        <p className="mb-6 text-slate-600">
          Successfully fetched {result.products.length} product(s).
        </p>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-6 text-sm text-white">
          {JSON.stringify(result, null, 2)}
        </pre>
      </main>
    )
  } catch (err: unknown) {
    console.error(err)

    const error =
      err instanceof Error
        ? err
        : new Error(typeof err === "string" ? err : "Unknown error")

    return (
      <main className="p-10">
        <h1 className="mb-6 text-3xl font-bold text-red-600">
          Medusa Connection Failed
        </h1>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-6 text-sm text-white">
          {JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack:
                process.env.NODE_ENV === "development"
                  ? error.stack
                  : undefined,
            },
            null,
            2
          )}
        </pre>
      </main>
    )
  }
}
