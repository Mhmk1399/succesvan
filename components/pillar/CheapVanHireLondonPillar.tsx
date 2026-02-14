"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiCheck,
  FiPhone,
  FiArrowRight,
  FiDollarSign,
  FiClock,
  FiShield,
  FiZap,
  FiTrendingDown,
  FiPercent,
  FiAlertCircle,
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

export function CheapVanHireLondonHero() {
  const stats = [
    { value: 25, prefix: "£", suffix: "+", label: "Starting From" },
    { value: 100, suffix: "%", label: "Price Match" },
    { value: 0, label: "Hidden Fees" },
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
              Cheap Van Hire{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-[#fe9a00] via-amber-400 to-[#fe9a00] bg-clip-text text-transparent">
                  London
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-linear-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-sm" />
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300/90 mb-10 leading-relaxed max-w-xl">
              Need cheap van hire in London? Success Van Hire offers budget van
              hire London with transparent pricing and no hidden fees. Book
              affordable{" "}
              <Link
                href="/van-hire-london"
                className="text-[#fe9a00] hover:text-amber-400 underline"
              >
                van hire london
              </Link>{" "}
              from £25/day — perfect for students, small moves, and
              budget-conscious customers looking for cheap van hire London
              without compromising quality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/reservation"
                className="group px-8 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                Get Cheap Quote Now
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
                  alt="Cheap Van Hire London"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1a]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-black/10 backdrop-blur-sm border border-white/10 rounded-xl">
                    <FiDollarSign className="text-[#fe9a00]" size={18} />
                    <span className="text-white text-[10px] md:text-sm font-semibold">
                      Best Prices Guaranteed
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

export function PricingBenefitsSection() {
  const benefits = [
    {
      icon: FiDollarSign,
      title: "Lowest Prices Guaranteed",
      description:
        "We match any genuine quote. Find cheaper elsewhere? We'll beat it.",
      iconColor: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: FiPercent,
      title: "No Hidden Fees",
      description:
        "What you see is what you pay. No surprise charges at pickup.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: FiClock,
      title: "Flexible Rental Periods",
      description: "Daily, weekend, or weekly — choose what suits your budget.",
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: FiShield,
      title: "Full Insurance Included",
      description: "Comprehensive coverage included in every rental price.",
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wide uppercase">
            Best Value
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
            Why We're the{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              Cheapest Choice
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Affordable doesn't mean low quality. Get cheap van hire London with
            reliable vans and excellent service. Our budget van hire London service delivers the same professional standards as premium rentals, but at prices that won't break the bank. Whether you need cheap van rental London for a quick move or extended hire, we offer competitive rates across all van sizes without compromising on vehicle quality or customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500 bg-white/2 hover:bg-white/4"
              >
                <div
                  className={`mb-5 p-3.5 ${benefit.bgColor} rounded-xl w-fit group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={benefit.iconColor} size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  {benefit.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhyCheapSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center">
            Why Choose{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              Cheap Van Hire London?
            </span>
          </h2>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              Looking for cheap van hire in London doesn't mean you have to sacrifice quality or reliability. At Success Van Hire, our budget van hire London service provides the perfect balance between affordability and professional standards. We understand that not every move or delivery requires a premium service, which is why we've designed our cheap van rental London options to meet the needs of students, small businesses, and budget-conscious customers across the capital.
            </p>
            
            <p>
              Our cheap van hire London fleet includes well-maintained vehicles from trusted manufacturers like Ford Transit and Mercedes Sprinter. Every van in our budget van hire London range undergoes regular servicing and safety checks, ensuring you get a reliable vehicle regardless of the price point. When you book cheap van hire in London with Success Van Hire, you're getting the same quality vans as our premium service, just at more competitive daily rates.
            </p>
            
            <p>
              What makes our cheap van rental London service truly affordable is our transparent pricing structure. Unlike other providers who advertise low rates but add hidden fees at checkout, our budget van hire London prices include insurance, standard mileage, and all essential costs upfront. This means the cheap van hire London price you see is the price you pay — no surprises, no hidden charges, just honest, affordable van rental in London.
            </p>
            
            <p>
              Whether you need cheap van hire London for a few hours, a full day, or an extended period, we offer flexible rental terms that suit your schedule and budget. Our cheap van rental London service covers all areas of Greater London, from Central London to outer boroughs, making it easy to collect and return your van at a convenient location. Book your budget van hire London today and discover why thousands of customers trust Success Van Hire for affordable, reliable van rental across the capital.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingTableSection() {
  const pricing = [
    {
      size: "Short Wheel Base",
      daily: "£78",
      weekly: "£60",
      monthly: "£55",
      bestFor: "Trades, small furniture",
    },
    {
      size: "Medium Wheel Base",
      daily: "£96",
      weekly: "£78",
      monthly: "£70",
      bestFor: "Furniture moves, trade jobs",
    },
    {
      size: "Long Wheel Base",
      daily: "£102",
      weekly: "£72",
      monthly: "£65",
      bestFor: "House removals, office moves",
    },
    {
      size: "Luton With Tail-Lift",
      daily: "£132",
      weekly: "£100",
      monthly: "£90",
      bestFor: "Full house removals",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
            Transparent{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            No surprises. Here's what you'll actually pay for cheap van hire London. Our budget van hire London rates are among the most competitive in the capital, with transparent pricing for daily, weekly, and monthly rentals. Compare our cheap van rental London prices and see why customers choose Success Van Hire for affordable van hire in London.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white font-bold">Van Size</th>
                <th className="text-left p-4 text-white font-bold">Daily (1-6 days)</th>
                <th className="text-left p-4 text-white font-bold">Weekly (7-28 days)</th>
                <th className="text-left p-4 text-white font-bold">Monthly (29+ days)</th>
                <th className="text-left p-4 text-white font-bold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors"
                >
                  <td className="p-4 text-white font-semibold">{row.size}</td>
                  <td className="p-4 text-[#fe9a00] font-bold">{row.daily}</td>
                  <td className="p-4 text-slate-300">{row.weekly}</td>
                  <td className="p-4 text-slate-300">{row.monthly}</td>
                  <td className="p-4 text-slate-400 text-sm">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-orange-500/5 border border-orange-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-orange-400 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-white font-bold mb-2">Price Match Promise</h4>
              <p className="text-slate-400 text-sm">
                Found cheaper van hire London elsewhere? Show us the quote and we'll match or beat it. That's our guarantee for the best cheap van hire London rates. We're confident our budget van hire London prices are among the lowest in the capital, and we back that up with our price match promise. Get cheap van rental London without compromising on quality or service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SavingTipsSection() {
  const tips = [
    {
      icon: FiClock,
      title: "Book Early",
      description: "Reserve in advance for the best rates and availability.",
    },
    {
      icon: FiTrendingDown,
      title: "Choose Weekdays",
      description: "Weekday rentals are typically cheaper than weekends.",
    },
    {
      icon: FiZap,
      title: "Longer = Cheaper",
      description: "Weekly rates offer better value than daily rentals.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a]" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wide uppercase">
            Money Saving Tips
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
            How to Save{" "}
            <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
              Even More
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Make your cheap van hire London even more affordable with these money-saving tips. Our budget van hire London service already offers competitive rates, but you can reduce costs further by following these simple strategies for cheap van rental London.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/5 bg-white/2 hover:border-orange-500/30 transition-all duration-300"
              >
                <Icon className="text-[#fe9a00] mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">
                  {tip.title}
                </h3>
                <p className="text-slate-400 text-sm">{tip.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs: FAQItem[] = [
    {
      question: "How cheap is your van hire in London?",
      answer:
        "Our cheap van hire London starts from £25/day for small vans. We offer budget van hire London with transparent pricing and no hidden fees. Prices vary by van size and rental duration.",
    },
    {
      question: "Is cheap van hire London reliable?",
      answer:
        "Yes! Cheap doesn't mean poor quality. All our vans are well-maintained, fully insured, and regularly serviced. We offer affordable van rental London without compromising on reliability.",
    },
    {
      question: "Do you have any hidden fees?",
      answer:
        "No. What you see is what you pay. Our cheap van hire London pricing includes insurance and standard mileage. No surprise charges at pickup.",
    },
    {
      question: "Can I get a discount for longer rentals?",
      answer:
        "Yes! Weekly rentals offer better value than daily rates. Contact us for long-term cheap van hire London deals and business packages.",
    },
    {
      question: "Do you price match other van hire companies?",
      answer:
        "Absolutely. If you find genuine cheaper van hire London elsewhere, show us the quote and we'll match or beat it. That's our price match guarantee.",
    },
  ];

  return (
    <FAQComponent
      title="Frequently Asked Questions"
      subtitle="Common questions about cheap van hire London"
      faqs={faqs}
      showSearch={false}
      defaultOpen={0}
      accentColor="#fe9a00"
      backgroundColor="#0a0e1a"
    />
  );
}

export function FinalCTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a] to-[#0f1729]" />
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
          Ready for{" "}
          <span className="bg-linear-to-r from-[#fe9a00] to-amber-400 bg-clip-text text-transparent">
            Cheap Van Hire London?
          </span>
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          Book now and get the best cheap van hire London rates. No hidden fees,
          no surprises — just affordable, reliable van hire in London. Our budget van hire London service makes it easy to get the vehicle you need at a price you can afford. Whether you're moving house, making deliveries, or collecting furniture, cheap van rental London from Success Van Hire delivers quality and value every time.
        </p>
        <Link
          href="/reservation"
          className="inline-flex items-center gap-3 px-10 py-4 bg-linear-to-r from-[#fe9a00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
        >
          Get Your Cheap Quote
          <FiArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}
