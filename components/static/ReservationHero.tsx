"use client";
import { useRef } from "react";
import ReservationForm from "@/components/global/ReservationForm";

export default function ReservationHero({
  onBookNow,
}: {
  onBookNow?: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center pb-8 sm:pb-12 lg:pb-0 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover brightness-50 blur-[1px] pointer-events-none"
          >
            <source src="https://svh-bucket-s3.s3.eu-west-2.amazonaws.com/videos/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 0   lg:mt-0">
          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-white space-y-4 lg:space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Success Van Hire
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#fe9a00]">
                RESERVATION
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed">
                Success Van Hire offers affordable van rental services in
                London, providing reliable options for individuals, businesses,
                and movers alike. Whether you're relocating, or simply need a
                larger vehicle for a few days, our wide range of vans ensures
                you'll find the perfect fit.
              </p>
            </div>

            {/* Right: Form with Grid 2 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 lg:p-8 shadow-2xl">
              <ReservationForm isInline={false} onBookNow={onBookNow} />
            </div>
          </div>

          {/* Mobile: Stacked Layout */}
          <div className="md:hidden space-y-6 sm:space-y-8">
            <div className="text-white text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                Success Van Hire
              </h1>
              <h2 className="text-lg sm:text-xl font-semibold text-[#fe9a00] mb-4 sm:mb-6">
                RESERVATION
              </h2>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Success Van Hire offers affordable van rental services in
                London, providing reliable options for individuals, businesses,
                and movers alike. Whether you're relocating, or simply need a
                larger vehicle for a few days, our wide range of vans ensures
                you'll find the perfect fit.
              </p>
            </div>

            {/* Form Below Text - Mobile */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <ReservationForm isModal={false} onBookNow={onBookNow} />
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
