import { Metadata } from "next";
import WelcomePage from "@/components/static/areas/westLondon";
import Script from "next/script";
import { northWestLondon, northWestLondonFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Van Hire North West London - Success Van Hire | Local Van Rental",
  description:
    "Professional van hire services in North West London. Success Van Hire offers reliable, affordable van rental for Brent, Harrow, Ealing and surrounding areas.",
  keywords:
    "van hire north west london, van rental nw london, brent van hire, harrow van rental, ealing van hire, success van hire north west",
  openGraph: {
    title: "Van Hire North West London - Success Van Hire",
    description:
      "Local van rental services in North West London. Reliable vans for moving, delivery, and transport needs.",
    type: "website",
  },
};

export default function VanHireNorthWestLondon() {
  return (
    <div>
      <Script
        id="north-west-london-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(northWestLondon),
        }}
      />
      <Script
        id="north-west-london-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(northWestLondonFAQSchema),
        }}
      />
      <WelcomePage />
    </div>
  );
}
