import { Metadata } from "next";
import HampsteadVanHire from "@/components/static/areas/Hampstead";
import Script from "next/script";
import { hampstead } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Van Hire Hampstead - Success Van Hire | Local Van Rental North London",
  description:
    "Professional van hire services in Hampstead, North London. Success Van Hire offers reliable van rental near Hampstead Heath and surrounding areas.",
  keywords:
    "van hire hampstead, van rental hampstead london, hampstead van hire, north london van rental, success van hire hampstead",
  openGraph: {
    title: "Van Hire Hampstead - Success Van Hire",
    description:
      "Local van rental services in Hampstead, North London. Quality vans for all your transport needs.",
    type: "website",
  },
};

export default function VanHireHampstead() {
  return (
    <div>
      {/* ✅ Schema.org JSON-LD */}
      <Script
        id="hampstead-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hampstead),
        }}
      />
      <HampsteadVanHire />
    </div>
  );
}
