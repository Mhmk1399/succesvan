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
  FiStar,
  FiHelpCircle,
  FiTrello,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head"; // For meta tags
import VanListingHome from "@/components/global/vanListing.backup";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WelcomePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const areasRef = useRef<(HTMLElement | null)[]>([]);
  const servicesRef = useRef<(HTMLDivElement | null)[]>([]);
  // New refs for additional sections
  const testimonialsRef = useRef<(HTMLDivElement | null)[]>([]);
  const faqRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate features (existing)
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

      // Animate areas (existing)
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

      // Animate services (existing)
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

      // Animate testimonials (new)
      testimonialsRef.current.forEach((testimonial, index) => {
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

      // Animate FAQ items (new)
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

  const whyChooseUs = [
    {
      icon: <FiDollarSign className="text-3xl" />,
      title: "Competitive Pricing",
      description:
        "We offer some of the most affordable cheap van hire London rates in North West London, ensuring you get the best value for your van rental. Our transparent pricing structure means no surprises - just honest, competitive rates for quality van hire London services. Whether you need short-term or long-term van hire, we guarantee the best prices in the area. We also offer special discounts for weekly bookings, repeat customers, and off-peak rentals, making us the most cost-effective choice for van rental North West London.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiTruck className="text-3xl" />,
      title: "Wide Range of Vans",
      description:
        "From compact vans for small loads to larger Luton van hire London vehicles for full home removals, we have the right van to suit your requirements. Our fleet includes small vans, medium vans, large vans, and Luton vans with tail lifts. Every vehicle in our van hire North West London fleet is regularly serviced and maintained to the highest standards, ensuring reliability and safety for your journey. We also offer specialist vehicles like refrigerated vans for temperature-sensitive goods and crew vans for work teams.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "Flexible Rental Periods",
      description:
        "Whether you need a van for a few hours, a day, a week, or longer, our flexible van hire London rental options are designed to accommodate your schedule. We understand that every customer has unique needs, which is why we offer customizable rental periods for both personal and commercial van hire. Book your removal van hire London or cheap van hire London with flexible pickup and drop-off times, including out-of-hours options by prior arrangement. Our long-term contracts for businesses come with additional benefits like priority support and discounted rates.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiMapPin className="text-3xl" />,
      title: "Local Expertise",
      description:
        "Our knowledgeable staff are familiar with North West London and surrounding areas including Brent, Harrow, Ealing, Wembley, and Hendon, providing you with the best routes and advice for your van hire London journey. We know the local roads, traffic patterns, and can recommend the most efficient routes for your removal van hire London or delivery needs. Our local expertise makes us the preferred choice for van rental North West London. We can also advise on parking restrictions, low emission zones (ULEZ/LEZ), and congestion charges to help you avoid fines.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "No Hidden Fees",
      description:
        "Transparency is key to our van hire service. The price you see is the price you pay - no hidden charges, no unexpected fees. Our cheap van hire London pricing includes comprehensive insurance options, and we clearly explain all costs upfront. This honest approach to van hire North West London has earned us a reputation as the most trustworthy van rental company in the area. We provide a detailed breakdown of your rental cost, including mileage allowances, fuel policy, and any optional extras you choose, so you always know exactly what you're paying for.",
      linear: " ",
      iconColor: "text-[#fe9a00]",
    },
  ];

  const services = [
    {
      icon: <FiCalendar className="text-2xl" />,
      title: "Daily and Weekly Rentals",
      description: "Perfect for short-term van hire London needs including house moves, deliveries, and one-off transport requirements. Our cheap van hire London daily rates are highly competitive, and we offer special discounts for weekly van rental North West London bookings. Whether you need a van for a single day to move furniture or a full week for a home renovation project, we have flexible options to suit your timeline and budget.",
    },
    {
      icon: <FiTruck className="text-2xl" />,
      title: "Long-Term Van Hire",
      description: "Ideal for businesses or extended project requirements. Our long-term van hire London packages offer exceptional value for companies needing reliable commercial van rental. Whether you need a Luton van hire London for ongoing removals or a fleet of vans for your business, we provide flexible contracts tailored to your needs. Long-term rentals include maintenance packages, roadside assistance, and the option to swap vehicles as your requirements change.",
    },
    {
      icon: <FiPackage className="text-2xl" />,
      title: "Optional Extras",
      description:
        "Enhance your van hire experience with GPS navigation systems, trolleys, moving blankets, boxes, and packing materials available upon request. We also offer additional driver options and extended insurance coverage for your removal van hire London. All extras are competitively priced to complement our cheap van hire London services. For larger moves, we can also arrange for professional packing assistance or provide you with a detailed inventory checklist.",
    },
  ];



  // New testimonials data
  const testimonials = [
    {
      name: "John D.",
      rating: 5,
      text: "I hired a Luton van for my house move and was impressed by the cleanliness and condition of the vehicle. The team at Success Van Hire were friendly and explained everything clearly. Highly recommended!",
      location: "Hendon",
    },
    {
      name: "Sarah M.",
      rating: 5,
      text: "Great value for money! I needed a small van for a day to transport some furniture. The booking process was quick, and the van was ready on time. Will definitely use again.",
      location: "Wembley",
    },
    {
      name: "David K.",
      rating: 5,
      text: "As a business owner, I rely on Success Van Hire for my weekly deliveries. Their long-term rental package saves me money, and the vans are always reliable. Excellent customer service.",
      location: "Brent Cross",
    },
  ];

  // New FAQ data
  const faqs = [
    {
      question: "What do I need to hire a van?",
      answer: "You need a full valid UK driving licence (or international licence with counterpart), a valid debit/credit card for the security deposit, and be at least 21 years old. For drivers under 25, a young driver surcharge may apply. We also accept provisional licences for certain vehicle categories, but please check with us beforehand.",
    },
    {
      question: "Can I hire a van for one-way trips?",
      answer: "Yes, we offer one-way van hire between many locations within London and beyond. Please inform us when booking so we can arrange the drop-off and advise any additional fees. One-way rentals are perfect for moves where you don't need to return to the starting point.",
    },
    {
      question: "What is your mileage policy?",
      answer: "Most of our rentals include 100 free miles per day. Additional miles are charged at a low rate per mile. For long-term hires, we offer unlimited mileage packages. Please ask our team for details specific to your rental.",
    },
    {
      question: "Do you provide insurance?",
      answer: "Yes, all rentals include basic third-party insurance. You can also purchase additional coverage to reduce the excess, including tyre and windscreen protection. We accept most personal auto insurance policies and credit card coverage, so bring your documents for verification.",
    },
    {
      question: "Can I add an extra driver?",
      answer: "Absolutely! Additional drivers can be added for a small daily fee. They must meet the same age and licence requirements and be present at the time of pickup with their licence.",
    },
    {
      question: "What happens if the van breaks down?",
      answer: "We provide 24/7 roadside assistance with every rental. If you experience any issues, just call the number provided in your rental agreement, and we'll send help immediately. For major mechanical failures, we'll arrange a replacement vehicle if possible.",
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
    <>
      {/* Add meta tags for SEO */}
      <Head>
        <title>Van Hire North West London | Success Van Hire - Cheap & Reliable</title>
        <meta
          name="description"
          content="Success Van Hire offers affordable van rental in North West London. Choose from small vans, Luton vans, and more for house moves, deliveries, or business. No hidden fees, flexible hire, and local expertise. Book online today!"
        />
        <meta
          name="keywords"
          content="van hire London, cheap van hire London, removal van hire London, Luton van hire London, van rental North West London, small van hire, large van hire, Wembley van hire, Hendon van hire"
        />
        <link rel="canonical" href="https://www.successvanhire.com/" />
      </Head>

      <div ref={sectionRef} className="relative w-full bg-[#0f172b] py-28">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-125 h-125 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/2 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Featured Image */}
              <div className="mb-12 relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/assets/images/north west london vanhire.png"
                  alt="Van Hire North West London - Success Van Hire fleet of clean, modern vans ready for rental"
                  width={1200}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
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

              <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-8 leading-relaxed">
                At Success Van Hire, we specialise in providing cost-effective van
                rental solutions tailored to meet your needs, whether you're
                moving home, transporting goods, or need a reliable vehicle for
                your business. Based in North West London, we serve a wide range
                of local areas with a fleet of well-maintained and spacious vans
                ready to assist you. Our mission is to make van hire simple,
                affordable, and stress-free for every customer.
              </p>

              <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-8 leading-relaxed">
                Looking for affordable van hire in North West London? Our <Link href="/cheap-van-hire-london" className="text-[#fe9a00] hover:underline">cheap van hire London</Link> services offer exceptional value without compromising on quality. Whether you need a <Link href="/removal-van-hire-london" className="text-[#fe9a00] hover:underline">removal van hire London</Link> for your house move, a <Link href="/luton-van-hire-london" className="text-[#fe9a00] hover:underline">Luton van hire London</Link> for larger loads, or simply reliable <Link href="/van-hire-london" className="text-[#fe9a00] hover:underline">van hire London</Link> for business deliveries, Success Van Hire has you covered. We understand that finding cheap van hire London that's both affordable and dependable can be challenging, which is why we've built our reputation on transparent pricing and excellent customer service. Our vans are modern, low-emission, and ULEZ-compliant, ensuring you can drive anywhere in London without worry.
              </p>

              <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed">
                Our van hire North West London service extends across Brent, Harrow, Ealing, Wembley, Hendon, and surrounding areas. From small van hire for quick deliveries to large Luton van hire London for complete home removals, our diverse fleet caters to every requirement. We pride ourselves on being the go-to choice for van rental North West London, offering flexible rental periods from hourly bookings to long-term contracts. Whether you're a homeowner planning a DIY move or a business requiring regular van hire London services, our team is dedicated to providing seamless, hassle-free experiences. We also offer tailored solutions for events, filming productions, and charity work—just ask!
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

        {/* Our Fleet Section - Van Listing */}
        <VanListingHome showHeader={true} gridCols={3} />

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

        {/* Customer Testimonials (New) */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                What Our <span className="text-[#fe9a00]">Customers Say</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Real feedback from satisfied van hire customers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    testimonialsRef.current[index] = el;
                  }}
                  className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#fe9a00]/30 transition-all duration-300"
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
                Serving the{" "}
                <span className="text-[#fe9a00]">Local Communities</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-6">
                We are proud to serve not just North West London but also the
                neighboring communities. Our local knowledge allows us to provide
                personalised service that's just around the corner.
              </p>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Our van hire North West London service covers all major areas including Hendon, Wembley, Brent Cross, Cricklewood, Golders Green, Hampstead, and Mill Hill. Whether you're searching for cheap van hire London in Harrow, removal van hire London in Ealing, or Luton van hire London in Camden, Success Van Hire delivers professional van rental services right to your doorstep. We're the trusted choice for van hire London across all NW postcodes, as well as nearby areas like Stanmore, Edgware, Finchley, and Barnet.
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
              <p className="text-gray-300 max-w-2xl mx-auto mb-4">
                Including Camden, Brent, Wembley, Harrow, Kilburn, and beyond. Our
                knowledgeable staff are familiar with all surrounding areas,
                providing you with the best routes and advice. We also cover Central London, East London, and parts of South London—just ask!
              </p>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Need van hire London services in other areas? We also provide cheap van hire London, removal van hire London, and Luton van hire London throughout Greater London. Our van rental North West London expertise extends to Central London, East London, and South London. Contact us today to discuss your van hire requirements, and discover why we're the number one choice for affordable, reliable van hire London services. We also offer delivery and collection options to make your rental even more convenient.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (New) */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Frequently Asked <span className="text-[#fe9a00]">Questions</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to know about hiring a van with us
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    faqRef.current[index] = el;
                  }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#fe9a00]/30 transition-all duration-300"
                >
                  <h3 className="text-lg font-black text-white mb-3 flex items-start gap-2">
                    <FiHelpCircle className="text-[#fe9a00] mt-1 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-gray-400">
                Still have questions? <Link href="/contact" className="text-[#fe9a00] hover:underline">Get in touch</Link> – we're happy to help!
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
                    Ready to book your cheap van hire London? It's easy! Just give us a call or fill
                    out our online booking form. Our friendly team is here to help
                    you find the perfect van hire London solution, whether you need removal van hire London, Luton van hire London, or standard van rental North West London. Experience the best van hire service in North West London today!
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
      </div>
    </>
  );
}