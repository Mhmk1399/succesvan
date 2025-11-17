"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { BsSpeedometer, BsPeople, BsGear } from "react-icons/bs";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const vansData = [
  {
    id: 1,
    name: "Mercedes Sprinter",
    tagline: "Luxury Redefined",
    description:
      "Experience ultimate comfort with our premium Mercedes Sprinter, perfect for executive travel and special events.",
    image: "/assets/images/van.png",
    price: "£150",
    features: [
      { icon: BsPeople, label: "12 Passengers" },
      { icon: MdAirlineSeatReclineExtra, label: "Luxury Seats" },
      { icon: BsGear, label: "Auto Transmission" },
      { icon: BsSpeedometer, label: "Climate Control" },
    ],
    color: "#fe9a00",
    gradient: "from-amber-500 to-[#fe9a00]",
  },
  {
    id: 2,
    name: "Ford Transit Custom",
    tagline: "Power & Performance",
    description:
      "Reliable and spacious, ideal for group travel, airport transfers, and corporate events with superior comfort.",
    image: "/assets/images/van.png",
    price: "£120",
    features: [
      { icon: BsPeople, label: "9 Passengers" },
      { icon: MdAirlineSeatReclineExtra, label: "Comfort Seats" },
      { icon: BsGear, label: "Manual/Auto" },
      { icon: BsSpeedometer, label: "GPS Navigation" },
    ],
    color: "#ff8800",
    gradient: "from-amber-500 to-[#fe9a00]",
  },
  {
    id: 3,
    name: "VW Transporter",
    tagline: "Versatile Excellence",
    description:
      "Perfect blend of style and functionality, designed for both business and leisure with premium amenities.",
    image: "/assets/images/van.png",
    price: "£110",
    features: [
      { icon: BsPeople, label: "8 Passengers" },
      { icon: MdAirlineSeatReclineExtra, label: "Premium Seats" },
      { icon: BsGear, label: "Auto Transmission" },
      { icon: BsSpeedometer, label: "Cruise Control" },
    ],
    color: "#ffa500",
    gradient: "from-amber-500 to-[#fe9a00]",
  },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const isAnimatingRef = useRef(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const vanImageRef = useRef<HTMLDivElement>(null);
  const vanContentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const roadLinesRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-background", {
        scale: 1.1,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      animateVanEntrance(true);

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(".hero-background", {
            y: self.progress * 150,
            ease: "none",
          });
        },
      });

      const shadowTl = gsap.timeline({
        repeat: -1,
        ease: "none",
      });
      shadowTl
        .to(shadowRef.current, {
          scaleX: 0.92,
          opacity: 0.3,
          duration: 1.5,
          ease: "sine.inOut",
        })
        .to(shadowRef.current, {
          scaleX: 1,
          opacity: 0.5,
          duration: 1.5,
          ease: "sine.inOut",
        })
        .to(shadowRef.current, {
          scaleX: 0.96,
          opacity: 0.4,
          duration: 1.2,
          ease: "sine.inOut",
        });

      gsap.to(roadLinesRef.current?.children || [], {
        x: -100,
        repeat: -1,
        duration: 3,
        ease: "none",
        stagger: 0.05,
      });

      gsap.to(glowRef.current, {
        scale: 1.08,
        opacity: 0.75,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((particle, i) => {
          gsap.to(particle, {
            x: -200 - Math.random() * 100,
            opacity: 0,
            duration: 0.8 + Math.random() * 0.8,
            repeat: -1,
            delay: i * 0.08,
            ease: "power1.out",
          });
        });
      }
    }, heroRef);

    startAutoPlay();

    return () => {
      ctx.revert();
      stopAutoPlay();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 100 / 40;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const animateVanEntrance = (isInitial = false) => {
    setProgress(0);
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    if (vanImageRef.current) {
      gsap.set(vanImageRef.current, {
        x: 1400,
        opacity: 0,
        rotation: 3,
        scale: 0.9,
      });

      tl.to(
        vanImageRef.current,
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0
      );
    }

    if (glowRef.current) {
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 0.7, scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      );
    }

    if (shadowRef.current) {
      tl.fromTo(
        shadowRef.current,
        { opacity: 0, scaleX: 0.6 },
        { opacity: 0.5, scaleX: 1, duration: 0.6, ease: "power2.out" },
        "-=0.6"
      );
    }

    if (roadLinesRef.current) {
      tl.fromTo(
        roadLinesRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.5"
      );
    }

    if (particlesRef.current) {
      tl.fromTo(
        particlesRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        "-=0.4"
      );
    }

    if (vanContentRef.current) {
      tl.fromTo(
        vanContentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.15, ease: "power2.out" },
        "-=0.3"
      );
    }
  };

  const changeVan = (direction: "next" | "prev") => {
    if (isAnimatingRef.current) return;

    stopAutoPlay();

    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % vansData.length
        : (currentIndex - 1 + vansData.length) % vansData.length;

    const exitTl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        updateVanData(newIndex);
        animateVanEntrance();
        startAutoPlay();
      },
    });

    if (vanImageRef.current) {
      exitTl.to(vanImageRef.current, {
        x: -1400,
        opacity: 0,
        rotation: -3,
        scale: 0.9,
        duration: 0.6,
        ease: "power3.in",
      });
    }

    if (vanContentRef.current) {
      exitTl.to(
        vanContentRef.current,
        { opacity: 0, duration: 0.15, ease: "power2.in" },
        "-=0.3"
      );
    }

    if (glowRef.current && shadowRef.current && roadLinesRef.current) {
      exitTl.to(
        [
          glowRef.current,
          shadowRef.current,
          roadLinesRef.current,
          particlesRef.current,
        ],
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        "-=0.4"
      );
    }
  };

  const updateVanData = (index: number) => {
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at center, ${vansData[index].color}70 0%, ${vansData[index].color}40 40%, transparent 70%)`;
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      changeVan("next");
    }, 4000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) changeVan("next");
    if (isRightSwipe) changeVan("prev");
  };

  const handleNext = () => changeVan("next");
  const handlePrev = () => changeVan("prev");

  const handleDotClick = (index: number) => {
    if (index === currentIndex || isAnimatingRef.current) return;

    stopAutoPlay();

    const exitTl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(index);
        updateVanData(index);
        animateVanEntrance();
        startAutoPlay();
      },
    });

    if (vanImageRef.current) {
      exitTl.to(vanImageRef.current, {
        x: -1400,
        opacity: 0,
        rotation: -3,
        scale: 0.9,
        duration: 0.6,
        ease: "power3.in",
      });
    }

    if (vanContentRef.current) {
      exitTl.to(vanContentRef.current, { opacity: 0, duration: 0.15 }, "-=0.3");
    }

    if (glowRef.current && shadowRef.current) {
      exitTl.to(
        [
          glowRef.current,
          shadowRef.current,
          roadLinesRef.current,
          particlesRef.current,
        ],
        { opacity: 0, duration: 0.3 },
        "-=0.4"
      );
    }
  };

  const currentVan = vansData[currentIndex];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#0f172b]"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced Background */}
      <div className="hero-background absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl animate-pulse-slower"></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* LEFT SIDE - Text Content */}
            <div className="lg:col-span-6 order-2 lg:order-1 z-10">
              <div ref={vanContentRef} className="space-y-2 md:space-y-4">
                {/* Van Name */}
                <div>
                  <h2 className="text-3xl lg:text-5xl  font-black text-white leading-tight tracking-tight">
                    {currentVan.name}
                  </h2>
                  <div
                    className="h-1.5 w-20 hidden md:block  rounded-full shadow-glow"
                    style={{
                      background: `linear-gradient(90deg, ${currentVan.color}, transparent)`,
                      boxShadow: `0 0 15px ${currentVan.color}60`,
                    }}
                  ></div>
                </div>

                {/* Tagline */}
                <p
                  className="text-base  lg:text-lg font-bold"
                  style={{ color: currentVan.color }}
                >
                  {currentVan.tagline}
                </p>

                {/* Description */}
                <p className="text-gray-400 text-sm   lg:text-base leading-relaxed max-w-xl">
                  {currentVan.description}
                </p>

                {/* Price & CTA */}

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 sm:hidden">
                  <div className="relative">
                    <div className="text-gray-500 text-xs font-semibold mb-1 tracking-wide uppercase">
                      Starting from
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl   lg:text-5xl font-black text-white">
                        {currentVan.price}
                      </span>
                      <span className="text-lg text-gray-400 font-semibold">
                        /day
                      </span>
                    </div>
                    {/* Price glow */}
                    <div
                      className="absolute -inset-2 bg-linear-to-r opacity-20 blur-2xl -z-10"
                      style={{
                        background: `radial-gradient(circle, ${currentVan.color}60, transparent)`,
                      }}
                    ></div>
                  </div>

                  <div className="sm:ml-auto w-full sm:w-auto">
                    <button
                      className={`group relative w-full sm:w-auto px-6   py-3   bg-linear-to-r ${currentVan.gradient} text-white font-bold text-base lg:text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl`}
                      style={{
                        boxShadow: `0 10px 40px ${currentVan.color}50`,
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Book Now
                        <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      {/* Shine effect */}
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    </button>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  {currentVan.features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="group relative overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 p-2.5 lg:p-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 relative z-10">
                          <div
                            className="w-8 h-8 flex items-center justify-center rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${currentVan.color}, ${currentVan.color}dd)`,
                              boxShadow: `0 4px 15px ${currentVan.color}40`,
                            }}
                          >
                            <Icon className="text-slate-900 text-base" />
                          </div>
                          <span className="text-white font-semibold text-xs  ">
                            {feature.label}
                          </span>
                        </div>
                        {/* Hover glow effect */}
                        <div
                          className="absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-xl"
                          style={{
                            background: `radial-gradient(circle at center, ${currentVan.color}, transparent)`,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>

                {/* Price & CTA */}
                <div className="sm:flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 hidden">
                  <div className="relative">
                    <div className="text-gray-500 text-xs font-semibold mb-1 tracking-wide uppercase">
                      Starting from
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl   lg:text-5xl font-black text-white">
                        {currentVan.price}
                      </span>
                      <span className="text-lg text-gray-400 font-semibold">
                        /day
                      </span>
                    </div>
                    {/* Price glow */}
                    <div
                      className="absolute -inset-2 bg-linear-to-r opacity-20 blur-2xl -z-10"
                      style={{
                        background: `radial-gradient(circle, ${currentVan.color}60, transparent)`,
                      }}
                    ></div>
                  </div>

                  <div className="sm:ml-auto w-full sm:w-auto">
                    <button
                      className={`group relative w-full sm:w-auto px-6   py-3   bg-linear-to-r ${currentVan.gradient} text-white font-bold text-base lg:text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl`}
                      style={{
                        boxShadow: `0 10px 40px ${currentVan.color}50`,
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Book Now
                        <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      {/* Shine effect */}
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Van Image */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative">
              <div className="relative perspective-1000">
                {/* Glow Effect */}
                <div
                  ref={glowRef}
                  className="absolute inset-0 -z-10 blur-3xl transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle at center, ${currentVan.color}70 0%, ${currentVan.color}40 40%, transparent 70%)`,
                  }}
                ></div>

                {/* Speed Particles */}
                <div
                  ref={particlesRef}
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        background: currentVan.color,
                        top: `${20 + i * 8}%`,
                        right: "10%",
                        opacity: 0.6,
                        boxShadow: `0 0 10px ${currentVan.color}`,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Van Container */}
                <div
                  ref={vanImageRef}
                  className="relative will-change-transform transform-gpu"
                  style={{ transformOrigin: "center center" }}
                >
                  {/* Van Image */}
                  <div className="relative w-[85%] sm:w-[80%] mx-auto aspect-square">
                    <Image
                      src={currentVan.image}
                      alt={currentVan.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      quality={100}
                    />

                    {/* Image glow */}
                    <div
                      className="absolute inset-0 opacity-30 blur-2xl -z-10"
                      style={{
                        background: `radial-gradient(circle at center, ${currentVan.color}80, transparent 60%)`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Enhanced Shadow */}
                <div
                  ref={shadowRef}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-6 rounded-full blur-xl -z-20 opacity-50"
                  style={{
                    background: `radial-gradient(ellipse, ${currentVan.color}40, transparent 70%)`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons with Glassmorphism */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 cursor-pointer lg:left-8 top-1/4 md:top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center  rounded-full text-white  hover:border-transparent transition-all duration-300 group hover:scale-110 active:scale-95 shadow-xl"
        aria-label="Previous van"
      >
        <HiArrowLeft className="text-lg sm:text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-300" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-6 cursor-pointer lg:right-8 top-1/4 md:top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center  rounded-full text-white  hover:border-transparent transition-all duration-300 group hover:scale-110 active:scale-95 shadow-xl"
        aria-label="Next van"
      >
        <HiArrowRight className="text-lg sm:text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.08);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes dash-move {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(-200px);
            opacity: 0;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .perspective-500 {
          perspective: 500px;
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        html {
          scroll-behavior: smooth;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        button,
        a {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .will-change-transform {
            will-change: transform, opacity;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #fe9a00, #ff8800);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff8800, #fe9a00);
        }
      `}</style>
    </section>
  );
}
