import type { Metadata } from "next"

import LegalContainer from "@/components/legal/LegalContainer"
import LegalHero from "@/components/legal/LegalHero"
import LegalSection from "@/components/legal/LegalSection"
import LegalSidebar from "@/components/legal/LegalSidebar"

import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy of Rustar Chem to understand how we collect, use, store, and protect your personal information.",

  alternates: {
    canonical: `${SITE.url}/privacy-policy`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Privacy Policy | Rustar Chem",
    description: "Learn how Rustar Chem protects your personal information.",
    url: `${SITE.url}/privacy-policy`,
    type: "article",
  },
}

const sections = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "information-we-collect",
    label: "Information We Collect",
  },
  {
    id: "how-we-use-information",
    label: "How We Use Information",
  },
  {
    id: "payments",
    label: "Payments",
  },
  {
    id: "shipping",
    label: "Shipping",
  },
  {
    id: "cookies",
    label: "Cookies",
  },
  {
    id: "security",
    label: "Security",
  },
  {
    id: "your-rights",
    label: "Your Rights",
  },
  {
    id: "children",
    label: "Children",
  },
  {
    id: "changes",
    label: "Policy Updates",
  },
  {
    id: "contact",
    label: "Contact",
  },
]

export default function PrivacyPolicyPage() {
  console.log({
    LegalHero,
    LegalContainer,
    LegalSection,
    LegalSidebar,
  })
  return (
    <>
      <LegalHero
        title="Privacy Policy"
        description="Your privacy is important to us. This Privacy Policy explains how Rustar Chem collects, uses, stores, and protects your personal information when you visit our website or purchase our products."
        lastUpdated="29 July 2026"
      />

      <LegalContainer>
        <LegalSidebar items={sections} />

        <div className="space-y-8">
          <LegalSection id="overview" title="Overview">
            <p>
              Rustar Chem ("we", "our", "us") respects your privacy and is
              committed to protecting the personal information you share with
              us.
            </p>

            <p>
              This Privacy Policy applies to all visitors, customers, and users
              of our website and describes how we collect, use, disclose, and
              safeguard your information.
            </p>

            <p>
              By accessing our website or placing an order, you agree to the
              practices described in this Privacy Policy.
            </p>
          </LegalSection>

          <LegalSection
            id="information-we-collect"
            title="Information We Collect"
          >
            <p>
              Depending on your interaction with our website, we may collect:
            </p>

            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Shipping and billing address</li>
              <li>Order history</li>
              <li>Payment transaction references</li>
              <li>IP address</li>
              <li>Browser and device information</li>
              <li>Pages visited on our website</li>
              <li>Cookies and analytics information</li>
            </ul>

            <p>
              We only collect information necessary to provide our products and
              improve your shopping experience.
            </p>
          </LegalSection>

          <LegalSection
            id="how-we-use-information"
            title="How We Use Your Information"
          >
            <p>Your information may be used to:</p>

            <ul>
              <li>Process orders</li>
              <li>Deliver products</li>
              <li>Provide customer support</li>
              <li>Send order confirmations</li>
              <li>Respond to inquiries</li>
              <li>Prevent fraud</li>
              <li>Improve website performance</li>
              <li>Analyze website traffic</li>
              <li>Comply with legal obligations</li>
            </ul>

            <p>We never sell your personal information to third parties.</p>
          </LegalSection>

          <LegalSection id="payments" title="Payment Information">
            <p>
              Online payments are processed through trusted third-party payment
              gateways such as Razorpay.
            </p>

            <p>
              Rustar Chem does not store your complete debit card, credit card,
              UPI PIN, CVV, or banking credentials on our servers.
            </p>

            <p>
              Payment providers process transactions securely using
              industry-standard encryption and security practices.
            </p>
          </LegalSection>

          <LegalSection id="shipping" title="Shipping Information">
            <p>
              To deliver your orders, we share only the necessary shipping
              information with our logistics partners, including Shiprocket and
              its courier partners.
            </p>

            <p>Shared information may include:</p>

            <ul>
              <li>Name</li>
              <li>Delivery address</li>
              <li>Mobile number</li>
              <li>Order identification details</li>
            </ul>

            <p>
              This information is used solely for order fulfillment and
              delivery.
            </p>
          </LegalSection>

          <LegalSection id="cookies" title="Cookies">
            <p>
              Our website uses cookies and similar technologies to improve your
              browsing experience.
            </p>

            <p>Cookies help us:</p>

            <ul>
              <li>Remember your preferences</li>
              <li>Maintain your shopping cart</li>
              <li>Analyze website traffic</li>
              <li>Improve website performance</li>
              <li>Provide personalized experiences</li>
            </ul>

            <p>
              You may disable cookies through your browser settings, although
              certain features of the website may not function properly.
            </p>
          </LegalSection>

          <LegalSection id="security" title="Data Security">
            <p>
              We implement appropriate technical and organizational measures to
              safeguard your personal information against unauthorized access,
              disclosure, alteration, or destruction.
            </p>

            <p>
              Although no online system can guarantee absolute security, we
              continuously work to maintain high security standards.
            </p>
          </LegalSection>

          <LegalSection id="your-rights" title="Your Rights">
            <p>You may request to:</p>

            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Update your account information</li>
              <li>Delete your account where legally permissible</li>
              <li>Contact us regarding privacy concerns</li>
            </ul>
          </LegalSection>

          <LegalSection id="children" title="Children's Privacy">
            <p>
              Our website is not intended for individuals under the age of 18.
            </p>

            <p>
              We do not knowingly collect personal information from children.
            </p>
          </LegalSection>

          <LegalSection id="changes" title="Changes to this Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our business practices, legal requirements, or service
              offerings.
            </p>

            <p>
              The latest version will always be published on this page together
              with the updated revision date.
            </p>
          </LegalSection>

          <LegalSection id="contact" title="Contact Us">
            <p>
              If you have any questions regarding this Privacy Policy or your
              personal information, please contact us.
            </p>

            <ul>
              <li>
                <strong>Business:</strong> Rustar Chem
              </li>

              <li>
                <strong>Address:</strong> 33 Ram Nagar, Najafgarh Road, Delhi –
                110041
              </li>

              <li>
                <strong>Email:</strong> support@rustar-chem.in
              </li>

              <li>
                <strong>Phone:</strong> +91 7838302280
              </li>
            </ul>
          </LegalSection>
        </div>
      </LegalContainer>
    </>
  )
}
