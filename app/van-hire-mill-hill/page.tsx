import { Metadata } from "next";
import MillHillVanHire from "@/components/static/areas/millHill";

export const metadata: Metadata = {
  title:
    "Van Hire Mill Hill - Success Van Hire | Local Van Rental North London",
  description:
    "Professional van hire services in Mill Hill, North London. Success Van Hire offers reliable van rental near Mill Hill Broadway and surrounding areas.",
  keywords:
    "van hire mill hill, van rental mill hill london, mill hill van hire, north london van rental, success van hire mill hill",
  openGraph: {
    title: "Van Hire Mill Hill - Success Van Hire",
    description:
      "Local van rental services in Mill Hill, North London. Quality vans for all your transport needs.",
    type: "website",
  },
};

export default function VanHireMillHill() {
  return (
    <div>
      <MillHillVanHire />
    </div>
  );
}
