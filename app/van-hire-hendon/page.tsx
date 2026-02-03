import { Metadata } from "next";
import HendonVanHire from "@/components/static/areas/hendon";
import Script from "next/script";
import { hendon } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Van Hire Hendon - Success Van Hire | Local Van Rental North London",
  description:
    "Professional van hire services in Hendon, North London. Success Van Hire offers reliable van rental near Hendon Central and surrounding areas.",
  keywords:
    "van hire hendon, van rental hendon london, hendon van hire, north london van rental, success van hire hendon",
  openGraph: {
    title: "Van Hire Hendon - Success Van Hire",
    description:
      "Local van rental services in Hendon, North London. Quality vans for all your transport needs.",
    type: "website",
  },
};

export default function VanHireHendon() {
  return (
    <div>
      {/* ✅ Schema.org JSON-LD */}
      <Script
        id="hendon-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hendon),
        }}
      />
      <HendonVanHire />
    </div>
  );
}
