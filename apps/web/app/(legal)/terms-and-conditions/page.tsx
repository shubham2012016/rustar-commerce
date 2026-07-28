import type { Metadata } from "next"

import LegalContainer from "@/components/legal/LegalContainer"
import LegalHero from "@/components/legal/LegalHero"
import LegalSection from "@/components/legal/LegalSection"
import LegalSidebar from "@/components/legal/LegalSidebar"

import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Terms & Conditions governing the use of Rustar Chem's website, products, and services.",

  alternates: {
    canonical: `${SITE.url}/terms-and-conditions`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Terms & Conditions | Rustar Chem",
    description: "Read the Terms & Conditions for shopping on Rustar Chem.",
    url: `${SITE.url}/terms-and-conditions`,
    type: "article",
  },
}

const sections = [
  {
    id: "acceptance",
    label: "Acceptance",
  },
  {
    id: "eligibility",
    label: "Eligibility",
  },
  {
    id: "products",
    label: "Products",
  },
  {
    id: "pricing",
    label: "Pricing",
  },
  {
    id: "orders",
    label: "Orders",
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
    id: "returns",
    label: "Returns",
  },
  {
    id: "intellectual-property",
    label: "Intellectual Property",
  },
  {
    id: "liability",
    label: "Limitation of Liability",
  },
  {
    id: "governing-law",
    label: "Governing Law",
  },
  {
    id: "contact",
    label: "Contact",
  },
]

export default function TermsAndConditionsPage() {
  return (
    <>
      <LegalHero
        title="Terms & Conditions"
        description="These Terms & Conditions govern your access to and use of the Rustar Chem website and the purchase of our automotive care products. By using this website, you agree to comply with these terms."
        lastUpdated="29 July 2026"
      />

      <LegalContainer>
        <LegalSidebar items={sections} />

        <div className="space-y-8">
          <LegalSection id="acceptance" title="Acceptance of Terms">
            <p>
              By accessing, browsing, or purchasing products from Rustar Chem,
              you agree to be legally bound by these Terms & Conditions.
            </p>

            <p>
              If you do not agree with any part of these terms, you should
              discontinue using our website immediately.
            </p>
          </LegalSection>

          <LegalSection id="eligibility" title="Eligibility">
            <p>
              You must be at least 18 years of age or legally capable of
              entering into binding contracts under applicable Indian law.
            </p>

            <p>
              By placing an order, you confirm that the information you provide
              is accurate and complete.
            </p>
          </LegalSection>

          <LegalSection id="products" title="Products">
            <p>
              Rustar Chem manufactures and sells automotive care products
              including lubricants, cleaners, polish, shampoo, and maintenance
              solutions.
            </p>

            <ul>
              <li>Product images are for illustration purposes.</li>
              <li>Packaging may change without prior notice.</li>
              <li>Specifications may be updated to improve quality.</li>
              <li>Availability may vary depending on inventory.</li>
            </ul>
          </LegalSection>

          <LegalSection id="pricing" title="Pricing">
            <p>
              All prices displayed on our website are in Indian Rupees (INR).
            </p>

            <p>
              Prices may change without prior notice due to business or market
              conditions.
            </p>

            <p>
              We reserve the right to correct pricing errors before processing
              an order.
            </p>
          </LegalSection>

          <LegalSection id="orders" title="Order Acceptance">
            <p>
              After placing an order, you will receive an order confirmation.
              This confirmation does not guarantee acceptance of your order.
            </p>

            <p>
              Rustar Chem reserves the right to cancel orders for reasons
              including:
            </p>

            <ul>
              <li>Product unavailable</li>
              <li>Pricing errors</li>
              <li>Fraud prevention</li>
              <li>Incomplete customer information</li>
              <li>Violation of these Terms</li>
            </ul>
          </LegalSection>

          <LegalSection id="payments" title="Payments">
            <p>
              Payments are processed securely through trusted payment gateway
              providers such as Razorpay.
            </p>

            <p>
              Rustar Chem never stores your complete card details, UPI PIN, CVV,
              or banking credentials.
            </p>

            <p>
              Orders will only be processed after successful payment
              authorization unless Cash on Delivery is available.
            </p>
          </LegalSection>

          <LegalSection id="shipping" title="Shipping">
            <p>
              Orders are shipped across India through Shiprocket and its courier
              partners.
            </p>

            <ul>
              <li>Processing Time: Within 24 Hours</li>
              <li>Estimated Delivery: 3–7 Business Days</li>
              <li>Delivery timelines may vary depending on location.</li>
            </ul>

            <p>
              Customers are responsible for providing an accurate delivery
              address.
            </p>
          </LegalSection>

          <LegalSection id="returns" title="Returns & Refunds">
            <p>
              Eligible products may be returned within 5 days of delivery in
              accordance with our Refund Policy.
            </p>

            <p>
              Refunds are generally processed within 5–7 business days after the
              returned product has been inspected and approved.
            </p>
          </LegalSection>

          <LegalSection
            id="intellectual-property"
            title="Intellectual Property"
          >
            <p>
              All content available on this website, including logos, product
              images, graphics, text, icons, branding, and designs, is the
              property of Rustar Chem unless otherwise stated.
            </p>

            <p>
              No content may be copied, reproduced, distributed, or used without
              prior written permission.
            </p>
          </LegalSection>

          <LegalSection id="liability" title="Limitation of Liability">
            <p>
              Rustar Chem shall not be liable for indirect, incidental,
              consequential, or special damages arising from the use of our
              website or products.
            </p>

            <p>
              Our maximum liability shall not exceed the amount paid for the
              purchased product.
            </p>
          </LegalSection>

          <LegalSection id="governing-law" title="Governing Law">
            <p>
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of India.
            </p>

            <p>
              Any disputes shall be subject to the exclusive jurisdiction of the
              courts located in Delhi.
            </p>
          </LegalSection>

          <LegalSection id="contact" title="Contact Information">
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

            <p>
              If you have questions regarding these Terms & Conditions, please
              contact our customer support team.
            </p>
          </LegalSection>
        </div>
      </LegalContainer>
    </>
  )
}
