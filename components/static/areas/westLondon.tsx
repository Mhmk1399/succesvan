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
  FiDollarSign,
  FiShield,
  FiCalendar,
  FiPackage,
  FiNavigation,
} from "react-icons/fi";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WelcomePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const areasRef = useRef<(HTMLElement | null)[]>([]);
  const servicesRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Animate areas
      areasRef.current.forEach((area, index) => {
        if (!area) return;
        gsap.fromTo(
          area as HTMLElement,
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

      // Animate services
      servicesRef.current.forEach((service, index) => {
        if (!service) return;
        gsap.fromTo(
          service,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: service,
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

  const whyChooseUs = [
    {
      icon: <FiDollarSign className="text-3xl" />,
      title: "Competitive Pricing",
      description:
        "We offer some of the most affordable rates in North West London, ensuring you get the best value for your rental.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiTruck className="text-3xl" />,
      title: "Wide Range of Vans",
      description:
        "From compact vans for small loads to larger vehicles for full home removals, we have the right van to suit your requirements.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "Flexible Rental Periods",
      description:
        "Whether you need a van for a day, a week, or longer, our flexible rental options are designed to accommodate your schedule.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiMapPin className="text-3xl" />,
      title: "Local Expertise",
      description:
        "Our knowledgeable staff are familiar with North West London and surrounding areas, providing you with the best routes and advice.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "No Hidden Fees",
      description:
        "Transparency is key to our service. The price you see is the price you pay.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
  ];

  const services = [
    {
      icon: <FiCalendar className="text-2xl" />,
      title: "Daily and Weekly Rentals",
      description: "Perfect for short-term needs",
    },
    {
      icon: <FiTruck className="text-2xl" />,
      title: "Long-Term Van Hire",
      description: "Ideal for businesses or extended project requirements",
    },
    {
      icon: <FiPackage className="text-2xl" />,
      title: "Optional Extras",
      description:
        "GPS navigation systems, moving boxes, and packing materials available upon request",
    },
  ];

  const areas = [
    { name: "Hendon", link: "/van-hire-hendon" },
    {
      name: "Brent Cross",
      link: "/success-van-hire-van-rental-in-brent-cross-london-last-minute-bookings",
    },
    { name: "Cricklewood", link: "/van-hire-cricklewood" },
    { name: "Golders Green", link: "/van-hire-golders-green" },
    { name: "Hampstead", link: "/van-hire-hampstead" },
    { name: "Mill Hill", link: "/van-hire-mill-hill" },
    { name: "Camden", link: "/van-hire-wembley-2-2" },
    { name: "Wembley", link: "/van-hire-wembley" },
  ];

  return (
    <div ref={sectionRef} className="relative w-full bg-[#0f172b] py-28">
      {" "}
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         
        <div className="absolute top-0 right-0 w-125 h-125 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      {/* Hero Section */}
      <section className="relative  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Welcome to
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe9a00] to-orange-500">
                Success Van Hire
              </span>
            </h1>

            <p className="text-2xl sm:text-3xl text-gray-300 mb-8 font-bold">
              Your Trusted Partner for Affordable Van Hire
              <br />
              <span className="text-[#fe9a00]">in North West London</span>
            </p>

            <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed">
              At Success Van Hire, we specialise in providing cost-effective van
              rental solutions tailored to meet your needs, whether you're
              moving home, transporting goods, or need a reliable vehicle for
              your business. Based in North West London, we serve a wide range
              of local areas with a fleet of well-maintained and spacious vans
              ready to assist you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a
                href="tel:02030111198"
                className="group px-8 py-5 rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-500 text-white font-bold text-lg shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <FiPhone className="text-2xl group-hover:rotate-12 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-white/80">Call us now</div>
                  <div className="font-black">020 3011 1198</div>
                </div>
              </a>
              <Link
                href="/reservation"
                className="px-8 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:border-[#fe9a00]/30 transition-all duration-300 flex items-center gap-2"
              >
                <FiTruck className="text-xl" />
                Book Online Now
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-4xl font-black text-[#fe9a00] mb-2">
                  15+
                </div>
                <div className="text-gray-400 text-sm font-semibold">
                  Years Experience
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-4xl font-black text-[#fe9a00] mb-2">
                  50+
                </div>
                <div className="text-gray-400 text-sm font-semibold">
                  Vans Available
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-4xl font-black text-[#fe9a00] mb-2">
                  24/7
                </div>
                <div className="text-gray-400 text-sm font-semibold">
                  Support
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-4xl font-black text-[#fe9a00] mb-2">
                  5★
                </div>
                <div className="text-gray-400 text-sm font-semibold">
                  Google Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Why Choose{" "}
              <span className="text-[#fe9a00]">Success Van Hire?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're committed to providing exceptional service and value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {whyChooseUs.map((feature, index) => (
              <div
                key={index}
                ref={(el) => {
                  featuresRef.current[index] = el;
                }}
                className="group relative"
              >
                <div
                  className={`h-full bg-linear-to-br ${feature.linear} backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#fe9a00]/30 transition-all duration-500 hover:scale-105`}
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.iconColor} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
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
      {/* Our Services Section */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Our <span className="text-[#fe9a00]">Services</span> Include
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Flexible rental options to suit your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                ref={(el) => {
                  servicesRef.current[index] = el;
                }}
                className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#fe9a00]/30 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 rounded-xl bg-[#fe9a00]/20 border border-[#fe9a00]/30 flex items-center justify-center text-[#fe9a00] mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Areas We Serve Section */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Serving the{" "}
              <span className="text-[#fe9a00]">Local Communities</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              We are proud to serve not just North West London but also the
              neighboring communities. Our local knowledge allows us to provide
              personalised service that's just around the corner.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-black text-white mb-8 text-center">
              Areas We Cover in North West London
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {areas.map((area, index) => (
                <Link
                  key={index}
                  href={area.link}
                  ref={(el) => {
                    areasRef.current[index] = el;
                  }}
                  className="group bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-[#fe9a00]/30 transition-all duration-300 hover:scale-105 text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <FiMapPin className="text-[#fe9a00]" />
                  </div>
                  <h4 className="text-white font-bold group-hover:text-[#fe9a00] transition-colors">
                    {area.name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Areas */}
          <div className="bg-linear-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-8 text-center">
            <FiNavigation className="text-blue-400 text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-3">
              Serving Beyond North West London
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Including Camden, Brent, Wembley, Harrow, Kilburn, and beyond. Our
              knowledgeable staff are familiar with all surrounding areas,
              providing you with the best routes and advice.
            </p>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#fe9a00] to-orange-500 p-1">
            <div className="bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-3xl p-8 lg:p-16">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
                  Book Your Van Today!
                </h2>
                <p className="text-gray-300 text-xl mb-8 leading-relaxed">
                  Ready to book your van? It's easy! Just give us a call or fill
                  out our online booking form. Our friendly team is here to help
                  you find the perfect van hire solution.
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
                    Book Online Form
                  </Link>
                </div>

                <div className="grid sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400" />
                    <span>No Hidden Fees</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400" />
                    <span>Fully Insured</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400" />
                    <span>Flexible Terms</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiCheckCircle className="text-green-400" />
                    <span>Local Experts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Location & Contact Info */}
    </div>
  );
}
