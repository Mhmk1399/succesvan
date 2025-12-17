import HomeContainer from "@/components/static/homeContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success Van Hire | Professional Van Rental Services London",
  description:
    "Rent a van in London with Success Van Hire. Affordable, reliable van rental services with a wide selection of vehicles. Book your van today!",
  keywords:
    "van hire london, van rental london, rent a van, professional van hire, affordable van rental, london van rental company",
  openGraph: {
    title: "Success Van Hire - Professional Van Rental London",
    description:
      "Affordable and reliable van rental in London. Wide selection of vans, competitive prices, and exceptional service.",
    type: "website",
  },
};

export default function Home() {
  return <HomeContainer />;
}
