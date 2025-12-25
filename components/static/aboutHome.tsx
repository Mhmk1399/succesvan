"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FiTruck, FiCheck } from "react-icons/fi";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const vanRanges = [
  {
    icon: FiTruck,
    title: "Small Vans",
    description: "Compact & efficient for light deliveries",
    features: ["Easy parking", "Low fuel costs", "Perfect for couriers"],
  },
  {
    icon: FiTruck,
    title: "Medium Vans",
    description: "Versatile solution for most requirements",
    features: ["Ample cargo space", "Comfortable seating", "Best value"],
  },
  {
    icon: FiTruck,
    title: "Large Vans",
    description: "Heavy-duty for major relocations",
    features: [
      "Maximum load capacity",
      "Tail lift option",
      "Professional grade",
    ],
  },
  {
    icon: FiTruck,
    title: "Luton Vans",
    description: "Premium choice for house moves",
    features: ["Largest capacity", "Tail lift included", "Climate controlled"],
  },
];

export default function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".about-header",
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            once: true,
          },
        }
      );

      // Stats animation
      gsap.utils.toArray(".stat-card").forEach((card: any, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.8, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });

      // Content sections
      gsap.utils.toArray(".about-section").forEach((section: any) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0f172b] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#fe9a00]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#fe9a00]/20 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-20 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="about-header text-center mb-16">
              <h1 className="text-2xl   lg:text-7xl  font-black text-white mb-6 leading-tight">
                What Do You Know
                <br />
                <span className="text-[#fe9a00]">About Us?</span>
              </h1>

              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-gray-300 text-base sm:text-2xl leading-relaxed">
                  <span className="text-[#fe9a00] font-bold">
                    London's trusted van rental specialist
                  </span>{" "}
                  for over 15 years
                </p>

                <p className="text-gray-200 text-base sm:text-2xl  leading-relaxed">
                  We provide{" "}
                  <span className="text-white font-semibold">
                    reliable, affordable van rentals
                  </span>{" "}
                  with a modern fleet of{" "}
                  <span className="text-[#fe9a00] font-bold">50+ vehicles</span>
                  , all maintained to the highest standards.
                </p>

                <p className="text-gray-200 text-base sm:text-2xl  leading-relaxed">
                  From small deliveries to house moves, we offer{" "}
                  <span className="text-white font-semibold">
                    flexible solutions
                  </span>{" "}
                  with transparent pricing and exceptional customer service.
                </p>

                <div className="pt-6">
                  <div className="inline-block p-6 rounded-2xl bg-linear-to-r from-[#fe9a00]/20 to-[#fe9a00]/10 border border-[#fe9a00]/30 backdrop-blur-xl">
                    <p className="text-white text-sm sm:text-2xl font-bold leading-relaxed">
                      Self-drive with{" "}
                      <span className="text-[#fe9a00]">
                        complete peace of mind
                      </span>
                      . All vans fully insured and EU6 compliant.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Company Section */}
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="about-section text-center mb-16">
              <h2 className="text-2xl   lg:text-7xl  font-black text-white mb-4">
                Our Company
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
                Comprehensive van rental solutions for all your needs
              </p>
            </div>

            {/* Van Ranges */}
            <div className="about-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {vanRanges.map((range, index) => {
                const Icon = range.icon;
                return (
                  <div key={index} className="group">
                    <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#fe9a00]/50 transition-all duration-300 hover:scale-105">
                      <Icon className="text-4xl text-[#fe9a00] mb-4" />
                      <h3 className="text-xl font-black text-white mb-2">
                        {range.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {range.description}
                      </p>
                      <div className="space-y-2">
                        {range.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <FiCheck className="text-[#fe9a00]  shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className=" pb-20  ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xl sm:text-3xl font-black text-white mb-4">
              Ready to Rent Your Van?
            </h3>
            <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto">
              Experience the Success Van Hire difference today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={"/reservation"}
                className="md:px-10 md:py-5 px-7 py-3 rounded-2xl font-bold text-lg text-white bg-linear-to-r from-[#fe9a00] to-[#d97900] hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.15);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
