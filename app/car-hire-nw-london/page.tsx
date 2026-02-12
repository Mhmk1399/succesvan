import { Metadata } from "next";
import NWLondonCarHire from "@/components/static/areas/NWLondonCarHire";
import Script from "next/script";
import { carHireNwLondonSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Van Hire NW London - Success Van Hire | Vehicle Rental North West London",
  description:
    "Van and vehicle hire services in North West London. Success Van Hire provides reliable Van rental solutions for Brent, Harrow, Ealing and surrounding NW London areas.",
  keywords:
    "Van hire nw london, vehicle rental north west london, Van rental brent, harrow Van hire, ealing vehicle rental, success van hire",
  openGraph: {
    title: "Van Hire North West London - Success Van Hire",
    description:
      "Professional Van and vehicle rental services in North West London. Quality vehicles for all your transport needs.",
    type: "website",
  },
};

export default function CarHireNWLondon() {
  return (
    <div>
       {/* ✅ Schema.org JSON-LD */}
      <Script
        id="car-hire-nw-london-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(carHireNwLondonSchema),
        }}
      />
      <NWLondonCarHire />
    </div>
  );
}
