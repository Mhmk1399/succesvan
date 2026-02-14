"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiCheck,
  FiPhone,
  FiArrowRight,
  FiMapPin,
  FiTruck,
  FiClock,
  FiDollarSign,
  FiZap,
  FiSliders,
  FiAward,
  FiShield,
  FiChevronDown,
  FiArrowDown,
  FiPackage,
  FiBox,
  FiArrowUp,
  FiArrowLeft,
} from "react-icons/fi";
import FAQComponent, { FAQItem } from "@/components/static/fAQSection";

// ─── Animated Counter Component ─────────────────────────────────────────────
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

// ─── HERO SECTION ───────────────────────────────────────────────────────────
export function VanHireLondonHero() {
  const stats = [
    { value: 5000, suffix: "+", label: "Happy Customers" },
    { value: 50, suffix: "+", label: "Vans Available" },
    { value: 4.9, suffix: "★", label: "Average Rating", isDecimal: true },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-28 md:pt-20 pb-16 overflow-hidden">
      {/* Layered Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-200 h-200 bg-linear-to-bl from-orange-500/8 via-amber-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-blue-500/5 via-cyan-500/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-orange-500/3 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl   md:text-6xl   font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              Van Hire{"  "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-[#fe9a00] via-amber-400 to-[#fe9a00] bg-clip-text text-transparent">
                  London
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-linear-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-sm" />
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300/90 mb-10 leading-relaxed max-w-xl">
              Looking for van hire in London? Success Van Hire provides fast,
              flexible and affordable van rental in London and across Greater
              London. Whether you want to book a van in London for moving house,
              business deliveries, airport transport, or furniture collection,
              our London van hire service makes it easy to hire a van in London
              and reserve a van online with trusted vans available today —
              including{" "}
              <Link
                href="/cheap-van-hire-london"
                className="text-green-400 hover:text-green-300 underline"
              >
                cheap van hire London
              </Link>{" "}
              options when you book early.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/reservation"
                className="group px-8 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                Book Your Van Now
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                    {stat.isDecimal ? (
                      <span>
                        4.9<span className="text-amber-400">★</span>
                      </span>
                    ) : (
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-linear-to-r from-orange-500/10 via-transparent to-amber-500/10 rounded-3xl blur-2xl" />
              <div className="relative h-54 md:h-100 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src="/assets/images/van-hire-london.png"
                  alt="Van Hire London - Success Van Hire"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1a]/60 via-transparent to-transparent" />

                {/* Floating badge on image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-black/10 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="md:w-2.5 md:h-2.5 w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-[10px] md:text-sm font-semibold">
                      Vans Available Today
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

// ─── WHY CHOOSE SECTION ────────────────────────────────────────────────────
export function WhyChooseSection() {
  const reasons = [
    {
      icon: FiDollarSign,
      title: "Transparent Pricing",
      description:
        "No hidden fees. Flexible daily and weekly rates that fit your budget.",
      points: [
        "Clear upfront costs",
        "Flexible daily & weekly deals",
        "Budget-friendly options",
      ],
      linear: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      icon: FiZap,
      title: "Instant Booking",
      description:
        "Book online in minutes. Quick confirmation and 24/7 customer support.",
      points: [
        "Easy online reservation",
        "Quick confirmation",
        "24/7 support available",
      ],
      linear: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      icon: FiTruck,
      title: "Every Van Size",
      description:
        "From nimble city vans to spacious Luton vans — we have the right fit.",
      points: [
        "Small & city vans",
        "Medium & transit vans",
        "Large & Luton vans",
      ],
      linear: "from-purple-500/10 to-violet-500/10",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      icon: FiMapPin,
      title: "All of London Covered",
      description:
        "Serving North, South, East, West and Central London with flexible pickup.",
      points: [
        "All London boroughs",
        "Central London coverage",
        "Flexible pickup locations",
      ],
      linear: "from-orange-500/10 to-amber-500/10",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wide uppercase">
            Why Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
            Why Choose{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              Success Van Hire
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Reliability, transparent pricing, and exceptional service —
            everything you need for van hire in London. Our London van rental
            service delivers trusted vans across all areas with competitive
            rates and easy online van booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500 bg-white/2 hover:bg-white/4 backdrop-blur-sm overflow-hidden"
              >
                {/* Card linear glow on hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${reason.linear} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div
                    className={`mb-5 p-3.5 ${reason.iconBg} rounded-xl w-fit group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={reason.iconColor} size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5">
                    {reason.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                    {reason.description}
                  </p>
                  <ul className="space-y-2.5">
                    {reason.points.map((point, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-slate-300"
                      >
                        <FiCheck
                          className="text-[#fe9a00] shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── VAN TYPES SECTION ──────────────────────────────────────────────────────
export function VanTypesSection() {
  const [activeVan, setActiveVan] = useState(0);

  const vans = [
    {
      name: "Small Van",
      subtitle: "City Van",
      icon: FiPackage,
      capacity: "Up to 3.5m³",
      payload: "Up to 600kg",
      bestFor: [
        "Small deliveries & parcels",
        "IKEA & furniture pickups",
        "Student moves",
        "Business parcels",
      ],
      examples: "Ford Transit Courier, VW Caddy",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      tagColor: "bg-blue-500/10 text-blue-400",
      iconColor: "text-blue-400",
    },
    {
      name: "Medium Van",
      subtitle: "Transit Van",
      icon: FiBox,
      capacity: "Up to 6m³",
      payload: "Up to 1,000kg",
      bestFor: [
        "1-bed flat moves",
        "Business delivery routes",
        "Equipment transport",
        "Trade tools & supplies",
      ],
      examples: "Ford Transit Custom, Vauxhall Vivaro",
      color: "from-purple-500/20 to-violet-500/20",
      borderColor: "border-purple-500/30",
      tagColor: "bg-purple-500/10 text-purple-400",
      iconColor: "text-purple-400",
    },
    {
      name: "Large Van",
      subtitle: "Long Wheelbase",
      icon: FiTruck,
      capacity: "Up to 11m³",
      payload: "Up to 1,300kg",
      bestFor: [
        "House removals",
        "Office relocations",
        "Heavy furniture",
        "Long-distance moves",
      ],
      examples: "Ford Transit LWB, Mercedes Sprinter",
      color: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
      tagColor: "bg-orange-500/10 text-orange-400",
      iconColor: "text-orange-400",
    },
    {
      name: "Luton Van",
      subtitle: "Box Van",
      icon: FiTruck,
      capacity: "Up to 17m³",
      payload: "Up to 1,500kg",
      bestFor: [
        "Full house removals",
        "Business relocation",
        "Large delivery jobs",
        "Commercial logistics",
      ],
      examples: "Maximum cargo space, tail lift available",
      color: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/30",
      tagColor: "bg-emerald-500/10 text-emerald-400",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wide uppercase">
            Our Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
            Find the{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              Perfect Van In London
            </span>{" "}
            for Your Job
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the right van size for your London move — avoid extra trips
            with a van that’s too small, or overpaying for a van that’s too
            large. Our van hire London fleet and van rental London options make
            it simple to book the right vehicle for every job.
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-21/9 rounded-2xl overflow-hidden mb-12 border border-white/5">
          <Image
            src="/assets/images/van-hire-london2.png"
            alt="Van hire London"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1a] via-[#0a0e1a]/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
            {vans.map((van, i) => {
              const Icon = van.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveVan(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeVan === i
                      ? "bg-[#fe9a00] text-white shadow-lg shadow-orange-500/20"
                      : "bg-black/40 text-white/80 hover:bg-black/60 backdrop-blur-sm border border-white/10"
                  }`}
                >
                  <Icon size={16} /> {van.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Van Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {vans.map((van, i) => {
            const Icon = van.icon;
            return (
              <div
                key={i}
                onClick={() => setActiveVan(i)}
                className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                  activeVan === i
                    ? `${van.borderColor} bg-white/4`
                    : "border-white/5 bg-white/2 hover:border-white/10"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${van.color} transition-opacity duration-500 ${
                    activeVan === i ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-white/5 rounded-lg">
                      <Icon className={`${van.iconColor}`} size={28} />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${van.tagColor}`}
                    >
                      {van.subtitle}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {van.name}
                  </h3>

                  <div className="flex gap-4 mb-4 text-xs text-slate-400">
                    <span>{van.capacity}</span>
                    <span>•</span>
                    <span>{van.payload}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                      Best for
                    </p>
                    <ul className="space-y-2">
                      {van.bestFor.map((item, j) => (
                        <li
                          key={j}
                          className="text-sm text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-[#fe9a00] mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500">{van.examples}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── COVERAGE AREAS SECTION ─────────────────────────────────────────────────
export function CoverageAreasSection() {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(
    "Central London",
  );

  const areas = [
    {
      region: "Central London",
      icon: FiMapPin,
      iconColor: "text-blue-400",
      areas: [
        "Westminster",
        "London Bridge",
        "Paddington",
        "Kings Cross",
        "Victoria",
        "Soho",
        "Covent Garden",
      ],
    },
    {
      region: "North London",
      icon: FiArrowUp,
      iconColor: "text-purple-400",
      areas: [
        "Enfield",
        "Barnet",
        "Finchley",
        "Tottenham",
        "Wood Green",
        "Highgate",
        "Muswell Hill",
      ],
    },
    {
      region: "South London",
      icon: FiArrowDown,
      iconColor: "text-green-400",
      areas: [
        "Croydon",
        "Wimbledon",
        "Brixton",
        "Clapham",
        "Lewisham",
        "Greenwich",
        "Dulwich",
      ],
    },
    {
      region: "East London",
      icon: FiArrowRight,
      iconColor: "text-orange-400",
      areas: [
        "Stratford",
        "Barking",
        "Ilford",
        "Romford",
        "Canary Wharf",
        "Hackney",
        "Tower Hamlets",
      ],
    },
    {
      region: "West London",
      icon: FiArrowLeft,
      iconColor: "text-amber-400",
      areas: [
        "Hounslow",
        "Ealing",
        "Acton",
        "Wembley",
        "Harrow",
        "Richmond",
        "Hammersmith",
      ],
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wide uppercase">
              Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
              Van Hire Across{" "}
              <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
                All of London
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Van hire across all London areas — from Central London to every
              borough, our van hire London service makes it easy to hire a van
              in London with flexible pickup and drop-off. No London area is too
              far for our London van rental service.
            </p>

            {/* Accordion Style Areas */}
            <div className="space-y-3">
              {areas.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.region}
                    className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                      expandedRegion === area.region
                        ? "border-orange-500/30 bg-orange-500/5"
                        : "border-white/5 bg-white/2 hover:border-white/10"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedRegion(
                          expandedRegion === area.region ? null : area.region,
                        )
                      }
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 bg-white/5 rounded-lg ${area.iconColor}`}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="font-bold text-white">
                          {area.region}
                        </span>
                        <span className="text-xs text-slate-500">
                          {area.areas.length} areas
                        </span>
                      </div>
                      <FiChevronDown
                        className={`text-slate-400 transition-transform duration-300 ${
                          expandedRegion === area.region ? "rotate-180" : ""
                        }`}
                        size={20}
                      />
                    </button>
                    {expandedRegion === area.region && (
                      <div className="px-4 pb-4">
                        <div className="flex flex-wrap gap-2">
                          {area.areas.map((a, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:border-orange-500/30 hover:text-orange-300 transition-colors cursor-default"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Visual Map Placeholder */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-8 bg-linear-to-r from-orange-500/5 to-amber-500/5 rounded-3xl blur-3xl" />
              <div className="relative bg-linear-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-white/5 p-10 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiMapPin className="text-[#fe9a00]" size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Greater London Coverage
                  </h3>
                  <p className="text-slate-400 mb-8">
                    Our van hire London service covers all 32 London boroughs
                    plus the City of London. Van hire with flexible pickup and
                    drop-off locations available across Greater London.
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    {[
                      { label: "Boroughs Covered", value: "32+" },
                      { label: "Pickup Points", value: "50+" },
                      { label: "Same-Day Available", value: "Yes" },
                      { label: "Weekend Service", value: "Yes" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/3 rounded-xl border border-white/5"
                      >
                        <div className="text-xl font-bold text-[#fe9a00]">
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
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

// ─── USE CASES SECTION ──────────────────────────────────────────────────────
export function UseCasesSection() {
  const useCases = [
    {
      title: "Moving House in London",
      icon: FiTruck,
      description:
        "Moving in London can be stressful with parking restrictions and narrow roads. A moving van rental in London is often the easiest and most cost-effective way to relocate.",
      items: [
        "Flat & house moves",
        "Student accommodation",
        "Furniture transport",
        "Storage unit trips",
      ],
      linear: "from-blue-500/8 to-cyan-500/8",
      accentColor: "text-blue-400",
      iconColor: "text-blue-400",
    },
    {
      title: "Business Deliveries",
      icon: FiPackage,
      description:
        "London businesses rely on vans daily. Commercial van hire in London is often more flexible and cost-effective than buying or leasing a fleet.",
      items: [
        "Courier & parcels",
        "Retail deliveries",
        "Construction supplies",
        "E-commerce fulfilment",
      ],
      linear: "from-emerald-500/8 to-green-500/8",
      accentColor: "text-emerald-400",
      iconColor: "text-emerald-400",
    },
    {
      title: "Furniture & IKEA Pickups",
      icon: FiBox,
      description:
        "Picking up from IKEA, Facebook Marketplace, or Gumtree? Book a van in London and avoid expensive delivery fees — reserve a van for a few hours or a day.",
      items: [
        "Sofas & beds",
        "Wardrobes & desks",
        "Appliances",
        "Large item collections",
      ],
      linear: "from-purple-500/8 to-violet-500/8",
      accentColor: "text-purple-400",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wide uppercase">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
            Perfect for Every{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              Situation
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, i) => {
            const Icon = useCase.icon;
            return (
              <div
                key={i}
                className="group relative p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500 bg-white/2 hover:bg-white/4 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${useCase.linear} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`p-2.5 bg-white/5 rounded-lg ${useCase.iconColor}`}
                    >
                      <Icon size={24} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  <ul className="space-y-3">
                    {useCase.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 bg-[#fe9a00] rounded-full shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── BOOKING STEPS SECTION ──────────────────────────────────────────────────
export function BookingStepsSection() {
  const steps = [
    {
      number: "01",
      title: "Choose Van Size",
      description: "Select the right van for your job — small to Luton.",
      icon: FiTruck,
    },
    {
      number: "02",
      title: "Pick Date & Duration",
      description: "Daily, weekend, weekly — you choose the timeline.",
      icon: FiClock,
    },
    {
      number: "03",
      title: "Set Pickup Location",
      description: "Tell us where to have the van ready for you.",
      icon: FiMapPin,
    },

    {
      number: "04",
      title: "Drive Away",
      description: "Your van is ready and waiting — keys in hand.",
      icon: FiZap,
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wide uppercase">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
            Book a Van in{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              4 Easy Steps
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            From selection to checkout — book a van in London in minutes with
            fast confirmation and simple online van booking.
          </p>
        </div>

        {/* Desktop Steps */}
        <div className="hidden lg:grid grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-10 left-[60%] w-[80%] h-px bg-linear-to-r from-orange-500/30 to-transparent z-0" />
                )}

                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-5 relative">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform" />
                    <div className="relative w-full h-full bg-[#0f1729] border border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover:border-orange-500/30 transition-colors">
                      <Icon className="text-[#fe9a00]" size={24} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#fe9a00] rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Steps */}
        <div className="lg:hidden space-y-4 mb-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-white/2 border border-white/5 rounded-xl"
              >
                <div className="w-12 h-12 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#fe9a00]">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/reservation"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
          >
            Book Your Van in London Today
            <FiArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ────────────────────────────────────────────────────────────
export function FAQSection() {
  const faqs: FAQItem[] = [
    {
      question: "How much does it cost to hire a van in London?",
      answer:
        "Van hire prices in London depend on van size, duration, and location. Small van rental in London is usually the most affordable option, while Luton van hire London costs more due to its larger capacity. Contact Success Van Hire to get a quick quote and reserve a van in London with transparent pricing.",
    },
    {
      question: "Can I hire a van in London for one day?",
      answer:
        "Yes! You can book a van in London for one day, a weekend, or longer. We offer flexible daily van rental London options plus weekly packages.",
    },
    {
      question: "Do you offer van hire in Central London?",
      answer:
        "Absolutely. We provide comprehensive coverage across Central London, including Westminster, Paddington, Kings Cross, and all major areas throughout Greater London.",
    },
    {
      question: "What size van do I need for moving house?",
      answer:
        "For a studio or 1-bedroom flat, a medium van is typically sufficient. For 2+ bedroom homes or large amounts of furniture, we recommend a large or Luton van. Our team can help you choose the right size.",
    },
    {
      question: "Can I hire a van in London for business deliveries?",
      answer:
        "Yes, we offer both short-term and long-term business rental options with competitive rates and flexible packages designed for commercial use.",
    },
    {
      question: "Is van hire available on weekends?",
      answer:
        "Yes, weekend van hire is available. We recommend booking in advance to guarantee availability, especially during busy periods.",
    },
  ];

  return (
    <FAQComponent
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our van hire services in London"
      faqs={faqs}
      showSearch={false}
      defaultOpen={0}
      accentColor="#fe9a00"
      backgroundColor="#0a0e1a"
    />
  );
}

// ─── FINAL CTA SECTION ─────────────────────────────────────────────────────
export function FinalCTASection() {
  const benefits = [
    { icon: FiZap, label: "Same-day booking available" },
    { icon: FiSliders, label: "Daily, weekly & long-term plans" },
    { icon: FiTruck, label: "Moving, business & delivery vans" },
    { icon: FiAward, label: "Trusted across all of London" },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0e1a] via-[#12182a] to-[#0a0e1a]" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-bl from-orange-500/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-linear-to-tr from-amber-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-amber-200/90 text-sm font-medium">
              Vans available for immediate booking
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Ready to Book Your
            <br />
            <span className="bg-linear-to-r from-[#fe9a00] via-amber-400 to-[#fe9a00] bg-clip-text text-transparent">
              Van in London?
            </span>
          </h2>

          <p className="text-sm md:text-base text-slate-300/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether it’s a quick IKEA run or a full house move, Success Van Hire
            offers fast van booking in London, fair pricing, and reliable vans
            across Greater London. Book a van in London in minutes or reserve a
            van today with flexible daily and weekly van rental options from a
            trusted London van hire service.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
            {benefits.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-orange-500/20 transition-all duration-300 group"
              >
                <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <Icon className="text-[#fe9a00]" size={20} />
                </div>
                <span className="text-slate-200 text-sm font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="group px-10 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 text-lg"
            >
              Book Van Hire London Now
              <FiArrowRight
                size={22}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="tel:+442030111198"
              className="group px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center gap-3 backdrop-blur-sm text-lg"
            >
              <FiPhone
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              Call Us
            </a>
          </div>

          {/* Trust line */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <FiShield size={14} className="text-green-400/60" />
              Fully insured vans
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheck size={14} className="text-green-400/60" />
              No hidden charges
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock size={14} className="text-green-400/60" />
              24/7 customer support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
