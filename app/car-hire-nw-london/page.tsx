import { Metadata } from "next";
import NWLondonCarHire from "@/components/static/areas/NWLondonCarHire";

export const metadata: Metadata = {
  title:
    "Car Hire NW London - Success Van Hire | Vehicle Rental North West London",
  description:
    "Car and vehicle hire services in North West London. Success Van Hire provides reliable car rental solutions for Brent, Harrow, Ealing and surrounding NW London areas.",
  keywords:
    "car hire nw london, vehicle rental north west london, car rental brent, harrow car hire, ealing vehicle rental, success van hire cars",
  openGraph: {
    title: "Car Hire North West London - Success Van Hire",
    description:
      "Professional car and vehicle rental services in North West London. Quality vehicles for all your transport needs.",
    type: "website",
  },
};

export default function CarHireNWLondon() {
  return (
    <div>
      <NWLondonCarHire />
    </div>
  );
}
