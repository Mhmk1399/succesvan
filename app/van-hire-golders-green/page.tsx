import { Metadata } from "next";
import GoldersGreenVanHire from "@/components/static/areas/GoldersGreen";
import Script from "next/script";
import { goldersGreen, goldersGreenFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Van Hire Golders Green - Success Van Hire | Local Van Rental NW London",
  description:
    "Professional van hire services in Golders Green, North West London. Success Van Hire offers reliable van rental near Golders Green station and surrounding areas.",
  keywords:
    "van hire golders green, van rental golders green london, golders green van hire, nw london van rental, success van hire golders green",
  openGraph: {
    title: "Van Hire Golders Green - Success Van Hire",
    description:
      "Local van rental services in Golders Green, North West London. Quality vans for all your transport needs.",
    type: "website",
  },
};

export default function VanHireGoldersGreen() {
  return (
    <div>
      {/* Service Schema */}
      <Script
        id="golders-green-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(goldersGreen),
        }}
      />
      {/* FAQ Schema */}
      <Script
        id="golders-green-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(goldersGreenFAQSchema),
        }}
      />
      <GoldersGreenVanHire />
    </div>
  );
}
