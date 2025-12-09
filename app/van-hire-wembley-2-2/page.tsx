import { Metadata } from "next";
import CamdenVanHire from "@/components/static/areas/Camedan";

export const metadata: Metadata = {
  title: "Van Hire Camden - Success Van Hire | Local Van Rental North London",
  description:
    "Professional van hire services in Camden, North London. Success Van Hire offers reliable van rental near Camden Market and surrounding areas.",
  keywords:
    "van hire camden, van rental camden london, camden van hire, north london van rental, success van hire camden",
  openGraph: {
    title: "Van Hire Camden - Success Van Hire",
    description:
      "Local van rental services in Camden, North London. Quality vans for all your transport needs.",
    type: "website",
  },
};

export default function VanHireCamden() {
  return (
    <div>
      <CamdenVanHire />
    </div>
  );
}
