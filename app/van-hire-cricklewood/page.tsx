import { Metadata } from "next";
import CricklewoodVanHire from "@/components/static/areas/cricklewood";
import Script from "next/script";
import { cricklewood, cricklewoodFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Van Hire Cricklewood - Success Van Hire | Local Van Rental NW London",
  description:
    "Professional van hire services in Cricklewood, North West London. Success Van Hire offers reliable van rental near Cricklewood Broadway and surrounding areas.",
  keywords:
    "van hire cricklewood, van rental cricklewood london, cricklewood van hire, nw london van rental, success van hire cricklewood",
  openGraph: {
    title: "Van Hire Cricklewood - Success Van Hire",
    description:
      "Local van rental services in Cricklewood, North West London. Quality vans for all your transport needs.",
    type: "website",
  },
};

export default function VanHireCricklewood() {
  return (
    <div>
      {/* Service Schema */}
      <Script
        id="Cricklewood-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cricklewood),
        }}
      />
      {/* FAQ Schema */}
      <Script
        id="cricklewood-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cricklewoodFAQSchema),
        }}
      />
      <CricklewoodVanHire />
    </div>
  );
}
