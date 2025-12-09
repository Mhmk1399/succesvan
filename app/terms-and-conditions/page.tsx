import { Metadata } from "next";
import TermsAndConditions from "@/components/static/terms";

export const metadata: Metadata = {
  title: "Terms and Conditions - Success Van Hire | Van Rental Terms London",
  description: "Read Success Van Hire's terms and conditions for van rental services in London. Important rental policies, insurance details, and booking conditions.",
  keywords: "success van hire terms, van rental conditions london, van hire policies, rental agreement terms, success van hire legal",
  openGraph: {
    title: "Terms and Conditions - Success Van Hire",
    description: "Important terms and conditions for van rental services. Read our policies before booking.",
    type: "website",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <TermsAndConditions />
    </>
  );
}
