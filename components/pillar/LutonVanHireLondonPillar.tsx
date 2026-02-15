"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiCheck,
  FiPhone,
  FiArrowRight,
  FiTruck,
  FiBox,
  FiMaximize,
  FiShield,
  FiZap,
  FiAward,
  FiTool,
  FiHome,
} from "react-icons/fi";
import FAQComponent, { FAQItem } from "@/components/static/fAQSection";

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let startTime: number;
            const animate = (currentTime: number) => {
              if (!startTime) startTime = currentTime;
              const progress = Math.min(
                (currentTime - startTime) / duration,
                1,
              );
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * end));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 },
    );

    const el = document.getElementById(`counter-${end}-${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix, duration, hasAnimated]);

  return (
    <span id={`counter-${end}-${suffix}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function LutonVanHireLondonHero() {
  const stats = [
    { value: 20, suffix: "m³", label: "Cargo Capacity" },
    { value: 132, prefix: "£", suffix: "", label: "From Per Day" },
    { value: 100, suffix: "%", label: "ULEZ Compliant" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-28 md:pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-200 h-200 bg-linear-to-bl from-orange-500/8 via-amber-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-blue-500/5 via-cyan-500/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-orange-500/3 rounded-full blur-[120px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              Luton Van Hire{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-[#fe9a00] via-amber-400 to-[#fe9a00] bg-clip-text text-transparent">
                  London
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-linear-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-sm" />
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300/90 mb-10 leading-relaxed max-w-xl">
              Largest capacity Luton van hire London for full house moves and commercial deliveries. Our Luton van rental London service offers spacious vans with tail lifts, perfect for 3-4 bedroom houses. Get professional{" "}
              <Link
                href="/van-hire-london"
                className="text-[#fe9a00] hover:text-amber-400 underline"
              >
                van hire london
              </Link>{" "}
              with 20m³ capacity and over-cab storage. Book your Luton van hire London today from £132/day with unlimited mileage and comprehensive insurance included.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/reservation"
                className="group px-8 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                Book Luton Van Now
                <FiArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <a
                href="tel:+44 20 3011 1198"
                className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <FiPhone
                  size={18}
                  className="group-hover:rotate-12 text-[#fe9a00] transition-transform"
                />
                +44 20 3011 1198
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-orange-500/10 via-transparent to-amber-500/10 rounded-3xl blur-2xl" />
              <div className="relative h-54 md:h-100 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src="/assets/images/van-hire-london.png"
                  alt="Luton Van Hire London"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1a]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-black/10 backdrop-blur-sm border border-white/10 rounded-xl">
                    <FiMaximize className="text-[#fe9a00]" size={18} />
                    <span className="text-white text-[10px] md:text-sm font-semibold">
                      Largest Capacity Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseLutonSection() {
  const benefits = [
    {
      icon: FiMaximize,
      title: "Maximum Capacity",
      description:
        "20m³ cargo space plus over-cab storage. Our Luton van hire London offers the largest capacity for full house moves and commercial deliveries.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: FiTool,
      title: "Tail Lift Available",
      description:
        "Heavy item loading made easy with tail lift equipped Luton vans. Perfect for furniture, appliances, and commercial goods with our Luton van rental London.",
      iconColor: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: FiShield,
      title: "Fully Insured",
      description:
        "Comprehensive insurance included with every Luton van hire London booking. Drive with confidence knowing you're fully covered for peace of mind.",
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: FiZap,
      title: "Easy to Drive",
      description:
        "Despite the size, our Luton vans are easy to drive with standard UK licence. No special training needed for Luton van hire London.",
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Why Choose Our Luton Van Hire London?
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
            Success Van Hire offers the best Luton van hire London service with spacious vans, tail lift options, and transparent pricing. Whether you're moving a 4-bedroom house or making commercial deliveries, our Luton van rental London fleet provides maximum capacity and reliability for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#fe9a00]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className={benefit.iconColor} size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LutonSpecificationsSection() {
  const specs = [
    {
      label: "Cargo Volume",
      value: "20m³",
      description: "Plus over-cab storage space",
    },
    {
      label: "Load Length",
      value: "4.2m",
      description: "Perfect for long furniture",
    },
    {
      label: "Load Height",
      value: "2.2m",
      description: "Stand-up height inside",
    },
    {
      label: "Payload",
      value: "1,000kg",
      description: "Maximum load capacity",
    },
    {
      label: "Tail Lift",
      value: "Available",
      description: "500kg lifting capacity",
    },
    {
      label: "Fuel Type",
      value: "Diesel",
      description: "ULEZ compliant engines",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0a0e1a] to-[#0d1321]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Luton Van Specifications
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
            Our Luton van hire London fleet features modern, well-maintained vehicles with impressive specifications. Perfect for{" "}
            <Link
              href="/removal-van-hire-london"
              className="text-[#fe9a00] hover:text-amber-400 underline"
            >
              removal van hire london
            </Link>{" "}
            and commercial use, these Luton vans offer maximum capacity and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[#fe9a00]/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-medium">
                  {spec.label}
                </h3>
                <FiBox className="text-[#fe9a00]" size={20} />
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">
                {spec.value}
              </div>
              <p className="text-slate-400 text-sm">{spec.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <FiAward className="text-blue-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-white font-semibold mb-2">
                All Luton Van Hire London Includes:
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Comprehensive insurance, unlimited mileage, 24/7 breakdown assistance, free additional driver, full tank of fuel, and no hidden fees. Our Luton van rental London service provides everything you need for a successful move or delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TailLiftBenefitsSection() {
  const benefits = [
    {
      title: "Heavy Furniture Loading",
      description:
        "Load sofas, wardrobes, and beds without lifting. Our tail lift Luton van hire London makes heavy furniture moves effortless and safer.",
    },
    {
      title: "Appliance Transport",
      description:
        "Fridges, washing machines, and ovens load easily with tail lift. Perfect for kitchen moves with Luton van rental London.",
    },
    {
      title: "Commercial Deliveries",
      description:
        "Pallet loading and unloading made simple. Ideal for businesses needing Luton van hire London for regular deliveries.",
    },
    {
      title: "Reduce Injury Risk",
      description:
        "No manual lifting of heavy items reduces back strain and injury risk. Safer moving with tail lift Luton van hire London.",
    },
    {
      title: "Save Time",
      description:
        "Load and unload faster with mechanical assistance. Complete your move quicker with tail lift Luton van rental London.",
    },
    {
      title: "Professional Results",
      description:
        "Move items safely without damage. Professional-grade equipment with our Luton van hire London service.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Tail Lift Benefits for Luton Van Hire London
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
            Our tail lift equipped Luton van hire London makes loading heavy items effortless. With 500kg lifting capacity, you can safely load furniture, appliances, and commercial goods without manual lifting. Perfect for house moves and business deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[#fe9a00]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/10 flex items-center justify-center mb-4">
                <FiCheck className="text-[#fe9a00]" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LutonUseCasesSection() {
  const useCases = [
    {
      icon: FiHome,
      title: "Full House Moves",
      description:
        "Perfect for 3-4 bedroom houses. Our Luton van hire London provides enough space for complete house relocations in one trip.",
      ideal: "3-4 bedroom properties",
    },
    {
      icon: FiTruck,
      title: "Commercial Deliveries",
      description:
        "Ideal for businesses making regular deliveries. Luton van rental London offers professional capacity for trade and retail.",
      ideal: "Businesses & traders",
    },
    {
      icon: FiBox,
      title: "Office Relocations",
      description:
        "Move entire offices with desks, chairs, and equipment. Luton van hire London handles commercial moves efficiently.",
      ideal: "Small to medium offices",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0a0e1a] to-[#0d1321]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Perfect Uses for Luton Van Hire London
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
            Our Luton van hire London service is ideal for various moving and delivery needs. From full house relocations to commercial deliveries, Luton van rental London provides the capacity and reliability you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, i) => (
            <div
              key={i}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[#fe9a00]/30 transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-[#fe9a00]/10 flex items-center justify-center mb-6">
                <useCase.icon className="text-[#fe9a00]" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {useCase.title}
              </h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                {useCase.description}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-[#fe9a00] text-sm font-medium">
                  {useCase.ideal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LutonFAQSection() {
  const faqs: FAQItem[] = [
    {
      question: "Do I need a special licence to drive a Luton van in London?",
      answer:
        "No, you can drive our Luton vans with a standard UK driving licence. All our Luton van hire London vehicles are under 3.5 tonnes, so no special licence or training is required. If you passed your test after 1997, you can still drive our Luton vans.",
    },
    {
      question: "How much can a Luton van carry?",
      answer:
        "Our Luton van hire London offers 20m³ cargo capacity plus over-cab storage, with a payload of up to 1,000kg. This is enough for a complete 3-4 bedroom house move or substantial commercial deliveries. The Luton van rental London is our largest capacity vehicle.",
    },
    {
      question: "Are tail lifts included with Luton van hire London?",
      answer:
        "Yes, our Luton vans come equipped with tail lifts at no extra cost. The 500kg capacity tail lift makes loading heavy furniture and appliances effortless. Perfect for house moves and commercial deliveries with Luton van hire London.",
    },
    {
      question: "Is Luton van hire London more expensive than smaller vans?",
      answer:
        "Luton van hire London costs £132/day, which is excellent value considering the massive capacity. You'll likely complete your move in one trip instead of multiple trips with smaller vans, actually saving money overall on fuel and time.",
    },
    {
      question: "Can I drive a Luton van in central London?",
      answer:
        "Yes, all our Luton van hire London fleet is ULEZ compliant, so you can drive anywhere in London without ULEZ charges. However, be aware of congestion charges in central zones and check parking restrictions for larger vehicles.",
    },
    {
      question: "What's included in Luton van rental London prices?",
      answer:
        "All our Luton van hire London prices include comprehensive insurance, unlimited mileage, 24/7 breakdown cover, free additional driver, tail lift, and full tank of fuel. No hidden fees - what you see is what you pay for your Luton van rental London.",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Luton Van Hire London FAQ
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Common questions about Luton van hire London, Luton van rental London, and tail lift equipped vans.
          </p>
        </div>
        <FAQComponent faqs={faqs} />
      </div>
    </section>
  );
}

export function LutonFinalCTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0a0e1a] to-[#0d1321]" />
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 md:p-12 bg-linear-to-br from-[#fe9a00]/10 via-amber-500/5 to-orange-500/10 border border-[#fe9a00]/20 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Book Your Luton Van Hire London Today
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Get the largest capacity Luton van hire London with tail lift, unlimited mileage, and full insurance from £132/day. Perfect for full house moves and commercial deliveries. Whether you need{" "}
            <Link
              href="/removal-van-hire-london"
              className="text-[#fe9a00] hover:text-amber-400 underline"
            >
              removal van hire london
            </Link>{" "}
            or professional{" "}
            <Link
              href="/van-hire-london"
              className="text-[#fe9a00] hover:text-amber-400 underline"
            >
              van hire london
            </Link>
            , our Luton van rental London service delivers maximum capacity and reliability. Book now and experience hassle-free moving with 20m³ cargo space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="group px-8 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
            >
              Book Luton Van Now
              <FiArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="tel:+44 20 3011 1198"
              className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center gap-3"
            >
              <FiPhone size={18} className="text-[#fe9a00]" />
              Call for Booking
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
