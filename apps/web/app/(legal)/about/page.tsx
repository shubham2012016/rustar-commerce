import type { Metadata } from "next"

import LegalContainer from "@/components/legal/LegalContainer"
import LegalHero from "@/components/legal/LegalHero"
import LegalSection from "@/components/legal/LegalSection"
import LegalSidebar from "@/components/legal/LegalSidebar"

import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Rustar Chem, our mission, values, and commitment to delivering premium automotive care products across India.",

  alternates: {
    canonical: `${SITE.url}/about`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "About Us | Rustar Chem",
    description:
      "Discover the story behind Rustar Chem and our commitment to quality automotive care products.",
    url: `${SITE.url}/about`,
    type: "website",
  },
}

const sections = [
  { id: "company", label: "Who We Are" },
  { id: "mission", label: "Our Mission" },
  { id: "products", label: "Our Products" },
  { id: "quality", label: "Quality Commitment" },
  { id: "customers", label: "Customer First" },
  { id: "contact", label: "Business Information" },
]

export default function AboutPage() {
  return (
    <>
      <LegalHero
        title="About Rustar Chem"
        description="We manufacture premium automotive care products designed to help enthusiasts, workshops, and professionals maintain vehicles with confidence."
        lastUpdated="29 July 2026"
      />

      <LegalContainer>
        <LegalSidebar items={sections} />

        <div className="space-y-8">
          <LegalSection id="company" title="Who We Are">
            <p>
              Rustar Chem is an Indian automotive care brand focused on
              delivering reliable, high-performance products for vehicle
              maintenance and protection.
            </p>

            <p>
              We strive to provide quality products that combine performance,
              consistency, and value for individual vehicle owners and
              professional users alike.
            </p>
          </LegalSection>

          <LegalSection id="mission" title="Our Mission">
            <p>
              Our mission is to make premium automotive care products accessible
              across India while maintaining high standards of quality,
              reliability, and customer satisfaction.
            </p>
          </LegalSection>

          <LegalSection id="products" title="Our Products">
            <p>Our growing product range includes:</p>

            <ul>
              <li>Chain Lubricants</li>
              <li>Bike & Car Cleaners</li>
              <li>Car Shampoo</li>
              <li>Dashboard Polish</li>
              <li>Tyre Polish</li>
              <li>Glass Cleaner</li>
              <li>Engine Degreaser</li>
              <li>Automotive Maintenance Products</li>
            </ul>
          </LegalSection>

          <LegalSection id="quality" title="Quality Commitment">
            <p>
              Every product is developed with a focus on dependable performance,
              consistency, and customer satisfaction.
            </p>

            <p>
              We continuously improve our formulations and packaging to deliver
              products that meet the evolving needs of automotive enthusiasts
              and professionals.
            </p>
          </LegalSection>

          <LegalSection id="customers" title="Customer First">
            <p>
              We believe that excellent customer service is as important as the
              products we manufacture.
            </p>

            <p>
              Our support team is committed to assisting customers with product
              information, orders, shipping, and after-sales support.
            </p>
          </LegalSection>

          <LegalSection id="contact" title="Business Information">
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

              <li>
                <strong>Country:</strong> India
              </li>
            </ul>
          </LegalSection>
        </div>
      </LegalContainer>
    </>
  )
}
