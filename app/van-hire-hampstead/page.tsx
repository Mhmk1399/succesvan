import { Metadata } from "next";
import GoldersGreenVanHire from "@/components/static/areas/GoldersGreen";

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
      <GoldersGreenVanHire />
    </div>
  );
}
