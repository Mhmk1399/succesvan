"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiShield,
  FiTruck,
  FiGlobe,
  FiCheckCircle,
  FiArrowRight,
  FiPhone,
} from "react-icons/fi";
import { FaPoundSign, FaLeaf } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const whyChooseUsData = [
  {
    id: 1,
    icon: FiTruck,
    title: "Expert in Work",
    shortDesc: "Long & short-term rentals",
    description:
      "We are expert in long-term and short-term business van rental with a modern fleet of over 50 vehicles.",
    color: "#fe9a00",
  },
  {
    id: 2,
    icon: FiGlobe,
    title: "Licenses",
    shortDesc: "UK & EU accepted",
    description:
      "We do accept full UK and EU driving licences with a fast and simple verification process.",
    color: "#fe9a00",
  },
  {
    id: 3,
    icon: FiShield,
    title: "Best Guarantee",
    shortDesc: "100% secure booking",
    description:
      "The rental reservation you make with us is 100% guaranteed with full insurance coverage.",
    color: "#fe9a00",
  },
  {
    id: 4,
    icon: FaPoundSign,
    title: "Our Prices",
    shortDesc: "Fit every budget",
    description:
      "The vans we offer have a wide range of prices, and we have vans that fit every budget. No hidden fees.",
    color: "#fe9a00",
  },
  {
    id: 5,
    icon: FaLeaf,
    title: "Clean Air Standard",
    shortDesc: "Eco-friendly fleet",
    description:
      "As part of our commitment to the environment, all our vans meet EU6 emission standards.",
    color: "#fe9a00",
  },
  {
    id: 6,
    icon: MdSupportAgent,
    title: "Easy Service Delivery",
    shortDesc: "Friendly & professional",
    description:
      "In addition to providing full business insurance to B2B clients, we provide very friendly and easy service.",
    color: "#fe9a00",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards animation - stagger
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 80,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: {
            amount: 0.6,
            from: "start",
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-[#0f172b]"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-20">
          <h2
            ref={titleRef}
            className="text-3xl   md:text-6xl  font-black text-white md:leading-tight"
          >
            Why Choose
            <span className="block mt-2">
              <span className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent animate-shimmer">
                Success Van Hire
              </span>
            </span>
          </h2>
          <p className="mt-2 text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Trusted by thousands of businesses and individuals across London for
            reliable, affordable, and hassle-free van rental.
          </p>
        </div>

        {/* Cards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {whyChooseUsData.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative"
            >
              <WhyChooseUsCard item={item} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 lg:mt-28 text-center">
          <div className="inline-block p-8 lg:p-12 rounded-3xl bg-linear-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-xl border border-amber-500/20 shadow-2xl">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to Hire Your Van?
            </h3>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Get instant booking and the best rates in London
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/reservation"
                className="group relative px-10 py-5 bg-linear-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-amber-500/50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Book Now
                  <FiArrowRight className="text-2xl group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <a
                href="tel:+442030111198"
                className="flex items-center gap-3 px-10 py-5 border-2 border-amber-500/50 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:bg-amber-500/10"
              >
                <FiPhone className="text-xl" />
                +44 20 3011 1198
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes shimmer {
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
        .animate-shimmer {
          animation: shimmer 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}

function WhyChooseUsCard({ item }: { item: any }) {
  const Icon = item.icon;

  return (
    <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-amber-500/40 group-hover:bg-white/8 group-hover:scale-105">
      {/* Hover glow */}
      <div className="absolute -inset-1 bg-linear-to-br from-amber-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      <div className="p-6 lg:p-8">
        {/* Icon */}
        <div className="mb-6 relative inline-block">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="text-3xl lg:text-4xl text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
            <FiCheckCircle className="text-white text-lg" />
          </div>
        </div>

        {/* Title & Short Desc */}
        <h3 className="text-xl lg:text-2xl font-black text-white mb-2">
          {item.title}
        </h3>
        <p className="text-amber-400 font-bold text-sm lg:text-base mb-4">
          {item.shortDesc}
        </p>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-amber-500/50 to-transparent mb-6" />

        {/* Description */}
        <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}
