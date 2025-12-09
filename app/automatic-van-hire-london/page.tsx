import { Metadata } from "next";
import AutomaticVanHire from "@/components/static/automaticvanHire";

export const metadata: Metadata = {
  title: "Automatic Van Hire London - Success Van Hire | Easy Drive Vans",
  description: "Rent automatic vans in London with Success Van Hire. Easy-to-drive automatic transmission vans perfect for stress-free moving and deliveries. Book today!",
  keywords: "automatic van hire london, automatic van rental, easy drive vans london, automatic transmission van hire, success van hire automatic",
  openGraph: {
    title: "Automatic Van Hire London - Easy Drive Van Rental",
    description: "Stress-free van rental with automatic transmission. Perfect for comfortable driving in London traffic.",
    type: "website",
  },
};

export default function AutomaticVanHirePage() {
  return (
    <div>
      <AutomaticVanHire />
    </div>
  );
}
