"use client";

import { useState } from "react";
import SEODescription from "@/components/global/seoDesc";
import VanListingHome from "@/components/global/vanListing.backup";
import AboutUs from "@/components/static/aboutHome";
import FAQComponent from "@/components/static/fAQSection";
import HeroSlider from "@/components/static/HeroSlider";
import ReservationHero from "@/components/static/ReservationHero";
import Testimonials from "@/components/static/testominial";
import WhyUs from "@/components/static/whyus";
import ReservationModal from "@/components/global/ReservationModal";

export default function HomeContainer() {
  const [showReservationModal, setShowReservationModal] = useState(false);
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
      <ReservationHero onBookNow={() => setShowReservationModal(true)} />
      <VanListingHome />
      <HeroSlider />
      <WhyUs />
      <Testimonials layout="carousel" autoPlay={true} autoPlayInterval={5000} />
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
      <SEODescription
        content="<h2>Self-Drive Van &amp; Minibus Hire in North West London</h2>
<p>
  Success Van Hire makes renting a van or minibus in North West London
  simple, fast and stress-free. Whether you are moving home, running a
  business or planning a group trip, our clean, reliable vehicles and
  flexible hire options are designed to fit your day – not the other way around.
</p>
<p>
  Based in North West London, we proudly serve drivers in
  Golders Green, Cricklewood, Brent Cross, Finchley, Mill Hill, Colindale,
  Edgware, Neasden, Ealing, Hampstead, Watford and Wembley.
  Book online in minutes and pick up your vehicle ready to go.
</p>

<h3>Why Choose Success Van Hire?</h3>
<ul>
  <li><strong>Self-drive freedom</strong> – hire the vehicle, choose your route, drive on your schedule.</li>
  <li><strong>Flexible hire periods</strong> – daily, weekend and longer-term van and minibus rental available.</li>
  <li><strong>Clean, well-maintained fleet</strong> – modern vehicles, regularly serviced and safety checked.</li>
  <li><strong>Transparent pricing</strong> – clear rates with no hidden surprises when you collect the keys.</li>
  <li><strong>Easy online booking</strong> – check availability, choose your vehicle and reserve in just a few clicks.</li>
  <li><strong>Friendly local team</strong> – real support from people who know North West London’s roads and traffic.</li>
</ul>

<h3>Self-Drive Vans for Moving, Deliveries &amp; Business Use</h3>
<p>
  Our self-drive van hire is ideal for house moves, student moves,
  furniture collection, DIY projects, event equipment and everyday business
  deliveries. From compact vans for city streets to larger panel vans with
  generous load space, we help you choose the right size for your job so you
  only pay for the capacity you actually need.
</p>
<p>
  Every van is inspected before collection, with fuel-efficient engines,
  comfortable seats and practical load areas to make loading and unloading
  as easy as possible.
</p>

<h3>Comfortable Self-Drive Minibus Hire for Groups</h3>
<p>
  Need to travel together as a group? Our self-drive minibus hire options
  are perfect for family trips, airport runs, days out, school and sports
  teams, corporate events, weddings and more.
</p>
<p>
  We offer 8-seater, 14-seater and 17-seater minibuses, giving you the
  flexibility to choose the right size for your passengers and luggage.
  Comfortable seating, modern safety features and spacious interiors help
  everyone arrive relaxed and on time.
</p>

<h3>Simple, Clear &amp; Honest Pricing</h3>
<p>
  At Success Van Hire, we believe van and minibus hire should be easy to
  understand. Our prices are clearly displayed during the booking process,
  with straightforward mileage and insurance options so you can see exactly
  what you are paying for before you confirm your reservation.
</p>
<p>
  No confusing extras, no last-minute surprises – just reliable vehicles at
  competitive North West London rates.
</p>

<h3>Van &amp; Minibus Hire Across North West London</h3>
<p>
  We serve customers across a wide area of North West London, including:
</p>
<ul>
  <li>Golders Green, Cricklewood &amp; Brent Cross</li>
  <li>Finchley, Mill Hill &amp; Colindale</li>
  <li>Edgware, Neasden &amp; Ealing</li>
  <li>Hampstead, Watford &amp; Wembley</li>
</ul>
<p>
  If you live, work or are travelling through any of these areas, Success
  Van Hire is your convenient local choice for self-drive van and minibus hire.
</p>

<h3>Book Your Self-Drive Van or Minibus Today</h3>
<p>
  Ready to get moving? Book your self-drive van or minibus online with
  Success Van Hire today. Choose your date, pick your vehicle and we will
  have it prepared and ready for collection.
</p>
<p>
  Whether it is a one-day van hire for a quick job or a longer-term minibus
  hire for regular journeys, our team is here to help you get on the road
  quickly and confidently across North West London.
</p>
"
        collapsedLines={4}
      />
      {showReservationModal && (
        <ReservationModal onClose={() => setShowReservationModal(false)} />
      )}
    </>
  );
}
