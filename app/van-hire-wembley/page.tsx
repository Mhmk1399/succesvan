import { Metadata } from "next";
import WembleyVanHire from "@/components/static/areas/wembley";
import Script from "next/script";
import { wembleySchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Van Hire Wembley - Success Van Hire | Local Van Rental North West London",
  description:
    "Professional van hire services in Wembley, North West London. Success Van Hire offers reliable van rental near Wembley Stadium and surrounding areas.",
  keywords:
    "van hire wembley, van rental wembley london, wembley van hire, north west london van rental, success van hire wembley",
  openGraph: {
    title: "Van Hire Wembley - Success Van Hire",
    description:
      "Local van rental services in Wembley, North West London. Quality vans for all your transport needs.",
    type: "website",
  },
};

export default function VanHireWembley() {
  return (
    <div>
      {/* ✅ Schema.org JSON-LD */}
      <Script
        id="wembley-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(wembleySchema),
        }}
      />
      <WembleyVanHire />
    </div>
  );
}
