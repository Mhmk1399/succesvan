"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiMapPin,
  FiPhone,
  FiCheckCircle,
  FiTruck,
  FiStar,
  FiClock,
  FiShield,
} from "react-icons/fi";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import FAQComponent from "../fAQSection";
import VanListingHome from "@/components/global/vanListing.backup";
import { TbAutomaticGearbox } from "react-icons/tb";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqData = [
  {
    question: "What are the age requirements for renting a van?",
    answer:
      "We accept drivers aged 25-70 years with a full clean licence. If you are 21-24, 70-76, or have certain endorsements it may still be possible to hire. Call our office on 020 3011 1198 for more details.",
    category: "Requirements",
  },
  {
    question: "How do I book a van hire in Wembley?",
    answer:
      "You can book by sending your request on our website at www.successvanhire.co.uk/reservation/, sending us an email, or giving us a call on 020 3011 1198. Our booking process is quick and simple.",
    category: "Booking",
  },
  {
    question: "What do I need to rent a van in Wembley?",
    answer:
      "You need to provide: Your ID, a valid driving licences, proof of address, and your bank card. We accept full UK and EU driving licences with quick and easy verification.",
    category: "Requirements",
  },
  {
    question: "Are automatic vans available in Wembley?",
    answer:
      "Yes, we offer automatic transmission vans in Wembley. Automatic vans are perfect for stress-free city driving and are available across our fleet.",
    category: "Vehicles",
  },
];

const serviceAreas = [
  { name: "Hendon", href: "/van-hire-hendon" },
  { name: "Mill Hill", href: "/van-hire-mill-hill", featured: true },
  { name: "Cricklewood", href: "/van-hire-cricklewood" },
  { name: "Golders Green", href: "/van-hire-golders-green" },
  { name: "Hampstead", href: "/van-hire-hampstead" },
  { name: "Camden", href: "/van-hire-camden" },
];

export default function WembleyVanHire() {
  const areaRef = useRef<HTMLElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (areaRef.current) {
        gsap.fromTo(
          areaRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: areaRef.current,
              start: "top 80%",
            },
          }
        );
      }

      if (testimonialRef.current) {
        gsap.fromTo(
          testimonialRef.current.children,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.15,
            scrollTrigger: {
              trigger: testimonialRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Head>
        <title>Van Hire Wembley - Success Van Hire | Affordable Van Rental</title>
        <meta
          name="description"
          content="Professional van hire in Wembley. Success Van Hire offers reliable van rental near Wembley Stadium with competitive rates and flexible options."
        />
        <meta
          name="keywords"
          content="van hire wembley, van rental wembley, wembley van hire, van hire near wembley stadium"
        />
        <link rel="canonical" href="https://successvanhire.co.uk/van-hire-wembley" />
      </Head>

      <div className="relative w-full bg-[#0f172b]">
        {/* Hero Section with Full-Screen Image */}
        <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full overflow-hidden">
          <Image
            src="/assets/images/van hire wembley.png"
            alt="Van Hire Wembley"
            fill
            priority
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172b]/40 via-[#0f172b]/60 to-[#0f172b]" />
        </section>

        {/* Main Content */}
        <div className="relative -mt-32 sm:-mt-40 lg:-mt-48 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column */}
              <div>
                <div className="inline-block px-4 py-2 bg-[#fe9a00]/10 border border-[#fe9a00]/30 rounded-full mb-6">
                  <span className="text-[#fe9a00] font-bold text-sm">
                    ⚡ Available 24/7 in Wembley
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  Van Hire in{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe9a00] to-orange-500">
                    Wembley
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  Flexible van hire in Wembley with Success Van Hire. Whether you need a <Link href="/van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">van hire in London</Link> for removals, deliveries, or IKEA runs, we provide reliable service near Wembley Stadium.
                </p>

                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Conveniently located for Wembley residents, our <Link href="/cheap-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">cheap van hire London</Link> service offers competitive rates without compromising quality. From small vans to large Luton vans, we have the perfect vehicle for your needs.
                </p>

                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Need a <Link href="/removal-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">removal van hire London</Link> for your house move? Our spacious vans and <Link href="/luton-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">Luton van hire London</Link> options make moving easy and affordable.
                </p>

               
              </div>

              {/* Right Column */}
              <div className="relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-black text-white mb-6">Perfect For:</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: <FiTruck className="text-xl" />, text: "House Moves" },
                      { icon: <FiMapPin className="text-xl" />, text: "Deliveries" },
                      { icon: <FiShield className="text-xl" />, text: "Business Use" },
                      { icon: <FiClock className="text-xl" />, text: "IKEA Runs" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="text-[#fe9a00]">{item.icon}</div>
                        <span className="text-white font-semibold text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-start gap-2">
                      <FiCheckCircle className="text-green-400 text-lg mt-0.5 shrink-0" />
                      <div>
                        <div className="text-green-300 font-bold mb-1">
                          Long & Short Term Available
                        </div>
                        <p className="text-green-200 text-sm">
                          Flexible rental periods to suit your schedule
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                                  <div className="grid-cols-2 gap-3 space-y-3 mt-4">
                                    <div className="flex col-span-2 md:col-span-1 items-center gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-[#fe9a00]/40 transition-all duration-300">
                                      <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/20 flex items-center justify-center shrink-0">
                                        <TbAutomaticGearbox className="text-[#fe9a00] text-lg" />
                                      </div>
                                      <span className="text-white text-sm sm:text-base font-bold">
                                        Automatic Vans Available
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-green-400/40 transition-all duration-300">
                                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                                        <FiStar className="text-green-400 text-lg" />
                                      </div>
                                      <span className="text-white text-sm sm:text-base font-bold">
                                        5★ Google Rated
                                      </span>
                                    </div>
                                  </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Van Listing Section */}
        <section className="relative py-20">
          <VanListingHome showHeader={true} gridCols={3} />
        </section>

        {/* Testimonials Section */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                What Our <span className="text-[#fe9a00]">Wembley Customers</span> Say
              </h2>
              <p className="text-gray-400 text-lg">Trusted by locals across Wembley</p>
            </div>

            <div ref={testimonialRef} className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "James Wilson",
                  location: "Wembley Park",
                  text: "Excellent service! Hired a van for my house move in Wembley. The van was clean, reliable, and the staff were very helpful.",
                  rating: 5,
                },
                {
                  name: "Sarah Ahmed",
                  location: "North Wembley",
                  text: "Best van hire rates in Wembley! Used them multiple times for deliveries. Always professional and great value for money.",
                  rating: 5,
                },
                {
                  name: "Michael Brown",
                  location: "Wembley Central",
                  text: "Needed a van last minute for an IKEA run. They sorted me out quickly with a great van at a fair price. Highly recommend!",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#fe9a00]/30 transition-all duration-300"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fe9a00]/20 flex items-center justify-center">
                      <span className="text-[#fe9a00] font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-bold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas Section */}
        <section ref={areaRef} className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Van Hire Across <span className="text-[#fe9a00]">North West London</span>
              </h2>
              <p className="text-gray-400 text-lg">Serving Wembley and surrounding areas</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceAreas.map((area, i) => (
                <Link
                  key={i}
                  href={area.href}
                  className={`group p-6 rounded-xl bg-white/5 border ${
                    area.featured
                      ? "border-2 border-[#fe9a00]/30"
                      : "border-white/10"
                  } hover:bg-white/10 hover:border-[#fe9a00]/30 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{area.name}</h3>
                      <p className="text-gray-400 text-sm">Van Hire Services</p>
                    </div>
                    <FiMapPin className="text-[#fe9a00] text-xl group-hover:scale-110 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQComponent
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our van hire services in Wembley"
          faqs={faqData}
          showSearch={false}
          defaultOpen={0}
          accentColor="#fe9a00"
          backgroundColor="#0f172b"
        />

        {/* Contact CTA Section */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fe9a00] to-orange-500 p-1">
              <div className="bg-gradient-to-br from-[#0f172b] to-[#1e293b] rounded-3xl p-8 lg:p-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
                    Book Your Van Rental in Wembley Today
                  </h2>
                  <p className="text-gray-300 text-xl mb-8 leading-relaxed">
                    Get the best rates on van hire in Wembley. Whether you need a van for a few hours or several weeks, we've got you covered!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <a
                      href="tel:02030111198"
                      className="w-full sm:w-auto group px-8 py-5 rounded-xl bg-gradient-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-lg shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FiPhone className="text-2xl group-hover:rotate-12 transition-transform" />
                      <div className="text-left">
                        <div className="text-xs text-white/80">Call us now</div>
                        <div className="font-black">020 3011 1198</div>
                      </div>
                    </a>
                    <Link
                      href="/reservation"
                      className="w-full sm:w-auto px-8 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FiTruck className="text-xl" />
                      Book Online Now
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <FiCheckCircle className="text-green-400" />
                      <span>No Hidden Charges</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <FiCheckCircle className="text-green-400" />
                      <span>Fully Insured</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <FiCheckCircle className="text-green-400" />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
