import { Metadata } from "next";
import VanRentalBrentCross from "@/components/static/areas/BrentCross";
import Script from "next/script";
import { VanHireBrentCrossSchema, brentCrossFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Van Hire Brent Cross London - Success Van Hire | Last Minute Bookings",
  description:
    "Van rental in Brent Cross London with Success Van Hire. Last minute bookings available. Professional van hire services near Brent Cross Shopping Centre.",
  keywords:
    "van hire brent cross, van rental brent cross london, last minute van booking, brent cross van hire, success van hire brent cross",
  openGraph: {
    title: "Van Hire Brent Cross London - Last Minute Bookings",
    description:
      "Professional van rental services in Brent Cross London. Last minute bookings available for all your transport needs.",
    type: "website",
  },
};

export default function VanHireBrentCross() {
  return (
    <div>
      <Script
        id="brent-cross-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(VanHireBrentCrossSchema),
        }}
      />
      <Script
        id="brent-cross-faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(brentCrossFAQSchema),
        }}
      />
      <VanRentalBrentCross />
    </div>
  );
}
