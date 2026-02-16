"use client";
import { useRef, useEffect, useState } from "react";
import ReservationForm from "@/components/global/ReservationForm";

export default function ReservationHero({
  onBookNow,
}: {
  onBookNow?: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 30,
        y: (clientY / innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/images/poster.png"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          >
            <source
              src="https://svh-bucket-s3.s3.eu-west-2.amazonaws.com/videos/video.mp4"
              type="video/mp4"
            />
          </video>

          {/* Multi-layer overlays */}
          <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />
        </div>

        {/* Liquid Orbs */}
        <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-125 h-125 rounded-full opacity-20 transition-transform duration-2000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`,
              background:
                "radial-linear(circle, rgba(254,154,0,0.4) 0%, rgba(254,154,0,0.1) 40%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute -bottom-40 -right-40 w-150 h-150 rounded-full opacity-15 transition-transform duration-2500 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
              background:
                "radial-linear(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-87.5 h-87.5 rounded-full opacity-10 transition-transform duration-1800 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.8}px, ${mousePosition.y * -0.8}px)`,
              background:
                "radial-linear(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.05) 50%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        {/* Noise Texture */}
        <div
          className="absolute inset-0 z-2 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Main Content */}
        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 lg:mt-0 pb-8 sm:pb-12 lg:pb-0 transition-all duration-500 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="text-white space-y-5 lg:space-y-7">
              {/* Badge */}
              <div
                className={`transition-all duration-300 delay-150 ${
                  isLoaded
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-4 blur-sm"
                }`}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase glass-badge">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Available Now
                </span>
              </div>

              {/* Heading */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl   font-bold leading-[1.1] tracking-tight transition-all duration-300 delay-200 ${
                  isLoaded
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-4 blur-sm"
                }`}
              >
                 <span className="block mt-1">
                 Success Van{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-[#fe9a00] via-[#ffb940] to-[#fe9a00]">
                      Hire
                    </span>
                    <span
                      className={`absolute -bottom-2 left-0 w-full h-3 bg-linear-to-r from-[#fe9a00]/30 to-[#fe9a00]/10 rounded-full blur-sm transition-transform duration-800 delay-1200 origin-left ${
                        isLoaded ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <h2
                className={`text-xl md:text-2xl  font-semibold transition-all duration-300 delay-250 ${
                  isLoaded
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-4 blur-sm"
                }`}
              >
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe9a00] to-[#ffcc66] tracking-widest">
                  RESERVATION
                </span>
              </h2>

              {/* Description */}
              <p
                className={`text-sm md:text-base lg:text-lg text-gray-300/90 leading-relaxed max-w-lg transition-all duration-300 delay-300 ${
                  isLoaded
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-4 blur-sm"
                }`}
              >
                Affordable van rental services in London, providing reliable
                options for individuals, businesses, and movers alike. Whether
                you&apos;re relocating or simply need a larger vehicle, our wide
                range of vans ensures you&apos;ll find the perfect fit.
              </p>

            
            </div>

            {/* Right: Glass Form */}
            <div
              className={`transition-all duration-500 delay-400 ${
                isLoaded
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 translate-x-8 scale-98"
              }`}
            >
              <div className="relative group">
                {/* Animated border glow */}

                {/* Shimmer sweep */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-10">
                  <div className="shimmer-sweep absolute top-0 left-0 w-1/3 h-full bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                </div>

                {/* Glass container */}
                <div className="relative glass-form-container backdrop-blur-lg rounded-3xl p-7 lg:p-9">
                  {/* Form header */}
                  <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#fe9a00] to-[#ff7b00] flex items-center justify-center shadow-lg shadow-[#fe9a00]/20">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Book Your Van
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Quick &amp; easy reservation
                      </p>
                    </div>
                  </div>

                  <ReservationForm isInline={false} onBookNow={onBookNow} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6 sm:space-y-8">
            <div className="text-white text-center">
              <h1
                className={`text-3xl sm:text-4xl font-bold mb-3 leading-tight tracking-tight transition-all duration-300 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                Success{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe9a00] via-[#ffb940] to-[#fe9a00]">
                  Van Hire
                </span>
              </h1>

              <h2
                className={`text-lg sm:text-xl font-semibold text-[#fe9a00] mb-4 tracking-widest transition-all duration-300 delay-200 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                RESERVATION
              </h2>

              <p
                className={`text-sm sm:text-base text-gray-300/90 leading-relaxed max-w-md mx-auto transition-all duration-300 delay-250 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                Affordable van rental services in London. Reliable options for
                individuals, businesses, and movers alike.
              </p>

           
            </div>

            {/* Mobile Form */}
            <div
              className={`transition-all duration-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-[0.98]"
              }`}
            >
              <div className="relative">
                <div className="relative glass-form-container  backdrop-blur-2xl rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                    <div className="w-9 h-9 rounded-lg bg-linear-to-br from-[#fe9a00] to-[#ff7b00] flex items-center justify-center shadow-lg shadow-[#fe9a00]/20">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base">
                        Book Your Van
                      </h3>
                      <p className="text-gray-400 text-[10px]">
                        Quick &amp; easy reservation
                      </p>
                    </div>
                  </div>
                  <ReservationForm isModal={false} onBookNow={onBookNow} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 to-transparent z-3 pointer-events-none" />
      </section>

      <style jsx global>{`
        /* Glass morphism */
        .glass-badge {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.9);
        }

        .glass-form-container {
          background: linear-linear(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.03) 50%,
            rgba(255, 255, 255, 0.06) 100%
          );
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        /* Shimmer animation */
        @keyframes shimmerSweep {
          0% {
            transform: translateX(-200%) skewX(-12deg);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateX(400%) skewX(-12deg);
            opacity: 0;
          }
        }

        .shimmer-sweep {
          animation: shimmerSweep 5s ease-in-out infinite;
          animation-delay: 2s;
        }

        /* Orb pulse */
        @keyframes orbPulse1 {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @keyframes orbPulse2 {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        /* React DatePicker */
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container {
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100% !important;
          padding-left: 2.5rem !important;
        }
        .react-datepicker-popper {
          z-index: 1000 !important;
        }
        .react-datepicker {
          background: linear-linear(
            135deg,
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.95) 100%
          ) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 1rem !important;
          font-size: 0.875rem;
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          min-width: 280px;
          overflow: hidden;
        }
        .react-datepicker__header {
          background: linear-linear(
            180deg,
            rgba(15, 23, 43, 0.9) 0%,
            rgba(15, 23, 43, 0.7) 100%
          ) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 0.875rem;
          border-radius: 1rem 1rem 0 0 !important;
        }
        .react-datepicker__current-month {
          color: white !important;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.025em;
        }
        .react-datepicker__month {
          margin: 0.5rem;
          border-radius: 0.5rem;
        }
        .react-datepicker__day-names {
          margin-bottom: 0.25rem;
        }
        .react-datepicker__day-name {
          color: #fe9a00 !important;
          width: 2.25rem;
          line-height: 2.25rem;
          font-weight: 600;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .react-datepicker__day {
          color: rgba(255, 255, 255, 0.9) !important;
          width: 2.25rem;
          line-height: 2.25rem;
          border-radius: 0.625rem;
          margin: 0.125rem;
          font-weight: 500;
          transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .react-datepicker__day:hover {
          background: linear-linear(
            135deg,
            #fe9a00 0%,
            #ffb940 100%
          ) !important;
          color: #1e293b !important;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(254, 154, 0, 0.4);
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-selecting-range,
        .react-datepicker__day--in-range {
          background: linear-linear(
            135deg,
            #fe9a00 0%,
            #ffb940 100%
          ) !important;
          color: #1e293b !important;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(254, 154, 0, 0.3);
        }
        .react-datepicker__day--today {
          background: rgba(254, 154, 0, 0.15) !important;
          font-weight: bold;
          border: 1px solid rgba(254, 154, 0, 0.3) !important;
        }
        .react-datepicker__day--disabled {
          color: rgba(255, 255, 255, 0.2) !important;
        }
        .react-datepicker__navigation {
          top: 0.875rem;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #fe9a00 !important;
          border-width: 2px;
          width: 8px;
          height: 8px;
        }
        .react-datepicker__navigation:hover
          .react-datepicker__navigation-icon::before {
          border-color: #ffb940 !important;
        }

        input[type="time"] {
          color-scheme: dark;
        }
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(1.2);
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        input[type="time"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .react-datepicker {
            min-width: 100% !important;
            max-width: 320px;
          }
          .react-datepicker__day {
            width: 2rem;
            line-height: 2rem;
            font-size: 0.875rem;
          }
          .react-datepicker__day-name {
            width: 2rem;
            line-height: 2rem;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .react-datepicker__day {
            padding: 0.5rem;
            min-height: 44px;
          }
        }

        .glass-form-container::-webkit-scrollbar {
          width: 4px;
        }
        .glass-form-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .glass-form-container::-webkit-scrollbar-thumb {
          background: rgba(254, 154, 0, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}
