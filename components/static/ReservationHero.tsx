"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import ReservationForm from "@/components/global/ReservationForm";

export default function ReservationHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Search Bar */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 z-9999 bg-[#0f172b]/20 backdrop-blur-2xl shadow-2xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
            <div className="group cursor-pointer">
              <Link href="/">
                <Image
                  src="/assets/images/logo.png"
                  alt="SuccessVan Logo"
                  width={80}
                  height={50}
                  className="h-8 sm:h-10 w-20 sm:w-24 group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="px-4 sm:px-6 py-2 bg-linear-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg text-xs sm:text-sm"
              >
                {isFormOpen ? "Close" : "Reserve Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Form Modal */}

      {isFormOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-md sm:max-w-2xl lg:max-w-7xl bg-[#0f172b]/20 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-gray-900/50">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Complete Your Reservation
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-white hover:text-amber-400 transition-colors p-1"
                >
                  <FiX size={8} className="sm:size-8" />
                </button>
              </div>
              <ReservationForm
                isModal={true}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center pb-8 sm:pb-12 lg:pb-0 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover brightness-75 blur-xs"
          >
            <source src="/assets/videos/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16 sm:mt-20 md:mt-24 lg:mt-28">
          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            <div className="text-white text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 leading-tight">
                Success Van Hire
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#fe9a00] mb-4 sm:mb-6">
                RESERVATION
              </h2>
              <p className="md:text-lg text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl mx-auto sm:mx-0">
                Success Van Hire offers affordable van rental services in
                London, providing reliable options for individuals, businesses,
                and movers alike. Whether you're relocating, delivering goods,
                or simply need a larger vehicle for a few days, our wide range
                of vans ensures you'll find the perfect fit.
              </p>
            </div>

            {/* Inline Form */}
            <div className="hidden md:block">
              <ReservationForm isInline={true} />
            </div>

            {/* Form Below Text - Mobile */}
            <div className="md:hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <ReservationForm isModal={false} />
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
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
          background-color: #1e293b !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.75rem !important;
          font-size: 0.875rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          min-width: 280px;
        }
        .react-datepicker__header {
          background-color: #0f172b !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
          padding: 0.75rem;
          border-radius: 0.75rem 0.75rem 0 0 !important;
        }
        .react-datepicker__current-month {
          color: white !important;
          font-size: 1rem;
          font-weight: 600;
        }
        .react-datepicker__month {
          margin: 0.5rem;
          border-radius: 0.5rem;
        }
        .react-datepicker__day-names {
          margin-bottom: 0.5rem;
        }
        .react-datepicker__day-name {
          color: #fbbf24 !important;
          width: 2rem;
          line-height: 2rem;
          font-weight: 500;
          font-size: 0.75rem;
        }
        .react-datepicker__day {
          color: white !important;
          width: 2rem;
          line-height: 2rem;
          border-radius: 0.5rem;
          margin: 0.125rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .react-datepicker__day:hover {
          background-color: #fbbf24 !important;
          color: #1e293b !important;
          transform: scale(1.05);
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-selecting-range,
        .react-datepicker__day--in-range {
          background-color: #fbbf24 !important;
          color: #1e293b !important;
          font-weight: bold;
        }
        .react-datepicker__day--today {
          background-color: rgba(251, 191, 36, 0.2) !important;
          font-weight: bold;
        }
        .react-datepicker__navigation {
          top: 0.75rem;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #fbbf24 !important;
          border-width: 2px;
          width: 8px;
          height: 8px;
        }
        .react-datepicker__navigation-icon:hover::before {
          border-color: #f59e0b !important;
        }

        input[type="time"] {
          color-scheme: dark;
        }
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(1.2);
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .react-datepicker {
            min-width: 100% !important;
            max-width: 320px;
          }
          .react-datepicker__day {
            width: 1.75rem;
            line-height: 1.75rem;
            font-size: 0.875rem;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .react-datepicker__day {
            padding: 0.5rem;
            min-height: 44px;
          }
        }
      `}</style>
    </>
  );
}
