"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiStar,
  FiDollarSign,
  FiExternalLink,
  FiThumbsUp,
  FiAward,
  FiSettings,
} from "react-icons/fi";
import { TbAutomaticGearbox } from "react-icons/tb";
import Link from "next/link";
import { useCases } from "@/lib/areas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AutomaticVanHire() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const benefitsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate features
      featuresRef.current.forEach((feature, index) => {
        if (!feature) return;
        gsap.fromTo(
          feature,
          { opacity: 0, y: 50 },
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

      // Animate benefits
      benefitsRef.current.forEach((benefit, index) => {
        if (!benefit) return;
        gsap.fromTo(
          benefit,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: benefit,
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

  const whyChooseUs = [
    {
      icon: <TbAutomaticGearbox className="text-4xl" />,
      title: "Automatic Vans Only",
      description:
        "We exclusively offer a fleet of automatic vans, providing a seamless driving experience. Our vans are well-maintained, modern, and equipped with the latest features to ensure your comfort and safety on the road.",
      linear: "from-[#fe9a00]/5 to-orange-500/5",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiTruck className="text-4xl" />,
      title: "Extensive Fleet",
      description:
        "Diverse range of automatic vans to cater to your specific requirements. From compact vans for quick deliveries to spacious vans for house moves, we have the perfect fit for your transportation needs.",
      linear: "from-[#fe9a00]/5 to-orange-500/5",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiDollarSign className="text-4xl" />,
      title: "Competitive Pricing",
      description:
        "High-quality service accessible to everyone. We offer competitive pricing without compromising on vehicle quality or customer service, ensuring excellent value for your money.",
      linear: "from-[#fe9a00]/5 to-orange-500/5",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiMapPin className="text-4xl" />,
      title: "Convenient Locations",
      description:
        "Multiple locations across London for easy pick-up and drop-off. Strategically placed branches ensure hassle-free access whether you're in Central London or the outskirts.",
      linear: "from-[#fe9a00]/5 to-orange-500/5",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiClock className="text-4xl" />,
      title: "Flexible Rental Options",
      description:
        "Rental periods from a few hours to weeks or longer. Our friendly staff will help you choose the right duration that fits your plans and budget.",
      linear: "from-[#fe9a00]/5 to-orange-500/5",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiThumbsUp className="text-4xl" />,
      title: "Exceptional Customer Service",
      description:
        "Customer satisfaction is our top priority. Our dedicated team provides seamless support from inquiry to van return, ensuring a stress-free rental experience.",
      linear: "from-[#fe9a00]/5 to-orange-500/5",
      iconColor: "text-[#fe9a00]",
    },
  ];

  const benefits = [
    "Hassle-free automatic transmission - no clutch, no gear changes",
    "Perfect for new drivers and experienced professionals alike",
    "Reduced driver fatigue on long journeys",
    "Smooth acceleration and deceleration in city traffic",
    "Easy to drive in congested London streets",
    "Modern safety features and comfort equipment",
    "Well-maintained and regularly serviced vehicles",
    "Comprehensive insurance coverage included",
    "Fuel-efficient automatic transmission systems",
    "24/7 roadside assistance available",
  ];

  return (
    <div ref={sectionRef} className="relative w-full bg-[#0f172b]  py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-150 h-150 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-150 h-150 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-150 h-150 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Welcome to
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe9a00] to-orange-500">
                Success Van Hire
              </span>
            </h1>

            <h2 className="text-base sm:text-3xl lg:text-4xl font-bold text-gray-300 mb-8">
              Your Trusted Automatic Van Rental Company in London
            </h2>

            <p className="text-sm md:text-base text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed">
              Looking for a reliable van rental service in London? Look no
              further than Success Van Hire! We are a leading van rental company
              offering a fleet of automatic vans for all your transportation
              needs. Whether you're moving house, transporting goods, or going
              on a road trip, our automatic vans are perfect for hassle-free and
              convenient travel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <a
                href="tel:02030111198"
                className="group px-8 py-5 rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-lg shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <FiPhone className="text-2xl group-hover:rotate-12 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-white/80">
                    Reserve your automatic van
                  </div>
                  <div className="font-black text-xs md:text-base">Call 020 3011 1198</div>
                </div>
              </a>
              <Link
                href="/reservation"
                className="px-8 py-5 rounded-xl bg-white/5 border text-xs md:text-base border-white/10 text-white font-bold   hover:bg-white/10 hover:border-[#fe9a00]/30 transition-all duration-300 flex items-center gap-2"
              >
                <TbAutomaticGearbox className="text-2xl" />
                Book Automatic Van Here
              </Link>
            </div>

            {/* Use Cases Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3   gap-4 max-w-5xl mx-auto">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#fe9a00]/20 transition-all duration-300"
                >
                  <div className="text-[#fe9a00] text-xs md:text-sm">{useCase.icon}</div>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    {useCase.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Success Van Hire */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fe9a00]/10 border border-[#fe9a00]/20 text-[#fe9a00] text-sm font-bold mb-4">
              <FiAward className="text-lg" />
              <span>WHY CHOOSE US</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Why Choose{" "}
              <span className="text-[#fe9a00]">Success Van Hire?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Experience the difference with London's premier automatic van
              rental company
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div
                key={index}
                ref={(el) => {
                  featuresRef.current[index] = el;
                }}
                className="group relative"
              >
                <div
                  className={`h-full bg-linear-to-br ${feature.linear} backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#fe9a00]/30 transition-all duration-500 hover:scale-105`}
                >
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.iconColor} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-2xl font-black text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold mb-6">
                <FiCheckCircle className="text-lg" />
                <span>AUTOMATIC TRANSMISSION BENEFITS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                Why Drive an{" "}
                <span className="text-[#fe9a00]">Automatic Van?</span>
              </h2>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We understand that driving a manual van can be challenging for
                some customers. That's why we exclusively offer automatic vans,
                providing a seamless driving experience for both individuals and
                businesses.
              </p>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      benefitsRef.current[index] = el;
                    }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#fe9a00]/20 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-lg bg-linear-to-br from-[#fe9a00] to-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <FiCheckCircle className="text-white text-sm" />
                    </div>
                    <span className="text-white font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Feature Highlights */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-[#fe9a00]/20 to-transparent rounded-3xl blur-2xl"></div>
              <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-2xl bg-[#fe9a00]/20 border border-[#fe9a00]/30 flex items-center justify-center mx-auto mb-6">
                    <TbAutomaticGearbox className="text-[#fe9a00] text-6xl" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Stress-Free Driving
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Experience the comfort of automatic transmission
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                    <div className="text-xl md:text-4xl font-black text-[#fe9a00] mb-2">
                      100%
                    </div>
                    <div className="text-gray-300 text-sm font-semibold">
                      Automatic Fleet
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                    <div className="text-xl md:text-4xl font-black text-[#fe9a00] mb-2">
                      Modern
                    </div>
                    <div className="text-gray-300 text-sm font-semibold">
                      Well-Equipped
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-[#fe9a00]/10 to-transparent border border-[#fe9a00]/20 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <FiSettings className="text-[#fe9a00] text-2xl shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-bold mb-2">
                        Latest Features
                      </h4>
                      <p className="text-gray-300 text-sm">
                        All our automatic vans are equipped with modern features
                        including air conditioning, GPS navigation, parking
                        sensors, and more for your comfort and safety.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Rating Section */}
      <section className="relative py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8 lg:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <FiStar className="text-yellow-400 text-4xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className="text-yellow-400 fill-yellow-400 text-2xl"
                      />
                    ))}
                  </div>
                  <div className="text-white font-black text-3xl mb-2">
                    High Star Google Rating
                  </div>
                  <p className="text-gray-400 text-lg">
                    Trusted by thousands of customers across London
                  </p>
                </div>
              </div>
              <a
                href="https://www.google.co.uk/maps/place/Success+Van+Hire/@51.5697225,-0.2386674,17.48z/data=!4m16!1m9!3m8!1s0x48761b70e7890549:0x932c1c31b90d97!2sSuccess+Van+Hire!8m2!3d51.5675488!4d-0.2369702!9m1!1b1!16s%2Fg%2F11m7j0n771!3m5!1s0x48761b70e7890549:0x932c1c31b90d97!8m2!3d51.5675488!4d-0.2369702!16s%2Fg%2F11m7j0n771?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <FiMapPin className="text-xl" />
                Check Our Location & Reviews
                <FiExternalLink />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#fe9a00] to-orange-500 p-1">
            <div className="bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-3xl p-8 lg:p-16">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-xl lg:text-5xl font-black text-white mb-6">
                  Book Your Automatic Van Rental Today
                </h2>
                <p className="text-gray-300 text-sm mdLtext-lg mb-10 leading-relaxed">
                  Experience the convenience and comfort of driving an automatic
                  van with Success Van Hire. We are available to answer any
                  questions you may have, provide personalized recommendations,
                  and ensure a smooth rental process. Choose Success Van Hire
                  for your next van rental in London and enjoy a successful
                  journey every time!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                  <a
                    href="tel:02030111198"
                    className="w-full sm:w-auto group px-10 py-6 rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-xl shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FiPhone className="text-3xl group-hover:rotate-12 transition-transform" />
                    <div className="text-left">
                      <div className="text-sm text-white/80">
                        Call us now to book
                      </div>
                      <div className="font-black md:text-2xl">020 3011 1198</div>
                    </div>
                  </a>
                  <Link
                    href="/reservation"
                    className="w-full sm:w-auto px-10 py-6 rounded-xl bg-white/5 border-2 border-white/20 text-white font-bold md:text-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <TbAutomaticGearbox className="text-3xl" />
                    Book Online Now
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400 text-lg" />
                    <span>Automatic Only</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400 text-lg" />
                    <span>No Hidden Fees</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400 text-lg" />
                    <span>Fully Insured</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400 text-lg" />
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
