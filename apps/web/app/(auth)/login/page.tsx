import AuthCard from "@/components/auth/auth-card"
import AuthFooter from "@/components/auth/auth-footer"
import AuthHeader from "@/components/auth/auth-header"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Welcome back"
        description="Sign in to your Rustar Chem account to manage orders, addresses and wishlist."
        footerText="Don't have an account?"
        footerLink="Create Account"
        footerHref="/register"
      />

      <LoginForm />

      <AuthFooter />
    </AuthCard>
  )
}
