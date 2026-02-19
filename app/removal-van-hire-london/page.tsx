import { Metadata } from "next";
import Script from "next/script";
import {
  RemovalVanHireLondonHero,
  WhyChooseRemovalSection,
  VanSizesForMovingSection,
  MovingTipsSection,
  RemovalFAQSection,
  RemovalFinalCTA,
} from "@/components/pillar/RemovalVanHireLondonPillar";
import RemovalVanListing from "@/components/pillar/RemovalVanListing";
import { removalVanSchema, removalFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Removal Van Hire London | Moving Van Hire from £78/Day",
  description:
    "Professional removal van hire London for house moves and relocations. Spacious moving van hire London with insurance, unlimited mileage, and 24/7 support from £78/day.",
  keywords:
    "removal van hire london, moving van hire london, house move van hire, van hire for moving london, removal van rental london, moving van london",
  openGraph: {
    title: "Removal Van Hire London | Moving Van Hire from £78/Day",
    description:
      "Professional removal van hire London for house moves. Spacious vans from £78/day with insurance and unlimited mileage.",
    url: "https://successvanhire.com/removal-van-hire-london",
    type: "website",
    images: [
      {
        url: "/assets/images/van-hire-london.jpg",
        width: 1200,
        height: 630,
        alt: "Removal Van Hire London",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Removal Van Hire London | Moving Van Hire from £78/Day",
    description:
      "Professional removal van hire London for house moves from £78/day.",
    images: ["/assets/images/van-hire-london.jpg"],
  },
  alternates: {
    canonical: "https://successvanhire.com/removal-van-hire-london",
  },
};

export default function RemovalVanHireLondonPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Script
        id="removal-van-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(removalVanSchema),
        }}
      />
      <Script
        id="removal-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(removalFAQSchema),
        }}
      />
      <RemovalVanHireLondonHero />
      <WhyChooseRemovalSection />
      <VanSizesForMovingSection />
      <RemovalVanListing />
      <MovingTipsSection />
      <RemovalFAQSection />
      <RemovalFinalCTA />
    </main>
  );
}
