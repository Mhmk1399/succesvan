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
} from "react-icons/fi";

import Link from "next/link";
import { features } from "@/lib/areas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VanRentalBrentCross() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const areasRef = useRef<(HTMLDivElement | null)[]>([]);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Animate features
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const serviceAreas = [
    { name: "Brent Cross", icon: "🏢", featured: true },
    { name: "Cricklewood", icon: "📍" },
    { name: "Hendon", icon: "📍" },
    { name: "Neasden", icon: "📍" },
    { name: "Willesden", icon: "📍" },
    { name: "Kingsbury", icon: "📍" },
    { name: "Golders Green", icon: "📍" },
    { name: "Wembley", icon: "📍" },
    { name: "NW London", icon: "🗺️" },
  ];

  const whyChooseUs = [
    "Premier van rental company in Brent Cross",
    "Wide range of vans for personal and commercial use",
    "Automatic and manual transmission options",
    "Free on-site car parking while you hire",
    "Fully insured vehicles with optional extras",
    "Friendly and knowledgeable support team",
    "Serving NW London and surrounding areas",
    "High Google Star Rating from satisfied customers",
  ];

  return (
    <div ref={sectionRef} className="relative w-full bg-[#0f172b] py-28">
      {" "}
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         
        <div className="absolute top-0 right-0 w-125 h-125 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      {/* Hero Section */}
      <section className="relative ">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left Column */}
            <div>
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 lg:mb-6 leading-tight">
                Van Rental in
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe9a00] to-orange-500">
                  Brent Cross, London
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 lg:mb-6 leading-relaxed">
                Premier van rental in Brent Cross and NW London. Automatic vans
                available!
              </p>

              {/* Key Points */}
              <div className="grid sm:grid-cols-2 gap-3 mb-4 lg:mb-6">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#fe9a00]/20 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-[#fe9a00] text-sm" />
                  </div>
                  <span className="text-white text-sm sm:text-base font-semibold">
                    Same Day Hire
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                    <FiStar className="text-green-400 text-sm" />
                  </div>
                  <span className="text-white text-sm sm:text-base font-semibold">
                    5★ Rating
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:02030111198"
                  className="group px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiPhone className="text-base group-hover:rotate-12 transition-transform" />
                  <span>Call Now</span>
                </a>
                <Link
                  href="/reservation"
                  className="px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm sm:text-base hover:bg-white/10 hover:border-[#fe9a00]/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiTruck className="text-base" />
                  <span>View Vehicles</span>
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
                      We Serve
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      NW London
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {serviceAreas.map((area, index) => (
                    <div
                      key={area.name}
                      ref={(el) => {
                        areasRef.current[index] = el;
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
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-300 text-xs sm:text-sm flex items-start gap-2">
                    <FiNavigation className="text-sm sm:text-lg mt-0.5 shrink-0" />
                    <span>Easy access to all NW London areas</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => {
                  featuresRef.current[index] = el;
                }}
                className="group relative"
              >
                <div
                  className={`h-full bg-linear-to-br ${feature.linear} backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:border-[#fe9a00]/30 transition-all duration-500 hover:scale-105`}
                >
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
      {/* Last Minute Bookings Section */}
      <section className="relative py-12 lg:py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-linear-to-r from-[#fe9a00]/40 to-gray-500/20 p-1">
            <div className="bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fe9a00]/20 border border-[#fe9a00]/30 text-[#fe9a00] text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                    <FiZap className="text-sm" />
                    <span>AVAILABLE NOW</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 lg:mb-6">
                    Last Minute Van Rental?
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 lg:mb-6 leading-relaxed">
                    Plans change unexpectedly. We offer convenient last minute
                    van rentals with instant availability.
                  </p>
                  <ul className="space-y-2 sm:space-y-3 mb-4 lg:mb-6">
                    <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                      </div>
                      <span>Business deliveries</span>
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                      </div>
                      <span>Emergency moves</span>
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                      </div>
                      <span>Same-day availability</span>
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <FiCheckCircle className="text-green-400 text-xs sm:text-sm" />
                      </div>
                      <span>Flexible periods</span>
                    </li>
                  </ul>
                  <a
                    href="tel:02030111198"
                    className="inline-flex items-center gap-2 px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FiPhone className="text-sm sm:text-lg" />
                    <span>Book Now</span>
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
                      100+
                    </div>
                    <div className="text-gray-300 text-xs sm:text-base font-semibold">
                      Vans
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-6 text-center">
                    <div className="text-2xl sm:text-4xl font-black text-[#fe9a00] mb-1 sm:mb-2">
                      5★
                    </div>
                    <div className="text-gray-300 text-xs sm:text-base font-semibold">
                      Rating
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
      {/* Why Choose Us Section */}
      <section className="relative py-12 lg:py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 lg:mb-6">
                Reliable and Affordable{" "}
                <span className="text-[#fe9a00]">Van Rental</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 lg:mb-6 leading-relaxed">
                Top-notch service at competitive rates with a wide range of
                vans.
              </p>

              <div className="space-y-2 sm:space-y-3">
                {whyChooseUs.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#fe9a00]/20 transition-all duration-300"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-linear-to-br from-[#fe9a00] to-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <FiCheckCircle className="text-white text-xs sm:text-sm" />
                    </div>
                    <span className="text-white text-sm sm:text-base font-semibold">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-[#fe9a00]/20 to-transparent rounded-2xl lg:rounded-3xl blur-2xl"></div>
              <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-8">
                <h3 className="text-lg sm:text-2xl font-black text-white mb-4 sm:mb-6">
                  Our Van Types
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                      <FiTruck className="text-blue-400 text-base sm:text-xl" />
                    </div>
                    <div>
                      <div className="text-white text-sm sm:text-base font-bold">
                        Compact Vans
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm">
                        Personal use
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#fe9a00]/20 flex items-center justify-center shrink-0">
                      <FiTruck className="text-[#fe9a00] text-base sm:text-xl" />
                    </div>
                    <div>
                      <div className="text-white text-sm sm:text-base font-bold">
                        Medium (Automatic)
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm">
                        Smooth driving
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                      <FiTruck className="text-green-400 text-base sm:text-xl" />
                    </div>
                    <div>
                      <div className="text-white text-sm sm:text-base font-bold">
                        Large Vans
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm">
                        Commercial
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                      <FiTruck className="text-purple-400 text-base sm:text-xl" />
                    </div>
                    <div>
                      <div className="text-white text-sm sm:text-base font-bold">
                        Specialist
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm">
                        Luton, tipper
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <Link
                    href="/reservation"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-sm sm:text-base hover:scale-105 transition-all duration-300"
                  >
                    <span>View Vehicles</span>
                    <FiExternalLink className="text-sm" />
                  </Link>
                </div>
              </div>
            </div>
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
                See what our customers say!
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
                  Contact Success Van Hire for reliable van rental in Brent
                  Cross. Our team is ready to assist!
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
                    <span>Book Now</span>
                  </Link>
                </div>

                <div className="grid sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400 text-sm" />
                    <span>Instant Booking</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400 text-sm" />
                    <span>Best Prices</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400 text-sm" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
