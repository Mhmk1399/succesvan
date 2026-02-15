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

const lutonVanHireLondonSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Luton Van Hire London",
  serviceType: "Luton Van Rental Service",
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
    "Luton van hire London from £132/day. Largest capacity Luton van rental London with 20m³ space, tail lift, and unlimited mileage. Perfect for full house moves and commercial deliveries.",
  url: "https://successvanhire.co.uk/luton-van-hire-london",
  priceRange: "£132-£180",
};

const lutonVanHireLondonFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need a special licence to drive a Luton van in London?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, you can drive our Luton vans with a standard UK driving licence. All our Luton van hire London vehicles are under 3.5 tonnes, so no special licence or training is required. If you passed your test after 1997, you can still drive our Luton vans.",
      },
    },
    {
      "@type": "Question",
      name: "How much can a Luton van carry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Luton van hire London offers 20m³ cargo capacity plus over-cab storage, with a payload of up to 1,000kg. This is enough for a complete 3-4 bedroom house move or substantial commercial deliveries. The Luton van rental London is our largest capacity vehicle.",
      },
    },
    {
      "@type": "Question",
      name: "Are tail lifts included with Luton van hire London?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our Luton vans come equipped with tail lifts at no extra cost. The 500kg capacity tail lift makes loading heavy furniture and appliances effortless. Perfect for house moves and commercial deliveries with Luton van hire London.",
      },
    },
    {
      "@type": "Question",
      name: "Is Luton van hire London more expensive than smaller vans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Luton van hire London costs £132/day, which is excellent value considering the massive capacity. You'll likely complete your move in one trip instead of multiple trips with smaller vans, actually saving money overall on fuel and time.",
      },
    },
    {
      "@type": "Question",
      name: "Can I drive a Luton van in central London?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all our Luton van hire London fleet is ULEZ compliant, so you can drive anywhere in London without ULEZ charges. However, be aware of congestion charges in central zones and check parking restrictions for larger vehicles.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in Luton van rental London prices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All our Luton van hire London prices include comprehensive insurance, unlimited mileage, 24/7 breakdown cover, free additional driver, tail lift, and full tank of fuel. No hidden fees - what you see is what you pay for your Luton van rental London.",
      },
    },
  ],
};

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
        url: "https://successvanhire.co.uk/assets/images/van-hire-london.png",
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
