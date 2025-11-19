"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiDollarSign,
  FiShield,
  FiClock,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { MdSupportAgent } from "react-icons/md";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const whyUsData = [
  {
    id: 1,
    icon: FiDollarSign,
    title: "Our Prices",
    shortDesc: "Best value for money",
    description:
      "Wide range of prices to fit every budget. Transparent pricing with no hidden charges.",
    color: "#fe9a00",
  },
  {
    id: 2,
    icon: FiTruck,
    title: "Expert in Work",
    shortDesc: "10+ years of experience",
    description:
      "Specialists in long-term and short-term business van rental with 50+ modern vehicles.",
    color: "#fe9a00",
  },
  {
    id: 3,
    icon: FiClock,
    title: "24/7 Availability",
    shortDesc: "Always here for you",
    description:
      "Book anytime, pickup anytime. Round-the-clock support for all your needs.",
    color: "#fe9a00",
  },
  {
    id: 4,
    icon: FiShield,
    title: "Best Guarantee",
    shortDesc: "100% secure booking",
    description:
      "Your rental reservation is fully guaranteed with comprehensive insurance coverage.",
    color: "#fe9a00",
  },
  {
    id: 5,
    icon: MdSupportAgent,
    title: "UK/EU Licenses",
    shortDesc: "Easy verification",
    description:
      "We accept full UK and EU driving licences with quick verification process.",
    color: "#fe9a00",
  },
  {
    id: 6,
    icon: FiMapPin,
    title: "Clean Air Standard",
    shortDesc: "Eco-friendly fleet",
    description:
      "All our vans meet EU6 emission standards. Committed to environmental protection.",
    color: "#fe9a00",
  },
];

export default function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".why-us-header",
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

      // Cards stagger animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.15,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-20   overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Replace with your actual image */}
        <div className="absolute inset-0 bg-[#0f172b]">
          {/* Placeholder for background image */}
          <div className="absolute inset-0 opacity-50">
            <Image
              src="/assets/images/van.png"
              alt="Van Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0f172b]/95 via-[#0f172b]/80 to-[#0f172b]/95"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#fe9a00]/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#fe9a00]/20 rounded-full blur-3xl animate-pulse-slower"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="why-us-header text-center mb-16 lg:mb-24">
          <h2 className="text-2xl   lg:text-7xl   font-black text-white mb-6 leading-tight">
            Your Trusted Partner for
            <br />
            <span
              className="bg-linear-to-r from-[#fe9a00] via-[#ff8800] to-[#fe9a00] bg-clip-text text-transparent animate-gradient"
              style={{
                backgroundSize: "200% auto",
              }}
            >
              Van Hire in London
            </span>
          </h2>

          <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            We combine reliability, affordability, and exceptional service to
            make your van rental experience seamless
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {whyUsData.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              className="group"
            >
              <WhyUsCard item={item} isActive={activeCard === index} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div
            className="inline-block p-8 lg:p-12 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(254, 154, 0, 0.1), rgba(15, 23, 43, 0.5))",
            }}
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Book your van today and experience the Success Van Hire difference
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/reservation"
                className="group/btn relative px-10 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #fe9a00, #d97900)",
                  boxShadow: "0 20px 60px rgba(254, 154, 0, 0.4)",
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Reserve Your Van
                  <FiArrowRight className="text-2xl group-hover/btn:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              </a>
              <a
                href="tel:+442030111198"
                className="px-10 py-5 rounded-2xl font-bold text-lg text-white border-2 border-[#fe9a00]/50 hover:bg-[#fe9a00]/10 transition-all duration-300"
              >
                Call: +44 20 3011 1198
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

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

function WhyUsCard({ item, isActive }: { item: any; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <div className="relative h-full group/card">
      {/* Glow Effect */}
      <div
        className={`absolute -inset-1 rounded-3xl transition-opacity duration-500 blur-xl ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `radial-gradient(circle at center, ${item.color}60, transparent 70%)`,
        }}
      ></div>

      {/* Card */}
      <div
        className={`relative h-full rounded-3xl backdrop-blur-2xl border transition-all duration-500 overflow-hidden ${
          isActive ? "scale-105 border-[#fe9a00]/60" : "border-white/10"
        }`}
        style={{
          background: isActive
            ? "rgba(254, 154, 0, 0.08)"
            : "rgba(255, 255, 255, 0.03)",
        }}
      >
        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>

        {/* Content */}
        <div className="relative p-8 lg:p-10">
          {/* Icon Container */}
          <div className="mb-8 relative">
            <div
              className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-linear-to-br from-[#fe9a00] to-[#d97900] flex items-center justify-center shadow-2xl transition-all duration-500 ${
                isActive ? "scale-110 rotate-6" : "group-hover/card:scale-105"
              }`}
              style={{
                boxShadow: isActive
                  ? `0 20px 60px ${item.color}60`
                  : `0 10px 40px ${item.color}40`,
              }}
            >
              <Icon className="text-2xl lg:text-3xl text-white" />
            </div>

            {/* Floating Dot */}
            <div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#fe9a00] flex items-center justify-center"
              style={{
                boxShadow: "0 0 20px rgba(254, 154, 0, 0.8)",
              }}
            >
              <FiCheckCircle className="text-white text-sm" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg lg:text-2xl font-black text-white mb-3 leading-tight">
            {item.title}
          </h3>

          {/* Short Description */}
          <p className="text-[#fe9a00] text-sm font-bold mb-4">
            {item.shortDesc}
          </p>

          {/* Divider */}
          <div
            className="h-px mb-6 rounded-full transition-all duration-500"
            style={{
              background: isActive
                ? `linear-gradient(90deg, ${item.color}, transparent)`
                : "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)",
            }}
          ></div>

          {/* Description */}
          <p className="text-gray-300 text-sm  leading-relaxed mb-6">
            {item.description}
          </p>
        </div>

        {/* Decorative Corner */}
        <div
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-0 group-hover/card:opacity-30 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${item.color}, transparent)`,
          }}
        ></div>
      </div>
    </div>
  );
}
