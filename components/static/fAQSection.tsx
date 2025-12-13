"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiChevronDown,
  FiSearch,
  FiHelpCircle,
  FiCheck,
  FiX,
} from "react-icons/fi";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  showSearch?: boolean;
  defaultOpen?: number;
  accentColor?: string;
  backgroundColor?: string;
}

export default function FAQComponent({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about our services",
  faqs,
  showSearch = true,
  defaultOpen = -1,
  accentColor = "#fe9a00",
  backgroundColor = "#0f172b",
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>(faqs);
  const sectionRef = useRef<HTMLDivElement>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setFilteredFAQs(faqs);
  }, [faqs]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate FAQ items on scroll
      faqRefs.current.forEach((faq, index) => {
        if (!faq) return;

        gsap.fromTo(
          faq,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: faq,
              start: "top 90%",
              once: true,
            },
            delay: index * 0.01,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredFAQs]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFAQs(faqs);
      return;
    }

    const filtered = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredFAQs(filtered);
    setOpenIndex(-1);
  }, [searchQuery, faqs]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20   overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accentColor }}
        ></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl   lg:text-7xl font-black text-white mb-4 leading-tight">
            {title}
          </h2>

          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-10">
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <FiSearch className="text-gray-500 text-xl" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-14 pr-14 py-5 rounded-2xl border bg-white/5 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                style={{
                  backdropFilter: "blur(20px)",
                  borderColor: searchQuery
                    ? accentColor
                    : "rgba(255,255,255,0.1)",
                  boxShadow: searchQuery
                    ? `0 0 30px ${accentColor}30`
                    : "0 4px 20px rgba(0,0,0,0.2)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group"
                >
                  <FiX className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
              )}
            </div>

            {/* Search Results Count */}
            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Found{" "}
                  <span className="font-bold" style={{ color: accentColor }}>
                    {filteredFAQs.length}
                  </span>{" "}
                  {filteredFAQs.length === 1 ? "result" : "results"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    faqRefs.current[index] = el;
                  }}
                  className="group"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl border transition-all duration-300"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(20px)",
                      borderColor: isOpen
                        ? `${accentColor}60`
                        : "rgba(255,255,255,0.1)",
                      boxShadow: isOpen
                        ? `0 10px 40px ${accentColor}20`
                        : "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    {isOpen && (
                      <div
                        className="absolute inset-0 opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}05, transparent)`,
                        }}
                      ></div>
                    )}

                    {/* Question Button */}
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="relative w-full p-6 lg:p-7 flex items-start gap-5 text-left transition-all duration-300 group/btn"
                    >
                      {/* Number Badge */}
                      <div
                        className={` shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-500 ${
                          isOpen ? "scale-110 rotate-6" : ""
                        }`}
                        style={{
                          background: isOpen
                            ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
                            : "rgba(255, 255, 255, 0.05)",
                          color: isOpen ? "#0f172b" : accentColor,
                          boxShadow: isOpen
                            ? `0 10px 30px ${accentColor}40`
                            : "none",
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* Question Text */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm  md:text-xl font-bold transition-colors duration-300 ${
                            isOpen
                              ? "text-white"
                              : "text-gray-300 group-hover/btn:text-white"
                          }`}
                        >
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <span
                            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${accentColor}20`,
                              color: accentColor,
                            }}
                          >
                            {faq.category}
                          </span>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <div className=" shrink-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isOpen ? "bg-white/10" : "bg-transparent"
                          }`}
                        >
                          <FiChevronDown
                            className={`text-2xl transition-all duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            style={{
                              color: isOpen
                                ? accentColor
                                : "rgb(156, 163, 175)",
                            }}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Answer - Simplified toggle without maxHeight transition */}
                    {isOpen && (
                      <div className="px-6 lg:px-7 pb-6 lg:pb-7 pt-0">
                        <div className="pl-0 lg:pl-17">
                          {/* Divider */}
                          <div
                            className="h-px mb-5 rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
                            }}
                          ></div>

                          {/* Answer Text */}
                          <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 text-sm lg:text-lg leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>

                          {/* Helpful Badge */}
                          <div className="mt-6 flex items-center gap-2">
                            <div
                              className="flex items-center gap-2 px-4 py-2 rounded-lg"
                              style={{
                                backgroundColor: `${accentColor}15`,
                                border: `1px solid ${accentColor}30`,
                              }}
                            >
                              <FiCheck
                                className="text-base"
                                style={{ color: accentColor }}
                              />
                              <span
                                className="text-sm font-semibold"
                                style={{ color: accentColor }}
                              >
                                Hope this helps!
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // No Results
          <div className="text-center py-16">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                border: `2px solid ${accentColor}30`,
              }}
            >
              <FiSearch className="text-3xl" style={{ color: accentColor }} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">
              No Results Found
            </h3>
            <p className="text-gray-400 mb-6">
              We couldn't find any questions matching "
              <span className="font-semibold" style={{ color: accentColor }}>
                {searchQuery}
              </span>
              "
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                boxShadow: `0 10px 30px ${accentColor}30`,
              }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Still have questions? CTA */}
        {filteredFAQs.length > 0 && (
          <div className="mt-16 text-center">
            <div
              className="inline-block p-8 lg:p-10 rounded-3xl border"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-xl md:text-3xl font-black text-white mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-400 mb-6">
                Can't find the answer you're looking for? Please get in touch
                with our team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+442030111198"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    boxShadow: `0 10px 30px ${accentColor}30`,
                  }}
                >
                  <FiHelpCircle className="text-xl" />
                  Call Us Now
                </a>
                <Link
                  href="/contact-us"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white border transition-all duration-300 hover:bg-white/10"
                  style={{
                    borderColor: `${accentColor}40`,
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
