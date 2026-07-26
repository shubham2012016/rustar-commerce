import Link from "next/link"

export default function AuthFooter() {
  return (
    <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
      <p>
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="font-medium text-orange-600 hover:underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium text-orange-600 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
