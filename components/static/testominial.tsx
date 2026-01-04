"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { BsQuote } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { Testimonial, TestimonialsProps } from "@/types/type";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Default testimonials data
export const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sam Labban",
    message:
      "Extremely professional company and service. Would highly recommend to anyone looking to hire a commercial van.",
    rating: 5,
    location: "London",
  },
  {
    id: 2,
    name: "JC",
    message:
      "Had bad experiences in the past with bigger companies, but only good things to say about Mehdi and Success Van Hire. Thank you!",
    rating: 5,
    location: "London",
  },
  {
    id: 3,
    name: "Nick Young",
    message:
      "Success Van Hire went beyond all expectations to find me a van at short notice when I desperately needed it. They were super accommodating in an unusual situation.",
    rating: 5,
    location: "London",
  },
  {
    id: 4,
    name: "Denise Reeves",
    message:
      "Brilliant service. Clear communication, rapid response, including refunding deposit within 24 hours. Highly recommended Success for van hire.",
    rating: 5,
    location: "London",
  },
  {
    id: 5,
    name: "Gaur Varun",
    message:
      "Highly recommend good van, great and easy service with a competitive price. I will hire from these guys again. Thanks Mehdi for good service again Highly recommend you guys",
    rating: 5,
    location: "London",
  },
];

export default function Testimonials({
  testimonials = defaultTestimonials,
  layout = "carousel",
  autoPlay = true,
  autoPlayInterval = 5000,
  showRating = true,
  accentColor = "#fe9a00",
}: TestimonialsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [displayTestimonials, setDisplayTestimonials] = useState(testimonials);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (data.success) {
          const approved = data.data.filter(
            (t: any) => t.status === "approved"
          );
          if (approved.length > 0) {
            setDisplayTestimonials(
              approved.map((t: any) => ({
                id: t._id,
                name: t.name,
                message: t.message,
                rating: t.rating,
              }))
            );
          }
        }
      } catch (error) {
        console.log("Failed to fetch testimonials", error);
      }
    };
    fetchApprovedTestimonials();
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlaying && layout === "carousel") {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, displayTestimonials.length, autoPlayInterval, layout]);

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            once: true,
          },
        }
      );

      if (layout === "grid" || layout === "masonry") {
        gsap.utils.toArray(".testimonial-card").forEach((card: any, index) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
                once: true,
              },
              delay: index * 0.1,
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [layout]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + displayTestimonials.length) % displayTestimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0f172b] py-20  overflow-hidden"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="testimonial-header text-center mb-16 lg:mb-20">
          <h2 className="text-2xl   lg:text-7xl  font-black text-white mb-6 leading-tight">
            What Our Clients
            <br />
            <span style={{ color: accentColor }}>Say About Us</span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Render based on layout */}
        {layout === "carousel" && (
          <CarouselLayout
            testimonials={displayTestimonials}
            currentIndex={currentIndex}
            nextTestimonial={nextTestimonial}
            prevTestimonial={prevTestimonial}
            goToTestimonial={goToTestimonial}
            showRating={showRating}
            accentColor={accentColor}
          />
        )}

        {layout === "grid" && (
          <GridLayout
            testimonials={displayTestimonials}
            showRating={showRating}
            accentColor={accentColor}
          />
        )}

        {layout === "masonry" && (
          <MasonryLayout
            testimonials={displayTestimonials}
            showRating={showRating}
            accentColor={accentColor}
          />
        )}

        {/* Bottom CTA */}
        <div className="md:mt-20 mt-8 text-center">
          <p className="text-gray-400 text-lg mb-6">
            Want to share your experience with us?
          </p>
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-3 md:px-8 md:py-4 p-3 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              boxShadow: `0 20px 60px ${accentColor}40`,
            }}
          >
            Leave a Review
            <BsQuote className="text-xl" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Carousel Layout
function CarouselLayout({
  testimonials,
  currentIndex,
  nextTestimonial,
  prevTestimonial,
  goToTestimonial,
  showRating,
  accentColor,
}: any) {
  const current = testimonials[currentIndex];
  if (!current) return null;

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="max-w-5xl mx-auto">
        <div
          className="relative rounded-3xl backdrop-blur-xl border p-8 lg:p-12 transition-all duration-500"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderColor: `${accentColor}40`,
            boxShadow: `0 20px 60px ${accentColor}20`,
          }}
        >
          {/* Quote Icon */}
          <div
            className="absolute -top-6 left-8 w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            }}
          >
            <BsQuote className="text-xl md:text-3xl text-white" />
          </div>

          {/* Content */}
          <div className="mt-6">
            {/* Rating */}
            {showRating && (
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-2xl ${
                      i < current.rating ? "fill-current" : "fill-none"
                    }`}
                    style={{
                      color: i < current.rating ? accentColor : "#666",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Message */}
            <p className="text-gray-200 line-clamp-2  text-base lg:text-2xl  mb-8 italic">
              {current.message}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                }}
              >
                {current.image ? (
                  <Image
                    src={current.image}
                    alt={current.name}
                    width={64}
                    height={64}
                    className="rounded-2xl object-cover"
                  />
                ) : (
                  current.name.charAt(0)
                )}
              </div>

              <div>
                <h4 className="text-white font-black text-sm md:text-xl">
                  {current.name}
                </h4>
                {current.location && (
                  <p className="text-gray-400 text-xs md:text-sm">
                    {current.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Decorative gradient */}
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accentColor}, transparent)`,
            }}
          ></div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:translate-x-0 w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group"
        style={{
          boxShadow: `0 10px 30px ${accentColor}20`,
        }}
      >
        <FiChevronLeft className="text-2xl group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-0 w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group"
        style={{
          boxShadow: `0 10px 30px ${accentColor}20`,
        }}
      >
        <FiChevronRight className="text-2xl group-hover:translate-x-1 transition-transform duration-300" />
      </button>

      {/* Dots Navigation */}
      <div className="flex items-center justify-center gap-3 mt-12">
        {testimonials.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex ? "w-12 h-3" : "w-3 h-3 bg-white/20"
            }`}
            style={
              index === currentIndex
                ? {
                    background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
                    boxShadow: `0 0 20px ${accentColor}80`,
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

// Grid Layout
function GridLayout({ testimonials, showRating, accentColor }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {testimonials.map((testimonial: Testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          showRating={showRating}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}

// Masonry Layout
function MasonryLayout({ testimonials, showRating, accentColor }: any) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
      {testimonials.map((testimonial: Testimonial) => (
        <div key={testimonial.id} className="break-inside-avoid">
          <TestimonialCard
            testimonial={testimonial}
            showRating={showRating}
            accentColor={accentColor}
          />
        </div>
      ))}
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({
  testimonial,
  showRating,
  accentColor,
}: {
  testimonial: Testimonial;
  showRating: boolean;
  accentColor: string;
}) {
  return (
    <div className="testimonial-card group relative h-full">
      {/* Glow effect */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle, ${accentColor}40, transparent)`,
        }}
      ></div>

      {/* Card */}
      <div
        className="relative h-full rounded-2xl backdrop-blur-xl border p-6 lg:p-8 transition-all duration-300 group-hover:scale-105"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Quote Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
          style={{
            background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
            border: `1px solid ${accentColor}40`,
          }}
        >
          <BsQuote className="text-xl" style={{ color: accentColor }} />
        </div>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`text-lg ${
                  i < testimonial.rating ? "fill-current" : "fill-none"
                }`}
                style={{
                  color: i < testimonial.rating ? accentColor : "#666",
                }}
              />
            ))}
          </div>
        )}

        {/* Message */}
        <p className="text-gray-300 text-base line-clamp-3 leading-relaxed mb-6 italic">
          {testimonial.message}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white  shrink-0"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
            }}
          >
            {testimonial.image ? (
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="rounded-xl object-cover"
              />
            ) : (
              testimonial.name.charAt(0)
            )}
          </div>

          <div>
            <h4 className="text-white font-bold text-base">
              {testimonial.name}
            </h4>
            {testimonial.location && (
              <p className="text-gray-400 text-sm">{testimonial.location}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
