"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiCheck,
  FiPhone,
  FiArrowRight,
  FiTruck,
  FiHome,
  FiPackage,
  FiShield,
  FiClock,
  FiUsers,
  FiMapPin,
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

export function RemovalVanHireLondonHero() {
  const stats = [
    { value: 5000, suffix: "+", label: "Moves Completed" },
    { value: 98, suffix: "%", label: "Customer Satisfaction" },
    { value: 24, suffix: "/7", label: "Support Available" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-28 md:pt-24 pb-16 overflow-hidden">
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
              Removal Van Hire{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-[#fe9a00] via-amber-400 to-[#fe9a00] bg-clip-text text-transparent">
                  London
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-linear-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-sm" />
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300/90 mb-10 leading-relaxed max-w-xl">
              Professional removal van hire London for house moves, flat relocations, and office transfers. Get reliable{" "}
              <Link
                href="/van-hire-london"
                className="text-[#fe9a00] hover:text-amber-400 underline"
              >
                van hire london
              </Link>{" "}
              services with spacious vans perfect for moving. From studio flats to 4-bedroom houses, our removal van hire London fleet has the right size for your move. Book your moving van hire London today from £78/day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/reservation"
                className="group px-8 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                Book Removal Van Now
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
                      // prefix={stat.prefix}
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
                  src="/assets/images/crew cab van removal van hire.png"
                  alt="Removal Van Hire London"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1a]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-black/10 backdrop-blur-sm border border-white/10 rounded-xl">
                    <FiTruck className="text-[#fe9a00]" size={18} />
                    <span className="text-white text-[10px] md:text-sm font-semibold">
                      Perfect for House Moves
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

export function WhyChooseRemovalSection() {
  const benefits = [
    {
      icon: FiTruck,
      title: "Spacious Removal Vans",
      description:
        "Large capacity vans perfect for house moves. Our removal van hire London fleet includes LWB and Luton vans with tail lifts for easy loading.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: FiShield,
      title: "Fully Insured Moves",
      description:
        "Comprehensive insurance included with every removal van hire London booking. Move with confidence knowing you're fully covered.",
      iconColor: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: FiClock,
      title: "Flexible Rental Periods",
      description:
        "Rent by the day, week, or month. Our moving van hire London service offers flexible rental periods to suit your moving schedule.",
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: FiUsers,
      title: "Free Additional Driver",
      description:
        "Add a second driver at no extra cost. Share the driving on long moves with our removal van hire London service.",
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
            Why Choose Our Removal Van Hire London?
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
            Success Van Hire offers the best removal van hire London service with spacious vans, transparent pricing, and exceptional customer support. Whether you're moving a studio flat or a 4-bedroom house, our moving van hire London fleet has the perfect vehicle for your needs.
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

export function VanSizesForMovingSection() {
  const [selectedSize, setSelectedSize] = useState(0);

  const vanSizes = [
    {
      name: "Medium Van (MWB)",
      size: "Studio - 1 Bed Flat",
      price: " from £96",
      capacity: "~10-12 cubic meters",
      ideal: "Studio flats, 1-bedroom apartments, small moves",
      features: [
        "Perfect for studio to 1-bed moves",
        "Easy to drive and park",
        "Fuel efficient for city moves",
        "Fits through narrow streets",
      ],
      image: "/assets/images/removal van hire medium wheel base.jpg",
    },
    {
      name: "Large Van (LWB)",
      size: "2 Bedroom Flat",
      price: " from £102",
      capacity: "~14-16 cubic meters",
      ideal: "2-bedroom flats, small houses, office moves",
      features: [
        "Ideal for 2-bedroom properties",
        "Extra length for furniture",
        "Comfortable for long drives",
        "Professional moving choice",
      ],
      image: "/assets/images/removan van hire large van.jpg",
    },
    {
      name: "Luton Van",
      size: "3-4 Bedroom House",
      price: " from £132",
      capacity: "~18-20 cubic meters",
      ideal: "Full house moves, large furniture, office relocations",
      features: [
        "Largest capacity available",
        "Tail lift for heavy items",
        "Perfect for full house moves",
        "Over-cab storage space",
      ],
      image: "/assets/images/removal van hire luton.jpg",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0a0e1a] to-[#0d1321]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Choose the Right Removal Van Size
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
            Select the perfect removal van hire London size for your move. Our moving van hire London fleet includes medium, large, and Luton vans to accommodate any property size from studio flats to 4-bedroom houses.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {vanSizes.map((van, i) => (
            <button
              key={i}
              onClick={() => setSelectedSize(i)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedSize === i
                  ? "bg-[#fe9a00] text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {van.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-orange-500/10 to-amber-500/10 rounded-3xl blur-2xl" />
            <div className="relative h-80 rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={vanSizes[selectedSize].image}
                alt={vanSizes[selectedSize].name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
              <FiHome className="text-[#fe9a00]" size={16} />
              <span className="text-sm text-slate-300 font-medium">
                {vanSizes[selectedSize].size}
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {vanSizes[selectedSize].name}
            </h3>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-extrabold text-[#fe9a00]">
                {vanSizes[selectedSize].price}
              </span>
              <span className="text-slate-400">/day</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <FiPackage className="text-[#fe9a00] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Capacity</p>
                  <p className="text-slate-400 text-sm">
                    {vanSizes[selectedSize].capacity}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-[#fe9a00] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Ideal For</p>
                  <p className="text-slate-400 text-sm">
                    {vanSizes[selectedSize].ideal}
                  </p>
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {vanSizes[selectedSize].features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/reservation"
              className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
            >
              Book This Van
              <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MovingTipsSection() {
  const tips = [
    {
      title: "Book Early for Best Availability",
      description:
        "Removal van hire London demand is highest on weekends and month-ends. Book your moving van hire London at least 2 weeks in advance for best availability and rates.",
    },
    {
      title: "Choose the Right Van Size",
      description:
        "Don't underestimate your load. A Luton van for a 3-bed house saves multiple trips. Our team can help you choose the perfect removal van hire London size.",
    },
    {
      title: "Pack Strategically",
      description:
        "Load heavy items first, distribute weight evenly, and secure everything with straps. Proper packing makes your removal van hire London experience safer and easier.",
    },
    {
      title: "Plan Your Route",
      description:
        "Check ULEZ zones, congestion charges, and parking restrictions. Our removal van hire London fleet is ULEZ compliant for worry-free city driving.",
    },
    {
      title: "Get Help with Loading",
      description:
        "Moving heavy furniture alone is risky. Bring friends or consider our recommended moving helpers for your removal van hire London booking.",
    },
    {
      title: "Inspect Before You Drive",
      description:
        "Check the van for existing damage and take photos. Our removal van hire London vehicles are well-maintained, but documentation protects you.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Essential Moving Tips for Removal Van Hire London
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
            Make your move smooth and stress-free with these expert tips for removal van hire London. From packing strategies to route planning, we've got you covered for your moving van hire London experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[#fe9a00]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/10 flex items-center justify-center mb-4">
                <span className="text-[#fe9a00] font-bold text-lg">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RemovalFAQSection() {
  const faqs: FAQItem[] = [
    {
      question: "What size removal van do I need for my house move in London?",
      answer:
        "For a studio or 1-bed flat, a Medium Van (MWB) is sufficient. A 2-bedroom property needs a Large Van (LWB), while 3-4 bedroom houses require a Luton van. Our removal van hire London team can help you choose the right size based on your inventory.",
    },
    {
      question: "Is removal van hire London cheaper than hiring movers?",
      answer:
        "Yes, removal van hire London is significantly cheaper than full-service movers. You can save 60-70% by driving yourself. Our moving van hire London rates start from £78/day compared to £400-800 for professional movers.",
    },
    {
      question: "Do I need a special licence to drive a Luton van in London?",
      answer:
        "No, a standard UK driving licence is sufficient for our Luton vans. All our removal van hire London vehicles are under 3.5 tonnes, so you can drive them with a regular car licence.",
    },
    {
      question: "Are your removal vans ULEZ compliant?",
      answer:
        "Yes, all our removal van hire London fleet is ULEZ compliant. You can drive anywhere in London without ULEZ charges, making your moving van hire London experience hassle-free.",
    },
    {
      question: "Can I hire a removal van for just a few hours?",
      answer:
        "Our removal van hire London service has a minimum rental period of one day. However, you can return the van early and we'll refund the unused fuel. Daily rates are more cost-effective than hourly rentals.",
    },
    {
      question: "What's included in removal van hire London prices?",
      answer:
        "All our removal van hire London prices include comprehensive insurance, unlimited mileage, breakdown cover, and free additional driver. No hidden fees - what you see is what you pay for your moving van hire London.",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0a0e1a] to-[#0d1321]" />
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Removal Van Hire London FAQ
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Common questions about removal van hire London, moving van hire London, and house move van rentals.
          </p>
        </div>
        <FAQComponent faqs={faqs} />
      </div>
    </section>
  );
}

export function RemovalFinalCTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 md:p-12 bg-linear-to-br from-[#fe9a00]/10 via-amber-500/5 to-orange-500/10 border border-[#fe9a00]/20 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Removal Van Hire London?
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Get the best removal van hire London service with spacious vans, transparent pricing, and full insurance. Whether you're moving a flat or a house, our moving van hire London fleet has the perfect vehicle. Book your{" "}
            <Link
              href="/van-hire-london"
              className="text-[#fe9a00] hover:text-amber-400 underline"
            >
              van hire london
            </Link>{" "}
            today and make your move stress-free. Professional removal van hire London from £78/day with unlimited mileage and 24/7 support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="group px-8 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
            >
              Book Removal Van Now
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
              Call for Advice
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
