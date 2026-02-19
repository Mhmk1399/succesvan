import { Metadata } from "next";
import Script from "next/script";
import {
  LutonVanHireLondonHero,
  WhyChooseLutonSection,
  LutonSpecificationsSection,
  TailLiftBenefitsSection,
  LutonUseCasesSection,
  LutonFAQSection,
  LutonFinalCTA,
} from "@/components/pillar/LutonVanHireLondonPillar";
import LutonVanListing from "@/components/pillar/LutonVanListing";
import {
  lutonVanHireLondonSchema,
  lutonVanHireLondonFAQSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://successvanhire.co.uk"),
  title:
    "Luton Van Hire London from £132/Day – 20m³ Capacity with Tail Lift & Unlimited Mileage",
  description:
    "Luton van hire London from £132/day. Largest capacity Luton van rental London with 20m³ space, tail lift, unlimited mileage. Perfect for 3-4 bedroom house moves & commercial deliveries.",

  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "luton van hire london",
    "luton van rental london",
    "luton van hire with tail lift london",
    "large van hire london",
    "biggest van hire london",
    "luton van hire london prices",
  ],
  openGraph: {
    title:
      "Luton Van Hire London from £132/Day – 20m³ Capacity with Tail Lift & Unlimited Mileage",
    description:
      "Largest capacity Luton van hire London with 20m³ space, tail lift, and unlimited mileage from £132/day.",
    url: "https://successvanhire.co.uk/luton-van-hire-london",
    type: "website",
    images: [
      {
        url: "/assets/images/van-hire-london.png",
        width: 1200,
        height: 630,
        alt: "Luton Van Hire London - Success Van Hire",
      },
    ],
  },
};

export default function LutonVanHireLondonPage() {
  return (
    <main className="bg-slate-950">
      <Script
        id="luton-van-hire-london-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(lutonVanHireLondonSchema),
        }}
      />

      <Script
        id="luton-van-hire-london-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(lutonVanHireLondonFAQSchema),
        }}
      />

      <LutonVanHireLondonHero />
      <WhyChooseLutonSection />
      <LutonVanListing />
      <LutonSpecificationsSection />
      <TailLiftBenefitsSection />
      <LutonUseCasesSection />
      <LutonFAQSection />
      <LutonFinalCTA />
    </main>
  );
}
