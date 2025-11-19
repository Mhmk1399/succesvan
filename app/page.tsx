import VanListing from "@/components/global/vanListing";
import AboutUs from "@/components/static/aboutHome";
import FAQComponent from "@/components/static/fAQSection";
import HeroSlider from "@/components/static/HeroSlider";
import ReservationHero from "@/components/static/ReservationHero";
import Testimonials from "@/components/static/testominial";
import WhyUs from "@/components/static/whyus";

export default function Home() {
  const faq = [
    {
      question: "What types of vans do you offer for rental?",
      answer:
        "We offer a range of vans including Small Vans for compact and efficient light deliveries, Medium Vans for versatile cargo space and comfortable seating, Large Vans for heavy-duty major relocations with maximum load capacity and tail lift options, and Luton Vans as a premium choice for house moves with the largest capacity, tail lift included, and climate control.",
      category: "Vehicles",
    },
    {
      question: "How long has Success Van Hire been in business?",
      answer:
        "We have been London's trusted van rental specialist for over 15 years, with 10+ years of experience specializing in long-term and short-term business van rentals.",
      category: "About Us",
    },
    {
      question: "What driving licenses do you accept?",
      answer:
        "We accept full UK and EU driving licences with a quick and easy verification process.",
      category: "Requirements",
    },
    {
      question: "Are your vans eco-friendly?",
      answer:
        "Yes, all our vans meet EU6 emission standards and are part of our eco-friendly fleet, as we are committed to environmental protection.",
      category: "Vehicles",
    },
    {
      question: "What insurance and guarantees are provided?",
      answer:
        "Your rental reservation is 100% secure with comprehensive insurance coverage. All vans are fully insured for self-drive with complete peace of mind.",
      category: "Booking",
    },
    {
      question: "What is your pricing policy?",
      answer:
        "We offer the best value for money with a wide range of prices to fit every budget. Our pricing is transparent with no hidden charges.",
      category: "Pricing",
    },
    {
      question: "How many vehicles are in your fleet?",
      answer:
        "We have a modern fleet of 50+ vehicles, all maintained to the highest standards.",
      category: "About Us",
    },
    {
      question: "What are your availability and support options?",
      answer:
        "We provide 24/7 availability, so you can book anytime and pick up anytime. We offer round-the-clock support for all your needs.",
      category: "Booking",
    },
    {
      question: "What services do you provide for different needs?",
      answer:
        "From small deliveries to house moves, we offer flexible solutions with comprehensive van rental options, including self-drive rentals with exceptional customer service.",
      category: "Services",
    },
    {
      question: "How can I contact you to book or get more information?",
      answer:
        "You can reserve your van online or call us at +44 20 3011 1198. We're always here to help with round-the-clock support.",
      category: "Contact",
    },
  ];
  return (
    <>
      <ReservationHero />
      <VanListing showFilters={true} />
      <HeroSlider />
      <WhyUs />
      <Testimonials layout="grid" autoPlay={true} autoPlayInterval={5000} />
      <AboutUs />
      <FAQComponent
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our van hire services"
        faqs={faq}
        showSearch={false}
        defaultOpen={0}
        accentColor="#fe9a00"
        backgroundColor="#0f172b"
      />{" "}
    </>
  );
}
