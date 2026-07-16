import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
        RV
      </div>

      <div>
        <h2 className="text-xl font-bold">Rustar Chem</h2>

        <p className="-mt-1 text-xs text-slate-500">
          Premium Automotive Care
        </p>
      </div>
    </Link>
  )
}