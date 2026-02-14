import { Metadata } from "next";
import {
  VanHireLondonPricesHero,
  PricingOverviewSection,
  DetailedPricingTableSection,
  PriceComparisonSection,
  PricingFactorsSection,
  PricingFAQSection,
  PricingFinalCTA,
} from "@/components/pillar/VanHireLondonPricesCluster";

export const metadata: Metadata = {
  title: "Van Hire London Prices 2025 | Daily, Weekly & Monthly Rates",
  description:
    "Complete guide to van hire London prices. Compare transparent daily, weekly, and monthly van rental London prices from £25/day. No hidden fees, unlimited mileage included.",
  keywords:
    "van hire london prices, van rental london prices, cheap van hire london, van hire costs london, daily van hire london, weekly van hire london, monthly van hire london",
  openGraph: {
    title: "Van Hire London Prices 2025 | Daily, Weekly & Monthly Rates",
    description:
      "Compare transparent van hire London prices from £25/day. Daily, weekly, and monthly rates with no hidden fees.",
    url: "https://successvanhire.com/blog/van-hire-london-prices",
    type: "article",
    images: [
      {
        url: "/assets/images/van-hire-london.png",
        width: 1200,
        height: 630,
        alt: "Van Hire London Prices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Van Hire London Prices 2025 | Daily, Weekly & Monthly Rates",
    description:
      "Compare transparent van hire London prices from £25/day. No hidden fees.",
    images: ["/assets/images/van-hire-london.png"],
  },
  alternates: {
    canonical: "https://successvanhire.com/blog/van-hire-london-prices",
  },
};

export default function VanHireLondonPricesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Van Hire London Prices 2025: Daily, Weekly & Monthly Rates",
    description:
      "Complete guide to van hire London prices for daily, weekly, and monthly rentals. Compare transparent pricing across all van sizes with no hidden fees.",
    image: "https://successvanhire.com/assets/images/van-hire-london.png",
    datePublished: "2025-01-15T09:00:00+00:00",
    dateModified: "2025-01-15T09:00:00+00:00",
    author: {
      "@type": "Organization",
      name: "Success Van Hire",
      url: "https://successvanhire.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Success Van Hire",
      logo: {
        "@type": "ImageObject",
        url: "https://successvanhire.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://successvanhire.com/blog/van-hire-london-prices",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the cheapest van hire London prices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our cheapest van hire London prices start from £25 per day for a small van (SWB). Weekly rates from £60/day and monthly rates from £55/day offer even better value. All prices include insurance, unlimited mileage, and breakdown cover with no hidden fees.",
        },
      },
      {
        "@type": "Question",
        name: "Do van hire London prices include insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all our van hire London prices include comprehensive insurance coverage. Unlike many competitors who advertise low prices then add insurance fees at pickup, our transparent van rental London prices include full coverage from the start.",
        },
      },
      {
        "@type": "Question",
        name: "Are there hidden fees in your van hire London prices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No hidden fees whatsoever. Our van hire London prices are completely transparent and include insurance, unlimited mileage, breakdown assistance, and free additional driver. What you see online is exactly what you pay at pickup.",
        },
      },
      {
        "@type": "Question",
        name: "How much can I save with weekly van hire London prices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Weekly van hire London prices save 20-30% compared to daily rates. For example, a medium van costs £96/day but only £78/day on weekly rental — saving you £126 per week. Monthly rates offer even bigger savings.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-[#0a0e1a]">
        <VanHireLondonPricesHero />
        <PricingOverviewSection />
        <DetailedPricingTableSection />
        <PriceComparisonSection />
        <PricingFactorsSection />
        <PricingFAQSection />
        <PricingFinalCTA />
      </main>
    </>
  );
}
