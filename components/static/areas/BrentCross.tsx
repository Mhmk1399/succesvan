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
  FiZap,
  FiNavigation,
  FiExternalLink,
  FiClock,
  FiDollarSign,
  FiShield,
  FiCalendar,
  FiPackage,
  FiHelpCircle,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import VanListingHome from "@/components/global/vanListing.backup";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VanRentalBrentCross() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const areasRef = useRef<(HTMLElement | null)[]>([]);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const fleetRef = useRef<(HTMLDivElement | null)[]>([]);
  const testimonialRef = useRef<(HTMLDivElement | null)[]>([]);
const faqRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate service areas
      areasRef.current.forEach((area, index) => {
        if (!area) return;
        gsap.fromTo(
          area,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
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

      // Animate features (why choose us cards)
      featuresRef.current.forEach((feature, index) => {
        if (!feature) return;
        gsap.fromTo(
          feature,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
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
      // Animate fleet items
      fleetRef.current.forEach((item, index) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
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
     // Animate FAQ items
      faqRef.current.forEach((item, index) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Enhanced Why Choose Us data (cards)
  const whyChooseUs = [
    {
      icon: <FiDollarSign className="text-3xl" />,
      title: "Competitive Pricing",
      description:
        "We offer some of the most affordable van hire Brent Cross rates, ensuring you get the best value for your van rental. Our transparent pricing means no hidden fees – just honest, competitive rates for quality van hire Brent Cross London services. Whether you need short-term or long-term van rental Brent Cross London, we guarantee the best prices in the area.",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiTruck className="text-3xl" />,
      title: "Wide Range of Vans",
      description:
        "From compact vans for small loads to larger Luton vans for full home removals, we have the right vehicle for your needs. Our fleet includes small, medium, large vans, and Luton vans with tail lifts – all regularly serviced and maintained. Whether you need automatic or manual, we've got you covered for last minute van booking in Brent Cross.",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "Flexible Rental Periods",
      description:
        "Need a van for a few hours, a day, a week, or longer? Our flexible van hire Brent Cross options accommodate your schedule. We offer customisable rental periods for both personal and commercial use. Book your removal van hire or cheap van hire London with flexible pickup and drop-off times – including last-minute availability.",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "No Hidden Fees",
      description:
        "Transparency is key. The price you see is the price you pay – no hidden charges, no unexpected fees. Our cheap van hire London pricing includes comprehensive insurance options, and we clearly explain all costs upfront. This honest approach to van hire Brent Cross has earned us a reputation as the most trustworthy van rental company in NW London.",
      iconColor: "text-[#fe9a00]",
    },
  ];



  // Testimonials
  const testimonials = [
    {
      name: "Michael T.",
      rating: 5,
      text: "I needed a van last minute for an emergency move in Brent Cross. Success Van Hire had me on the road within an hour. The van was clean, and the staff were incredibly helpful. Highly recommend their last minute van booking service!",
      location: "Brent Cross",
    },
    {
      name: "Priya K.",
      rating: 5,
      text: "Great experience with Success Van Hire. Rented a medium automatic van for a day. Easy booking, fair prices, and the van drove beautifully. Will definitely use again for van rental Brent Cross London.",
      location: "Cricklewood",
    },
    {
      name: "David R.",
      rating: 5,
      text: "As a contractor, I rely on Success Van Hire for reliable vehicles. Their Brent Cross branch always has vans ready, and the team is professional. The best van hire Brent Cross company around.",
      location: "Neasden",
    },
  ];
// FAQs
  const faqs = [
    {
      question: "How do I make a last minute van booking in Brent Cross?",
      answer: "Simply call us on 020 3011 1198 or use our online booking form. We keep a selection of vans available for same-day hire, so you can usually get a vehicle within hours. Just let us know your requirements, and we'll have you on the road quickly.",
    },
    {
      question: "What types of vans do you offer in Brent Cross?",
      answer: "We offer a wide range including small vans, medium vans (automatic/manual), large vans, and Luton vans with tail lifts. All are ULEZ compliant and regularly maintained. Whether you need a van for moving, deliveries, or business, we have the right vehicle.",
    },
    {
      question: "Do you offer automatic transmission vans?",
      answer: "Yes, we have a selection of automatic vans available. They're perfect for drivers who prefer easier city driving. Just specify when booking, and we'll do our best to accommodate.",
    },
    {
      question: "What are your rental requirements?",
      answer: "You need a full valid driving licence (UK or international), a valid debit/credit card for deposit, and be at least 21 years old. For drivers under 25, a young driver surcharge may apply. We accept most personal insurance policies.",
    },
    {
      question: "Can I hire a van for just a few hours?",
      answer: "Absolutely! We offer flexible rental periods, from hourly to daily, weekly, or monthly. Hourly hire is perfect for quick moves or deliveries. Contact us for current rates.",
    },
    {
      question: "Do you serve areas beyond Brent Cross?",
      answer: "Yes, we serve all of NW London including Cricklewood, Hendon, Golders Green, Wembley, and beyond. We also offer one-way rentals to other parts of London. Just ask when booking.",
    },
  ];

 
  const serviceAreas = [
    { name: "Brent Cross", icon: "🏢", featured: true, link: "/van-hire-brent-cross" },
    { name: "Cricklewood", icon: "📍", link: "/van-hire-cricklewood" },
    { name: "Hendon", icon: "📍", link: "/van-hire-hendon" },
    { name: "Neasden", icon: "📍", link: "/van-hire-neasden" },
    { name: "Willesden", icon: "📍", link: "/van-hire-willesden" },
    { name: "Kingsbury", icon: "📍", link: "/van-hire-kingsbury" },
    { name: "Golders Green", icon: "📍", link: "/van-hire-golders-green" },
    { name: "Wembley", icon: "📍", link: "/van-hire-wembley" },
    { name: "NW London", icon: "🗺️", link: "/van-hire-london" },
  ];

  return (
    <>
      <Head>
        <title>Van Hire Brent Cross | Success Van Hire - Last Minute Van Rental London</title>
        <meta
          name="description"
          content="Need van hire in Brent Cross? Success Van Hire offers affordable van rental Brent Cross London, including last minute van booking. Choose from small vans, Luton vans, automatics. No hidden fees, 5-star service. Book online or call now!"
        />
        <meta
          name="keywords"
          content="van hire brent cross, van rental brent cross london, last minute van booking, brent cross van hire, success van hire brent cross, cheap van hire london, removal van hire london"
        />
        <link rel="canonical" href="https://www.successvanhire.com/van-hire-brent-cross" />
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
              src="/assets/images/brent cross van hire.jpg"
              alt="Van Hire Brent Cross - Success Van Hire fleet of modern vans"
              fill
              className="object-cover"
              priority
            />
       
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-32 sm:-mt-40 lg:-mt-48 relative z-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              {/* Left Column */}
              <div className="space-y-6 lg:space-y-8">

                {/* Heading */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fe9a00]/10 border border-[#fe9a00]/30 mb-4">
                    <FiMapPin className="text-[#fe9a00] text-sm" />
                    <span className="text-[#fe9a00] font-bold text-xs sm:text-sm">BRENT CROSS</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
                    Van Rental in{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe9a00] via-orange-400 to-orange-500">
                      Brent Cross
                    </span>
                  </h1>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                    Premier <strong className="text-white">van hire Brent Cross</strong> and NW London. Looking for affordable <Link href="/van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">van hire London</Link>? Our <Link href="/cheap-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">cheap van hire London</Link> services offer exceptional value. Whether you need <Link href="/removal-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">removal van hire London</Link> or <Link href="/luton-van-hire-london" className="text-[#fe9a00] hover:underline font-semibold">Luton van hire London</Link>, we have automatic vans available!
                  </p>

                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    Need a vehicle urgently? We specialise in <strong className="text-white">last minute van booking</strong> in Brent Cross. As a locally trusted company, Success Van Hire provides reliable van rental for personal and commercial use with ULEZ-compliant vans, flexible periods, and transparent pricing.
                  </p>
                </div>

                {/* Key Points */}
               

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <a
                    href="tel:02030111198"
                    className="group px-6 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-base sm:text-lg shadow-2xl shadow-[#fe9a00]/30 hover:shadow-[#fe9a00]/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FiPhone className="text-xl group-hover:rotate-12 transition-transform" />
                    <span>Call: 020 3011 1198</span>
                  </a>
                  <Link
                    href="/reservation"
                    className="px-[43px] py-4 sm:py-5 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-base  hover:bg-white/20 hover:border-[#fe9a00]/50 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FiTruck className="text-2xl" />
                    <span className="text-xl">Book Online</span>
                  </Link>
                </div>
              </div>

              {/* Right Column - Service Areas Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-[#fe9a00]/20 to-transparent rounded-2xl lg:rounded-3xl blur-2xl"></div>
                <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#fe9a00]/20 flex items-center justify-center">
                      <FiMapPin className="text-[#fe9a00] text-lg sm:text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-black text-white">
                        Areas We Serve
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        NW London & beyond
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {serviceAreas.map((area, index) => (
                      <Link
                        key={area.name}
                        href={area.link}
                        ref={(el) => {
                          areasRef.current[index] = el as HTMLElement | null;
                        }}
                        className={`flex items-center gap-1.5 p-2 sm:p-3 rounded-lg transition-all duration-300 text-xs sm:text-sm ${
                          area.featured
                            ? "bg-linear-to-r from-[#fe9a00]/20 to-orange-500/20 border-2 border-[#fe9a00]/30"
                            : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#fe9a00]/20"
                        }`}
                      >
                        <span className="text-lg sm:text-2xl">{area.icon}</span>
                        <span
                          className={`font-semibold ${
                            area.featured ? "text-[#fe9a00]" : "text-white"
                          }`}
                        >
                          {area.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-blue-300 text-xs sm:text-sm flex items-start gap-2">
                      <FiNavigation className="text-sm sm:text-lg mt-0.5 shrink-0" />
                      <span>Easy access to all NW London areas – just off A41, M1, and North Circular</span>
                    </p>
                  </div>
                </div>
                 <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  <div className="flex items-center gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-[#fe9a00]/40 transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/20 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="text-[#fe9a00] text-lg" />
                    </div>
                    <span className="text-white text-sm sm:text-base font-bold">
                      Same Day Hire
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-green-400/40 transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                      <FiStar className="text-green-400 text-lg" />
                    </div>
                    <span className="text-white text-sm sm:text-base font-bold">
                      5★ Google Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section (Cards) */}
        <section className="relative py-12 lg:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-2 lg:mb-4">
                Why Choose{" "}
                <span className="text-[#fe9a00]">Success Van Hire?</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                Your trusted partner for van rental in Brent Cross
              </p>
            </div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-16">
              {whyChooseUs.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    featuresRef.current[index] = el;
                  }}
                  className="group relative"
                >
                  <div className="h-full bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:border-[#fe9a00]/30 transition-all duration-500 hover:scale-105">
                    <div
                      className={`w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.iconColor} mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Fleet Section - Van Listing */}
        <VanListingHome showHeader={false} gridCols={3} />

        {/* Last Minute Bookings Section */}
        <section className="relative py-12 lg:py-5 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-linear-to-r from-[#fe9a00]/40 to-gray-500/20 p-1">
              <div className="bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fe9a00]/20 border border-[#fe9a00]/30 text-[#fe9a00] text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                      <FiZap className="text-sm" />
                      <span>LAST MINUTE AVAILABILITY</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 lg:mb-6">
                      Need a Van Urgently? We've Got You Covered!
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 lg:mb-6 leading-relaxed">
                      Plans change unexpectedly. That's why we keep a selection of vans ready for <strong>last minute van booking in Brent Cross</strong>. Whether it's an emergency move, sudden delivery, or your regular vehicle broke down, we can have you on the road quickly. Just give us a call or book online – we offer same-day hire with minimal paperwork.
                    </p>
                    <ul className="space-y-2 sm:space-y-3 mb-4 lg:mb-6">
                      <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                        </div>
                        <span>Business deliveries – urgent stock transport</span>
                      </li>
                      <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                        </div>
                        <span>Emergency house moves – when things change last minute</span>
                      </li>
                      <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                        </div>
                        <span>Same-day availability – just call before 4pm</span>
                      </li>
                      <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                        </div>
                        <span>Flexible periods – hourly, daily, or weekly</span>
                      </li>
                    </ul>
                    <a
                      href="tel:02030111198"
                      className="inline-flex items-center gap-2 px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <FiPhone className="text-sm sm:text-lg" />
                      <span>Call for Last Minute Booking</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-6 text-center">
                      <div className="text-2xl sm:text-4xl font-black text-[#fe9a00] mb-1 sm:mb-2">
                        24/7
                      </div>
                      <div className="text-gray-300 text-xs sm:text-base font-semibold">
                        Support
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-6 text-center">
                      <div className="text-2xl sm:text-4xl font-black text-[#fe9a00] mb-1 sm:mb-2">
                        50+
                      </div>
                      <div className="text-gray-300 text-xs sm:text-base font-semibold">
                        Vans in Fleet
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-6 text-center">
                      <div className="text-2xl sm:text-4xl font-black text-[#fe9a00] mb-1 sm:mb-2">
                        5★
                      </div>
                      <div className="text-gray-300 text-xs sm:text-base font-semibold">
                        Google Rating
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-6 text-center">
                      <div className="text-2xl sm:text-4xl font-black text-[#fe9a00] mb-1 sm:mb-2">
                        £45+
                      </div>
                      <div className="text-gray-300 text-xs sm:text-base font-semibold">
                        Per Day
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials (New) */}
        <section className="relative py-12 lg:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4">
                What Our <span className="text-[#fe9a00]">Customers Say</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                Real feedback from satisfied van hire customers in Brent Cross
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    testimonialRef.current[index] = el;
                  }}
                  className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 sm:p-6 hover:border-[#fe9a00]/30 transition-all duration-300"
                >
                  <div className="flex text-[#fe9a00] mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="fill-current text-sm sm:text-base" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm italic mb-3">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm">{testimonial.name}</span>
                    <span className="text-gray-400 text-xs">{testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/reviews"
                className="inline-block text-[#fe9a00] hover:text-white transition-colors font-bold text-sm"
              >
                Read more reviews on Google →
              </Link>
            </div>
          </div>
        </section>
        {/* Frequently Asked Questions (New) */}
        <section className="relative py-12 lg:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4">
                Frequently Asked <span className="text-[#fe9a00]">Questions</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                Everything you need to know about van hire in Brent Cross
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    faqRef.current[index] = el;
                  }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 hover:border-[#fe9a00]/30 transition-all duration-300"
                >
                  <h3 className="text-sm sm:text-base font-black text-white mb-2 flex items-start gap-2">
                    <FiHelpCircle className="text-[#fe9a00] mt-0.5 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-gray-400 text-sm">
                Still have questions? <Link href="/contact" className="text-[#fe9a00] hover:underline">Get in touch</Link> – we're happy to help!
              </p>
            </div>
          </div>
        </section>



        {/* Google Rating Section */}
        <section className="relative py-10 lg:py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-12">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                  <FiStar className="text-sm" />
                  <span>HIGHLY RATED</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 lg:mb-4">
                  Trusted Across <span className="text-[#fe9a00]">NW London</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                  See what our customers say about our Brent Cross van hire service!
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className="text-yellow-400 text-xl sm:text-3xl fill-yellow-400"
                    />
                  ))}
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 sm:mb-2">
                  5.0
                </div>
                <div className="text-gray-400 text-sm sm:text-lg mb-4 sm:mb-6">
                  Google Rating
                </div>
                <a
                  href="https://www.google.co.uk/maps/place/Success+Van+Hire/@51.5697225,-0.2386674,17z/data=!4m16!1m9!3m8!1s0x48761b70e7890549:0x932c1c31b90d97!2sSuccess+Van+Hire!8m2!3d51.5675488!4d-0.2369702!9m1!1b1!16s%2Fg%2F11m7j0n771!3m5!1s0x48761b70e7890549:0x932c1c31b90d97!8m2!3d51.5675488!4d-0.2369702!16s%2Fg%2F11m7j0n771?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm sm:text-base hover:bg-white/10 hover:border-[#fe9a00]/30 transition-all duration-300"
                >
                  <FiMapPin className="text-sm sm:text-lg" />
                  <span>View Reviews</span>
                  <FiExternalLink className="text-xs sm:text-sm" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="relative py-12 lg:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-linear-to-r from-[#fe9a00] to-orange-500 p-1">
              <div className="bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-3 lg:mb-6">
                    Don't Let Last-Minute Needs Stress You
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-xl mb-4 lg:mb-8 leading-relaxed">
                    Contact <strong>Success Van Hire</strong> for reliable <strong>van rental in Brent Cross</strong>. Our team is ready to assist with last-minute bookings, fleet advice, and the best rates. Call now or book online!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 lg:mb-8">
                    <a
                      href="tel:02030111198"
                      className="w-full sm:w-auto group px-6 py-3 sm:py-5 rounded-lg sm:rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
                    >
                      <FiPhone className="text-base sm:text-xl lg:text-2xl group-hover:rotate-12 transition-transform" />
                      <div className="text-left">
                        <div className="text-xs text-white/80">Call now</div>
                        <div className="font-black">020 3011 1198</div>
                      </div>
                    </a>
                    <Link
                      href="/reservation"
                      className="w-full sm:w-auto px-6 py-3 sm:py-5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm sm:text-base lg:text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FiTruck className="text-base sm:text-xl" />
                      <span>Book Online Now</span>
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-400">
                      <FiCheckCircle className="text-green-400 text-sm" />
                      <span>Instant Booking</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-400">
                      <FiCheckCircle className="text-green-400 text-sm" />
                      <span>Best Prices Guaranteed</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-400">
                      <FiCheckCircle className="text-green-400 text-sm" />
                      <span>24/7 Customer Support</span>
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