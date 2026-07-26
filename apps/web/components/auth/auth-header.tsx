import Link from "next/link"

interface AuthHeaderProps {
  title: string
  description: string
  footerText: string
  footerLink: string
  footerHref: string
}

export default function AuthHeader({
  title,
  description,
  footerText,
  footerLink,
  footerHref,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="inline-flex items-center gap-2">
        <span className="text-3xl font-black tracking-tight text-orange-600">
          Rustar
        </span>

        <span className="text-3xl font-black tracking-tight text-slate-900">
          Chem
        </span>
      </Link>

      <h1 className="mt-8 text-3xl font-bold text-slate-900">{title}</h1>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-6 text-sm text-slate-600">
        {footerText}{" "}
        <Link
          href={footerHref}
          className="font-semibold text-orange-600 transition hover:text-orange-500"
        >
          {footerLink}
        </Link>
      </div>
    </div>
  )
}
