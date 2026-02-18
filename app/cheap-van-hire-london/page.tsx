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
import CheapVanListing from "@/components/pillar/CheapVanListing";
import {
  cheapVanHireLondonSchema,
  cheapVanHireLondonFAQSchema,
} from "@/lib/schema";

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
      <CheapVanListing />
      <SavingTipsSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
