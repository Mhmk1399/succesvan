import { Metadata } from "next";
import CricklewoodVanHire from "@/components/static/areas/cricklewood";

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
      <CricklewoodVanHire />
    </div>
  );
}
