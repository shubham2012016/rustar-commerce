import FooterBottom from "./FooterBottom"
import FooterHero from "./FooterHero"
import FooterLinks from "./FooterLinks"
import FooterNewsletter from "./FooterNewsletter"
import FooterTrust from "./FooterTrust"

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#030712] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FooterHero />
        <FooterTrust />
        <FooterNewsletter />
        <FooterLinks />
        <FooterBottom />
      </div>
    </footer>
  )
}
