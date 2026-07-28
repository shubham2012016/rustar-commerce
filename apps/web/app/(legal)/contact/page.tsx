import type { Metadata } from "next"

import LegalContainer from "@/components/legal/LegalContainer"
import LegalHero from "@/components/legal/LegalHero"
import LegalSection from "@/components/legal/LegalSection"
import LegalSidebar from "@/components/legal/LegalSidebar"

import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Rustar Chem for product inquiries, order support, shipping assistance, or general questions.",

  alternates: {
    canonical: `${SITE.url}/contact`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Contact Us | Rustar Chem",
    description:
      "Contact Rustar Chem customer support for assistance with products, orders, and shipping.",
    url: `${SITE.url}/contact`,
    type: "website",
  },
}

const sections = [
  {
    id: "support",
    label: "Customer Support",
  },
  {
    id: "business",
    label: "Business Details",
  },
  {
    id: "hours",
    label: "Business Hours",
  },
  {
    id: "response",
    label: "Response Time",
  },
  {
    id: "address",
    label: "Visit Us",
  },
]

export default function ContactPage() {
  return (
    <>
      <LegalHero
        title="Contact Us"
        description="We're here to help. Reach out to Rustar Chem for product information, order support, shipping assistance, or general inquiries."
        lastUpdated="29 July 2026"
      />

      <LegalContainer>
        <LegalSidebar items={sections} />

        <div className="space-y-8">
          <LegalSection id="support" title="Customer Support">
            <p>
              Our customer support team is available to assist you with product
              inquiries, order updates, shipping information, returns, refunds,
              and general questions.
            </p>

            <ul>
              <li>
                <strong>Email:</strong> support@rustar-chem.in
              </li>

              <li>
                <strong>Phone:</strong> +91 7838302280
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="business" title="Business Information">
            <ul>
              <li>
                <strong>Business Name:</strong> Rustar Chem
              </li>

              <li>
                <strong>Business Type:</strong> Proprietorship
              </li>

              <li>
                <strong>Country:</strong> India
              </li>

              <li>
                <strong>GST Registration:</strong> Not Registered
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="hours" title="Business Hours">
            <p>Our support team is available during the following hours:</p>

            <ul>
              <li>Monday – Saturday</li>
              <li>9:00 AM – 6:00 PM (IST)</li>
              <li>Sunday: Closed</li>
            </ul>

            <p>
              Messages received outside business hours will be responded to on
              the next working day.
            </p>
          </LegalSection>

          <LegalSection id="response" title="Response Time">
            <p>
              We aim to respond to most customer inquiries within one business
              day.
            </p>

            <p>
              During holidays, promotions, or periods of high order volume,
              response times may be slightly longer.
            </p>
          </LegalSection>

          <LegalSection id="address" title="Office Address">
            <p>Rustar Chem</p>

            <p>
              33 Ram Nagar,
              <br />
              Najafgarh Road,
              <br />
              Delhi – 110041,
              <br />
              India
            </p>

            <p>
              We recommend contacting us before visiting, as this address may
              not operate as a retail walk-in location.
            </p>
          </LegalSection>
        </div>
      </LegalContainer>
    </>
  )
}
