import { Metadata } from "next";
import Script from "next/script";
import {
  VanHireLondonHero,
  WhyChooseSection,
  VanTypesSection,
  CoverageAreasSection,
  UseCasesSection,
  BookingStepsSection,
  FAQSection,
  FinalCTASection,
} from "@/components/pillar/VanHireLondonPillar";
import { vanHireLondonFAQSchema, vanHireLondonSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://successvanhire.co.uk"),
  title: "Van Hire London – Fast Booking, Affordable Prices & Reliable Vans",
  description:
    "Looking for van hire in London? Success Van Hire offers affordable van rental in London with small, medium, large & Luton vans. Fast booking, flexible hire, same-day availability.",

  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "van hire london",
    "cheap van hire london",
    "van rental london",
    "luton van hire london",
    "moving van hire london",
    "business van hire london",
  ],
  openGraph: {
    title: "Van Hire London – Fast Booking, Affordable Prices & Reliable Vans",
    description:
      "Quick, flexible and affordable van rental services across London. Same-day availability, multiple van sizes.",
    url: "https://successvanhire.co.uk/van-hire-london",
    type: "website",
    images: [
      {
        url: "https://successvanhire.co.uk/assets/images/van-hire-london.png",
        width: 1200,
        height: 630,
        alt: "Van Hire London - Success Van Hire",
      },
    ],
  },
};

export default function VanHireLondonPage() {
  return (
    <main className="bg-slate-950">
      {/* Service/Business Schema */}
      <Script
        id="van-hire-london-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(vanHireLondonSchema),
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="van-hire-london-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(vanHireLondonFAQSchema),
        }}
      />

      <VanHireLondonHero />
      <WhyChooseSection />
      <VanTypesSection />
      <CoverageAreasSection />
      <UseCasesSection />
      <BookingStepsSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
