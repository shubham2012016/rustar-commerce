import AuthCard from "@/components/auth/auth-card"
import AuthFooter from "@/components/auth/auth-footer"
import AuthHeader from "@/components/auth/auth-header"
import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Create your account"
        description="Join Rustar Chem to enjoy faster checkout, order tracking, saved addresses, and exclusive offers."
        footerText="Already have an account?"
        footerLink="Sign In"
        footerHref="/login"
      />

      <RegisterForm />

      <AuthFooter />
    </AuthCard>
  )
}