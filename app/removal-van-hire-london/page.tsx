import { Metadata } from "next";
import {
  RemovalVanHireLondonHero,
  WhyChooseRemovalSection,
  VanSizesForMovingSection,
  MovingTipsSection,
  RemovalFAQSection,
  RemovalFinalCTA,
} from "@/components/pillar/RemovalVanHireLondonPillar";

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
        url: "/assets/images/van-hire-london.png",
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
    images: ["/assets/images/van-hire-london.png"],
  },
  alternates: {
    canonical: "https://successvanhire.com/removal-van-hire-london",
  },
};

export default function RemovalVanHireLondonPage() {
  const removalVanSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Removal Van Hire London",
    description:
      "Professional removal van hire London service for house moves, flat relocations, and office transfers. Spacious vans with insurance and unlimited mileage.",
    provider: {
      "@type": "LocalBusiness",
      name: "Success Van Hire",
      image: "https://successvanhire.com/logo.png",
      telephone: "+44 20 3011 1198",
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB",
      },
    },
    areaServed: {
      "@type": "City",
      name: "London",
    },
    priceRange: "£78-£132",
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: "78",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "78",
        priceCurrency: "GBP",
        unitText: "DAY",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What size removal van do I need for my house move in London?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a studio or 1-bed flat, a Medium Van (MWB) is sufficient. A 2-bedroom property needs a Large Van (LWB), while 3-4 bedroom houses require a Luton van. Our removal van hire London team can help you choose the right size based on your inventory.",
        },
      },
      {
        "@type": "Question",
        name: "Is removal van hire London cheaper than hiring movers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, removal van hire London is significantly cheaper than full-service movers. You can save 60-70% by driving yourself. Our moving van hire London rates start from £78/day compared to £400-800 for professional movers.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a special licence to drive a Luton van in London?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, a standard UK driving licence is sufficient for our Luton vans. All our removal van hire London vehicles are under 3.5 tonnes, so you can drive them with a regular car licence.",
        },
      },
      {
        "@type": "Question",
        name: "Are your removal vans ULEZ compliant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all our removal van hire London fleet is ULEZ compliant. You can drive anywhere in London without ULEZ charges, making your moving van hire London experience hassle-free.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(removalVanSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-[#0a0e1a]">
        <RemovalVanHireLondonHero />
        <WhyChooseRemovalSection />
        <VanSizesForMovingSection />
        <MovingTipsSection />
        <RemovalFAQSection />
        <RemovalFinalCTA />
      </main>
    </>
  );
}
