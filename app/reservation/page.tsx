import { Metadata } from "next";
import { ReservationContent } from "@/components/static/reservationContainer";

export const metadata: Metadata = {
  title: "Van Reservation - Success Van Hire | Book Your Van Online London",
  description:
    "Reserve your van online with Success Van Hire. Quick and easy booking process for van rental in London. Choose your dates, van type, and confirm instantly.",
  keywords:
    "van reservation london, book van online, van rental booking, reserve van hire london, success van hire booking",
  openGraph: {
    title: "Reserve Your Van - Success Van Hire London",
    description:
      "Quick and easy online van booking. Reserve your perfect van for moving, delivery, or transport needs in London.",
    type: "website",
  },
};

export default function ReservationPage() {
  return (
    <div>
      <ReservationContent />
    </div>
  );
}
