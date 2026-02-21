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
  FiExternalLink,
  FiNavigation,

} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import FAQComponent from "../fAQSection";
import { features, useCases } from "@/lib/areas";
import VanListingHome from "@/components/global/vanListing.backup";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// FAQ Data
const faqData = [
  {
    question: "What are the age requirements for renting a van?",
    answer:
      "We accept drivers aged 25-70 years with a full clean licence. If you are 21-24, 70-76, or have certain endorsements it may still be possible to hire. Call our office on 020 3011 1198 for more details.",
    category: "Requirements",
  },
  {
    question: "How do I book a van hire in Cricklewood?",
    answer:
      "You can book by sending your request on our website at www.successvanhire.co.uk/reservation/, sending us an email, or giving us a call on 020 3011 1198. Our booking process is quick and simple.",
    category: "Booking",
  },
  {
    question: "What do I need to rent a van in Cricklewood?",
    answer:
      "You need to provide: Your ID, a valid driving licences, proof of address, and your bank card. We accept full UK and EU driving licences with quick and easy verification.",
    category: "Requirements",
  },
  {
    question: "Are your vans eco-friendly?",
    answer:
      "Yes, all our vans meet EU6 emission standards and are part of our eco-friendly fleet. We are committed to environmental protection.",
    category: "Vehicles",
  },
];

export default function CricklewoodVanHire() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const testimonialRef = useRef<(HTMLDivElement | null)[]>([]);
  const areaRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate features
      featuresRef.current.forEach((feature, index) => {
        if (!feature) return;
        gsap.fromTo(
          feature,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: feature,
              start: "top 85%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });

      // Animate testimonials
      testimonialRef.current.forEach((testimonial, index) => {
        if (!testimonial) return;
        gsap.fromTo(
          testimonial,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: testimonial,
              start: "top 85%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.15,
          }
        );
      });

      // Animate area cards
      areaRef.current.forEach((area, index) => {
        if (!area) return;
        gsap.fromTo(
          area,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: area,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.05,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Testimonials
  const testimonials = [
    {
      name: "Mark T.",
      rating: 5,
      text: "Needed a van last minute for a house move in Cricklewood. Success Van Hire were fantastic – quick booking, clean van, and great price. Highly recommend their van hire Cricklewood service!",
      location: "Cricklewood",
    },
    {
      name: "Linda R.",
      rating: 5,
      text: "I've used Success Van Hire several times for business deliveries in NW London. Always reliable, vans are well-maintained, and the staff are friendly. Best van rental Cricklewood London.",
      location: "Willesden",
    },
    {
      name: "Steve M.",
      rating: 5,
      text: "Rented a Luton van for a full house move. The process was smooth, and the van was ULEZ compliant. Great value for NW London van rental.",
      location: "Hendon",
    },
  ];

  // Service areas
 const serviceAreas = [
    { name: "Camden", link: "/van-hire-camden" , featured: true},
    { name: "Hampstead", link: "/van-hire-hampstead" },
    { name: "Hendon", link: "/van-hire-hendon" },
    { name: "Golders Green", link: "/van-hire-golders-green" },
    { name: "Mill Hill", link: "/van-hire-mill-hill" },
    { name: "Wembley", link: "/van-hire-wembley" },
    { name: "Brent Cross", link: "/success-van-hire-van-rental-in-brent-cross-london-last-minute-bookings" },
    { name: "NW London", link: "/van-hire-north-west-london" },
  ];
  return (
    <>
      <Head>
        <title>Van Hire Cricklewood | Success Van Hire - Cheap & Reliable NW London Van Rental</title>
        <meta
          name="description"
          content="Need van hire in Cricklewood? Success Van Hire offers affordable van rental Cricklewood London with a wide range of vans – small, medium, Luton, automatics. ULEZ compliant, no hidden fees, 5-star service. Book online or call 020 3011 1198."
        />
        <meta
          name="keywords"
          content="van hire cricklewood, van rental cricklewood london, cricklewood van hire, nw london van rental, success van hire cricklewood, cheap van hire london"
        />
        <link rel="canonical" href="https://www.successvanhire.com/van-hire-cricklewood" />
      </Head>

      <div ref={sectionRef} className="relative w-full bg-[#0f172b] py-28">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-125 h-125 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <section className="relative">
          {/* Full Screen Image */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172b]/40 via-[#0f172b]/60 to-[#0f172b] z-10"></div>
            <Image
              src="/assets/images/ crickle wood.jpg"
              alt="Van Hire Cricklewood - Success Van Hire modern fleet of vans in Cricklewood"
              fill
              className="object-cover"
              priority
            />
           
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40 lg:-mt-48 relative z-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              {/* Left Column */}
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fe9a00]/10 border border-[#fe9a00]/30 mb-4">
                    <FiMapPin className="text-[#fe9a00] text-sm" />
                    <span className="text-[#fe9a00] font-bold text-xs sm:text-sm">CRICKLEWOOD </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
                    Cheap Van Hire in{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe9a00] via-orange-400 to-orange-500">
                      Cricklewood
                    </span>
                  </h1>
                </div>

                <div className="space-y-4">
                  <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                    Professional <strong className="text-white">van rental in Cricklewood</strong> with Success Van Hire at competitive rates. Ideal for house removals, furniture delivery, business logistics, and IKEA collections. Searching for <Link href="/van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">van hire London</Link>? We provide <Link href="/cheap-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">cheap van hire London</Link> without compromising quality.
                  </p>

                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    Conveniently positioned off the A406 near Brent Cross Shopping Centre, serving all NW London areas. From compact vans for local deliveries to <Link href="/luton-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">Luton van hire London</Link> for major moves, our fleet covers every requirement. Require <Link href="/removal-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">removal van hire London</Link>? We offer hourly, daily, weekly, and monthly <strong>Cricklewood van hire</strong> packages.
                  </p>

                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    As your local <strong>NW London van rental</strong> specialist, we maintain a modern fleet that's fully ULEZ and LEZ compliant. Every vehicle undergoes regular servicing and professional cleaning. Trust <strong>success van hire cricklewood</strong> for dependable, hassle-free van rental across North West London.
                  </p>
                </div>

                {/* Key Points */}
              
              </div>

              {/* Right Column - Use Cases */}
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-[#fe9a00]/20 to-transparent rounded-3xl blur-2xl"></div>
                <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-black text-white mb-6">
                    Perfect For:
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {useCases.map((useCase, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#fe9a00]/20 transition-all duration-300"
                      >
                        <div className="text-[#fe9a00]">{useCase.icon}</div>
                        <span className="text-white font-semibold text-sm">
                          {useCase.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-start gap-2">
                      <FiCheckCircle className="text-green-400 text-lg mt-0.5 shrink-0" />
                      <div>
                        <div className="text-green-300 font-bold mb-1">
                          Long & Short Term Available
                        </div>
                        <p className="text-green-200 text-sm">
                          Flexible rental periods to suit your schedule – hourly, daily, weekly, monthly.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
                 <div className="grid sm:grid-cols-2 gap-3 py-3">
                  <div className="flex items-center gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-[#fe9a00]/40 transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/20 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="text-[#fe9a00] text-lg" />
                    </div>
                    <span className="text-white text-sm sm:text-base font-bold">
                      Best Rates in Cricklewood
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

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:02030111198"
                    className="group px-8 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-base sm:text- shadow-2xl shadow-[#fe9a00]/30 hover:shadow-[#fe9a00]/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FiPhone className="text-xl group-hover:rotate-12 transition-transform" />
                    <span>Call: 020 3011 1198</span>
                  </a>
                  <Link
                    href="/reservation"
                    className="px-5 py-4 sm:py-5 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-base sm:text-sm hover:bg-white/20 hover:border-[#fe9a00]/50 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FiTruck className="text-xl" />
                    <span>View Fleet & Book Online</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Hire From Success Van Hire Section */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Why Hire From{" "}
                <span className="text-[#fe9a00]">Success Van Hire?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Your trusted partner for affordable van rental in Cricklewood
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    featuresRef.current[index] = el;
                  }}
                  className="group relative"
                >
                  <div
                    className={`h-full bg-linear-to-br ${feature.linear} backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#fe9a00]/30 transition-all duration-500 hover:scale-105`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.iconColor} mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-black text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Fleet Section - Van Listing */}
        <VanListingHome showHeader={true} gridCols={3} />

        {/* Customer Testimonials */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                What Our <span className="text-[#fe9a00]">Customers Say</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Real feedback from satisfied van hire customers in Cricklewood
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    testimonialRef.current[index] = el;
                  }}
                  className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-[#fe9a00]/30 transition-all duration-300"
                >
                  <div className="flex text-[#fe9a00] mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm italic mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{testimonial.name}</span>
                    <span className="text-gray-400 text-xs">{testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/reviews"
                className="inline-block text-[#fe9a00] hover:text-white transition-colors font-bold"
              >
                Read more reviews on Google →
              </Link>
            </div>
          </div>
        </section>

        {/* Areas We Serve Section */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Serving <span className="text-[#fe9a00]">Cricklewood</span> & Beyond
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                We cover all of NW London and surrounding areas
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {serviceAreas.map((area, index) => (
                <Link
                  key={index}
                  href={area.link}
                  ref={(el) => {
                    areaRef.current[index] = el;
                  }}
                  className={`group bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#fe9a00]/30 transition-all duration-300 hover:scale-105 text-center ${
                    area.featured ? "border-2 border-[#fe9a00]/30" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/20 flex items-center justify-center mx-auto mb-2">
                    <FiMapPin className="text-[#fe9a00]" />
                  </div>
                  <h4 className={`text-sm font-bold ${area.featured ? "text-[#fe9a00]" : "text-white"} group-hover:text-[#fe9a00] transition-colors`}>
                    {area.name}
                  </h4>
                </Link>
              ))}
            </div>

            <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center max-w-3xl mx-auto">
              <FiNavigation className="text-blue-400 text-3xl mx-auto mb-3" />
              <p className="text-gray-300">
                Our <strong>NW London van rental</strong> service extends across Cricklewood, Willesden, Hendon, Brent Cross, and all NW postcodes. Need a van in another area? Just ask – we offer delivery options and one-way rentals.
              </p>
            </div>
          </div>
        </section>

        {/* Google Rating Banner */}
        <section className="relative py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-linear-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <FiStar className="text-yellow-400 text-3xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="text-white font-black text-2xl mb-1">
                      High Star Google Rating
                    </div>
                    <p className="text-gray-400">
                      Trusted by customers across Cricklewood and NW London
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.google.co.uk/maps/place/Success+Van+Hire/@51.5697225,-0.2386674,17.48z/data=!4m16!1m9!3m8!1s0x48761b70e7890549:0x932c1c31b90d97!2sSuccess+Van+Hire!8m2!3d51.5675488!4d-0.2369702!9m1!1b1!16s%2Fg%2F11m7j0n771!3m5!1s0x48761b70e7890549:0x932c1c31b90d97!8m2!3d51.5675488!4d-0.2369702!16s%2Fg%2F11m7j0n771?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                >
                  <FiMapPin />
                  View Our Reviews
                  <FiExternalLink className="text-sm" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQComponent
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our van hire services in Cricklewood"
          faqs={faqData}
          showSearch={false}
          defaultOpen={0}
          accentColor="#fe9a00"
          backgroundColor="#0f172b"
        />

        {/* Contact CTA Section */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#fe9a00] to-orange-500 p-1">
              <div className="bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-3xl p-8 lg:p-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
                    Book Your Van Rental in Cricklewood Today
                  </h2>
                  <p className="text-gray-300 text-xl mb-8 leading-relaxed">
                    Get the best rates on <strong>van hire Cricklewood</strong>. Whether you need a van for a few hours or several weeks, we've got you covered! Choose Success Van Hire for reliable, affordable <strong>van rental Cricklewood London</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <a
                      href="tel:02030111198"
                      className="w-full sm:w-auto group px-8 py-5 rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-lg shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
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