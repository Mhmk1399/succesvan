"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiCheckCircle,
  FiUsers,
  FiTruck,
  FiAward,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { MdOutlineLocalParking } from "react-icons/md";
import { TbAutomaticGearbox } from "react-icons/tb";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SuccessVanHire() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const benefitsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate feature cards
      featuresRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });

      // Animate benefit items
      benefitsRef.current.forEach((item, index) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
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

  const features = [
    {
      icon: <FiTruck className="text-4xl" />,
      title: "All Types of Vans Available",
      description:
        "From compact city vans to spacious long-wheelbase models, we offer the right van for every job. Whether it's a quick move or a full-day project, you'll find a vehicle that fits your needs.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <TbAutomaticGearbox className="text-4xl" />,
      title: "Automatic Vans for Stress-Free Driving",
      description:
        "Prefer an automatic? Our fleet includes a selection of modern automatic vans, giving you a smooth and easy driving experience—perfect for both new and seasoned drivers.",
      linear: "from-[#fe9a00]/20 to-orange-500/20",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiUsers className="text-4xl" />,
      title: "Minibus Hire for Group Travel",
      description:
        "Planning a trip with family, friends, or colleagues? Our comfortable minibuses are ideal for group travel, events, airport transfers, and more. Available in a range of sizes.",
      linear: "from-[#fe9a00]/20 to-orange-500/20",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <MdOutlineLocalParking className="text-4xl" />,
      title: "Free Parking for Your Car",
      description:
        "Hiring a van or minibus? Leave your car with us at no extra cost. We offer free, secure parking for the duration of your hire, giving you one less thing to worry about.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
  ];

  const benefits = [
    "Clean, modern, and well-maintained vehicles",
    "Competitive daily, weekly, and long-term hire rates",
    "Automatic and manual options",
    "Free on-site car parking while you hire",
    "Flexible pick-up and drop-off times",
    "Friendly and helpful support team",
    "Fully insured vehicles with optional extras",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0f172b] py-20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-30 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Reliable, Comfortable, and
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe9a00] to-orange-500">
              Affordable Van Hire
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Automatic Vans Available
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Looking for a dependable van hire service? We've got you covered.
            Whether you're moving house, transporting goods, or planning a group
            trip, our wide range of vans and minibuses is ready to meet your
            needs.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                featuresRef.current[index] = el;
              }}
              className="group relative"
            >
              <div
                className={`h-full bg-linear-to-br ${feature.linear} backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#fe9a00]/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#fe9a00]/10`}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#fe9a00] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="relative">
          {/* Background Card */}
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-3xl"></div>

          <div className="relative bg-linear-to-br from-[#1e293b] to-[#0f172b] border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Title & Description */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fe9a00]/10 border border-[#fe9a00]/20 text-[#fe9a00] text-sm font-bold mb-6">
                  <FiAward className="text-lg" />
                  <span>WHY CHOOSE US</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                  Your Trusted Partner for{" "}
                  <span className="text-[#fe9a00]">Vehicle Hire</span>
                </h2>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Book today and enjoy a hassle-free experience from start to
                  finish. We're committed to providing exceptional service and
                  quality vehicles for all your transportation needs.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button className="group px-8 py-4 rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <FiPhone className="text-lg group-hover:rotate-12 transition-transform" />
                    Book Now
                  </button>
                  <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-[#fe9a00]/30 transition-all duration-300 flex items-center gap-2">
                    <FiMail className="text-lg" />
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Right Column - Benefits List */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      benefitsRef.current[index] = el;
                    }}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#fe9a00]/30 transition-all duration-300"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-[#fe9a00] to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FiCheckCircle className="text-white text-lg" />
                    </div>
                    <p className="text-white font-semibold pt-1">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
