import type { Metadata } from "next"

import LegalContainer from "@/components/legal/LegalContainer"
import LegalHero from "@/components/legal/LegalHero"
import LegalSection from "@/components/legal/LegalSection"
import LegalSidebar from "@/components/legal/LegalSidebar"

import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Read Rustar Chem's Refund Policy to understand return eligibility, refunds, cancellations, and replacement procedures.",

  alternates: {
    canonical: `${SITE.url}/refund-policy`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Refund Policy | Rustar Chem",
    description:
      "Learn about Rustar Chem's return, replacement, cancellation, and refund process.",
    url: `${SITE.url}/refund-policy`,
    type: "article",
  },
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "returns", label: "Return Eligibility" },
  { id: "non-returnable", label: "Non-Returnable Items" },
  { id: "refunds", label: "Refund Process" },
  { id: "replacement", label: "Replacement Policy" },
  { id: "cancellation", label: "Order Cancellation" },
  { id: "timeline", label: "Refund Timeline" },
  { id: "contact", label: "Contact" },
]

export default function RefundPolicyPage() {
  return (
    <>
      <LegalHero
        title="Refund Policy"
        description="This Refund Policy explains the conditions under which products may be returned, replaced, or refunded."
        lastUpdated="29 July 2026"
      />

      <LegalContainer>
        <LegalSidebar items={sections} />

        <div className="space-y-8">
          <LegalSection id="overview" title="Overview">
            <p>
              Customer satisfaction is important to Rustar Chem. If you receive
              a damaged, defective, or incorrect product, we will work with you
              to resolve the issue as quickly as possible.
            </p>

            <p>
              Please read this policy carefully before requesting a return,
              replacement, or refund.
            </p>
          </LegalSection>

          <LegalSection id="returns" title="Return Eligibility">
            <p>
              Eligible products may be returned within <strong>5 days</strong>{" "}
              from the date of delivery.
            </p>

            <p>Returns may be accepted in situations such as:</p>

            <ul>
              <li>Damaged product received.</li>
              <li>Defective product received.</li>
              <li>Wrong item delivered.</li>
              <li>Product significantly different from the order.</li>
            </ul>

            <p>
              Products should be returned with original packaging, labels, and
              accessories wherever possible.
            </p>
          </LegalSection>

          <LegalSection id="non-returnable" title="Non-Returnable Products">
            <p>The following are generally not eligible for return:</p>

            <ul>
              <li>Products damaged after delivery due to misuse.</li>
              <li>Used or partially consumed products.</li>
              <li>Products without original packaging where required.</li>
              <li>Items returned after the return window has expired.</li>
            </ul>
          </LegalSection>

          <LegalSection id="refunds" title="Refund Process">
            <p>
              After receiving the returned product, our team will inspect it to
              verify eligibility for a refund.
            </p>

            <p>
              If approved, the refund will be initiated to the original payment
              method used during purchase.
            </p>

            <p>
              Refund approval is subject to inspection of the returned product.
            </p>
          </LegalSection>

          <LegalSection id="replacement" title="Replacement Policy">
            <p>
              Where appropriate, Rustar Chem may offer a replacement instead of
              a refund.
            </p>

            <p>
              Replacement requests are subject to stock availability and product
              verification.
            </p>
          </LegalSection>

          <LegalSection id="cancellation" title="Order Cancellation">
            <p>Orders may be cancelled before they are shipped.</p>

            <p>
              Once an order has been dispatched, cancellation may no longer be
              possible and the Refund Policy will apply instead.
            </p>
          </LegalSection>

          <LegalSection id="timeline" title="Refund Timeline">
            <p>
              Approved refunds are generally processed within
              <strong> 5–7 business days </strong>
              after inspection and approval.
            </p>

            <p>
              The time taken for the amount to appear in your account may depend
              on your bank or payment provider.
            </p>
          </LegalSection>

          <LegalSection id="contact" title="Contact Us">
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
              If you have questions regarding returns or refunds, please contact
              our support team before sending any product back.
            </p>
          </LegalSection>
        </div>
      </LegalContainer>
    </>
  )
}
