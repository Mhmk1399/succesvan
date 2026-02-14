import { Metadata } from "next";
import Script from "next/script";
import {
  CheapVanHireLondonHero,
  PricingBenefitsSection,
  WhyCheapSection,
  PricingTableSection,
  SavingTipsSection,
  FAQSection,
  FinalCTASection,
} from "@/components/pillar/CheapVanHireLondonPillar";

const cheapVanHireLondonSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cheap Van Hire London",
  serviceType: "Budget Van Hire Service",
  provider: {
    "@type": "AutoRental",
    name: "Success Van Hire",
    url: "https://successvanhire.co.uk/",
    telephone: "+44 20 3011 1198",
    email: "Info@successvanhire.com",
  },
  areaServed: {
    "@type": "City",
    name: "London",
  },
  description:
    "Cheap van hire London from £25/day. Budget van hire London with transparent pricing, no hidden fees. Affordable van rental London for all needs.",
  url: "https://successvanhire.co.uk/cheap-van-hire-london",
  priceRange: "£25-£75",
};

const cheapVanHireLondonFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How cheap is your van hire in London?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our cheap van hire London starts from £25/day for small vans. We offer budget van hire London with transparent pricing and no hidden fees. Prices vary by van size and rental duration.",
      },
    },
    {
      "@type": "Question",
      name: "Is cheap van hire London reliable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Cheap doesn't mean poor quality. All our vans are well-maintained, fully insured, and regularly serviced. We offer affordable van rental London without compromising on reliability.",
      },
    },
    {
      "@type": "Question",
      name: "Do you have any hidden fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. What you see is what you pay. Our cheap van hire London pricing includes insurance and standard mileage. No surprise charges at pickup.",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://successvanhire.co.uk"),
  title:
    "Cheap Van Hire London from £25/Day – Budget Van Rental with No Hidden Fees",
  description:
    "Looking for cheap van hire London? Get budget van hire London from £25/day with transparent pricing and no hidden fees. Affordable van rental London for students, small moves & businesses.",

  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "cheap van hire london",
    "budget van hire london",
    "affordable van rental london",
    "cheap van rental london",
    "low cost van hire london",
    "van hire london under £50",
  ],
  openGraph: {
    title:
      "Cheap Van Hire London from £25/Day – Budget Van Rental with No Hidden Fees",
    description:
      "Budget-friendly van rental in London from £25/day. No hidden fees, transparent pricing, reliable vans.",
    url: "https://successvanhire.co.uk/cheap-van-hire-london",
    type: "website",
    images: [
      {
        url: "https://successvanhire.co.uk/assets/images/van-hire-london.png",
        width: 1200,
        height: 630,
        alt: "Cheap Van Hire London - Success Van Hire",
      },
    ],
  },
};

export default function CheapVanHireLondonPage() {
  return (
    <main className="bg-slate-950">
      <Script
        id="cheap-van-hire-london-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cheapVanHireLondonSchema),
        }}
      />

      <Script
        id="cheap-van-hire-london-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cheapVanHireLondonFAQSchema),
        }}
      />

      <CheapVanHireLondonHero />
      <PricingBenefitsSection />
      <WhyCheapSection />
      <PricingTableSection />
      <SavingTipsSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
