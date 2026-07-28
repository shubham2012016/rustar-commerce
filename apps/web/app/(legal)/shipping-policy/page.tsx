import type { Metadata } from "next"

import LegalContainer from "@/components/legal/LegalContainer"
import LegalHero from "@/components/legal/LegalHero"
import LegalSection from "@/components/legal/LegalSection"
import LegalSidebar from "@/components/legal/LegalSidebar"

import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Read Rustar Chem's Shipping Policy to understand order processing, shipping timelines, delivery information, and courier services.",

  alternates: {
    canonical: `${SITE.url}/shipping-policy`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Shipping Policy | Rustar Chem",
    description:
      "Shipping information, processing times, delivery estimates, and courier partners for Rustar Chem.",
    url: `${SITE.url}/shipping-policy`,
    type: "article",
  },
}

const sections = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "shipping-locations",
    label: "Shipping Locations",
  },
  {
    id: "processing",
    label: "Order Processing",
  },
  {
    id: "delivery",
    label: "Delivery Timeline",
  },
  {
    id: "charges",
    label: "Shipping Charges",
  },
  {
    id: "courier",
    label: "Courier Partners",
  },
  {
    id: "tracking",
    label: "Order Tracking",
  },
  {
    id: "address",
    label: "Delivery Address",
  },
  {
    id: "delay",
    label: "Delivery Delays",
  },
  {
    id: "damaged",
    label: "Damaged Shipments",
  },
  {
    id: "contact",
    label: "Contact",
  },
]

export default function ShippingPolicyPage() {
  return (
    <>
      <LegalHero
        title="Shipping Policy"
        description="This Shipping Policy explains how Rustar Chem processes, ships, and delivers orders placed through our website."
        lastUpdated="29 July 2026"
      />

      <LegalContainer>
        <LegalSidebar items={sections} />

        <div className="space-y-8">
          <LegalSection id="overview" title="Overview">
            <p>
              Rustar Chem is committed to delivering your automotive care
              products safely and as quickly as possible.
            </p>

            <p>
              This Shipping Policy explains our order processing, shipping,
              courier partners, estimated delivery timelines, and customer
              responsibilities.
            </p>
          </LegalSection>

          <LegalSection id="shipping-locations" title="Shipping Locations">
            <p>We currently ship products across India.</p>

            <p>At this time, international shipping is not available.</p>

            <p>
              Certain remote locations may experience longer delivery times
              depending on courier availability.
            </p>
          </LegalSection>

          <LegalSection id="processing" title="Order Processing">
            <p>
              Orders are normally processed within <strong>24 hours</strong> of
              successful payment confirmation.
            </p>

            <ul>
              <li>
                Orders received on Sundays or public holidays may be processed
                on the next working day.
              </li>
              <li>Orders are subject to inventory availability.</li>
              <li>
                Customers will receive confirmation once the order has been
                shipped.
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="delivery" title="Estimated Delivery Time">
            <p>Standard delivery across India generally takes:</p>

            <ul>
              <li>3–7 Business Days</li>
            </ul>

            <p>Delivery timelines are estimates and may vary depending on:</p>

            <ul>
              <li>Customer location</li>
              <li>Courier operations</li>
              <li>Weather conditions</li>
              <li>Public holidays</li>
              <li>Natural disasters or other unforeseen events</li>
            </ul>
          </LegalSection>

          <LegalSection id="charges" title="Shipping Charges">
            <p>
              Shipping charges, if applicable, are displayed during checkout
              before payment.
            </p>

            <p>
              Promotional offers such as free shipping may be available from
              time to time and will be clearly shown on the website.
            </p>
          </LegalSection>

          <LegalSection id="courier" title="Courier Partners">
            <p>
              Rustar Chem uses Shiprocket and its network of trusted courier
              partners to deliver orders across India.
            </p>

            <p>
              Courier selection is determined automatically based on service
              availability and delivery location.
            </p>
          </LegalSection>

          <LegalSection id="tracking" title="Order Tracking">
            <p>
              Once your order is shipped, you will receive shipment details and
              a tracking number via email or SMS (where applicable).
            </p>

            <p>
              Customers can use the tracking information provided to monitor
              delivery status directly through the courier service.
            </p>
          </LegalSection>

          <LegalSection id="address" title="Delivery Address">
            <p>
              Customers are responsible for providing complete and accurate
              shipping information while placing an order.
            </p>

            <ul>
              <li>Incorrect addresses may delay delivery.</li>
              <li>Additional shipping charges may apply for reshipment.</li>
              <li>
                Rustar Chem is not responsible for failed deliveries caused by
                incorrect customer information.
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="delay" title="Delivery Delays">
            <p>
              While we strive to meet estimated delivery timelines, delays may
              occasionally occur due to factors beyond our control.
            </p>

            <ul>
              <li>Severe weather</li>
              <li>Transportation disruptions</li>
              <li>Government restrictions</li>
              <li>Natural disasters</li>
              <li>Unexpected courier delays</li>
            </ul>

            <p>We appreciate your patience in such circumstances.</p>
          </LegalSection>

          <LegalSection id="damaged" title="Damaged or Lost Shipments">
            <p>
              If your order arrives damaged or appears to have been tampered
              with, please contact our customer support within 48 hours of
              delivery.
            </p>

            <p>
              Please retain the original packaging and provide photographs of
              the shipment to help us investigate the issue promptly.
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
              If you have any shipping-related questions, please contact our
              customer support team.
            </p>
          </LegalSection>
        </div>
      </LegalContainer>
    </>
  )
}
