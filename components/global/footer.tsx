"use client";

import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiHome,
  FiMessageCircle,
  FiInfo,
  FiHelpCircle,
  FiFileText,
  FiHeart,
} from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuLinks = [
  { name: "HOME", href: "/", icon: FiHome },
  { name: "CONTACTS", href: "/contact-us", icon: FiMessageCircle },
  { name: "ABOUT", href: "/aboutus", icon: FiInfo },
  { name: "BLOGS", href: "/blog", icon: FiHelpCircle },
  {
    name: "TERMS & CONDITIONS",
    href: "/terms-and-conditions",
    icon: FiFileText,
  },
  { name: "POLICY", href: "/policy", icon: FiFileText },
];

const socialLinks = [
  {
    name: "Facebook",
    icon: FaFacebook,
    href: "https://www.facebook.com/topvanhire",
    color: "#1877F2", // آبی رسمی فیسبوک
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/success.van.hire",
    color: "#E4405F", // صورتی-قرمز رسمی اینستاگرام
  },
  {
    name: "X",
    icon: FaXTwitter,
    href: "https://twitter.com/MatinDiba?t=GKR1BWNSQK6yB2Rj4W5Jhg&s=09",
    color: "#ffffff", // سیاه رسمی X (Twitter جدید)
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    href: "https://youtube.com/channel/UCTSPTUFbkBJSHu5oLiXTJAQ",
    color: "#FF0000", // قرمز رسمی یوتیوب
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    href: "https://api.whatsapp.com/send/?phone=447915193000&text=Hello%2C+I+need+help%21&type=phone_number&app_absent=0",
    color: "#25D366", // سبز رسمی واتساپ
  },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on specific routes
  if (
    pathname === "/terms-and-conditions" ||
    pathname === "/register" ||
    pathname === "/dashboard" ||
    pathname === "/customerDashboard"
  ) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0f172b] overflow-hidden border-t border-[#ffffff]/10">
      {/* Animated SVG Van Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <svg
          viewBox="0 0 1000 600"
          className="absolute bottom-0 right-0 w-[140%] md:w-full lg:w-4/5 xl:w-3/4 h-auto opacity-40 md:opacity-50"
          preserveAspectRatio="xMaxYMax meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient
              id="vanBodyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#fe9a00", stopOpacity: 0.85 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "#fe9a00", stopOpacity: 0.6 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#d97900", stopOpacity: 0.35 }}
              />
            </linearGradient>

            <linearGradient id="vanAccent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#fe9a00", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#fe9a00", stopOpacity: 0.4 }}
              />
            </linearGradient>

            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#020617", stopOpacity: 1 }}
              />
              <stop
                offset="70%"
                style={{ stopColor: "#0f172a", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#020617", stopOpacity: 1 }}
              />
            </radialGradient>

            {/* Filters */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Slight floating motion for the whole van */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 -5; 0 0"
              dur="6s"
              repeatCount="indefinite"
            />

            <g transform="translate(150, 200)">
              {/* Main Van Body */}
              <g filter="url(#glow)">
                {/* Cargo Area */}
                <rect
                  x="80"
                  y="80"
                  width="500"
                  height="200"
                  rx="20"
                  fill="url(#vanBodyGradient)"
                  stroke="#fe9a00"
                  strokeWidth="4"
                  opacity="0.95"
                />

                {/* Front Cabin */}
                <path
                  d="M 580 120 L 655 140 L 655 260 L 580 280 Z"
                  fill="url(#vanBodyGradient)"
                  stroke="#fe9a00"
                  strokeWidth="4"
                  opacity="0.95"
                />

                {/* Cabin Roof */}
                <path
                  d="M 580 120 L 620 98 L 660 108 L 655 140 Z"
                  fill="url(#vanAccent)"
                  stroke="#fe9a00"
                  strokeWidth="3"
                />

                {/* Windows */}
                <g opacity="0.75">
                  {/* Front window */}
                  <path
                    d="M 592 150 L 635 160 L 635 240 L 592 250 Z"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />

                  {/* Side windows */}
                  <rect
                    x="120"
                    y="90"
                    width="90"
                    height="50"
                    rx="6"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />
                  <rect
                    x="230"
                    y="90"
                    width="100"
                    height="50"
                    rx="6"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />
                  <rect
                    x="350"
                    y="90"
                    width="100"
                    height="50"
                    rx="6"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />
                  <rect
                    x="470"
                    y="90"
                    width="90"
                    height="50"
                    rx="6"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />
                </g>

                {/* Door Lines */}
                <g stroke="#fe9a00" strokeWidth="3" opacity="0.35">
                  <line x1="330" y1="120" x2="330" y2="280" />
                  <line x1="450" y1="120" x2="450" y2="280" />
                </g>

                {/* Door Handles */}
                <g fill="#fe9a00">
                  <rect
                    x="320"
                    y="180"
                    width="22"
                    height="6"
                    rx="3"
                    opacity="0.9"
                  />
                  <rect
                    x="440"
                    y="180"
                    width="22"
                    height="6"
                    rx="3"
                    opacity="0.9"
                  />
                </g>

                {/* Side Mirror */}
                <g>
                  <rect
                    x="75"
                    y="150"
                    width="10"
                    height="25"
                    rx="3"
                    fill="url(#vanAccent)"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="72"
                    cy="162"
                    rx="8"
                    ry="12"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                </g>

                {/* Headlights */}
                <g>
                  <ellipse
                    cx="650"
                    cy="270"
                    rx="12"
                    ry="20"
                    fill="#fe9a00"
                    opacity="0.95"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.6;1;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </ellipse>
                  <ellipse
                    cx="650"
                    cy="230"
                    rx="10"
                    ry="16"
                    fill="#fe9a00"
                    opacity="0.7"
                  />
                </g>

                {/* Company Branding on Side */}
                <g>
                  <text
                    x="300"
                    y="170"
                    fontSize="40"
                    fill="#0f172a"
                    fontWeight="900"
                    textAnchor="middle"
                    letterSpacing="3"
                    style={{
                      paintOrder: "stroke",
                      stroke: "#fe9a00",
                      strokeWidth: 0.7,
                    }}
                  >
                    SUCCESS
                  </text>
                  <text
                    x="300"
                    y="210"
                    fontSize="26"
                    fill="#0f172a"
                    textAnchor="middle"
                    opacity="0.9"
                    letterSpacing="4"
                    style={{
                      paintOrder: "stroke",
                      stroke: "#fe9a00",
                      strokeWidth: 0.6,
                    }}
                  >
                    VAN HIRE
                  </text>

                  {/* Decorative lines */}
                  <line
                    x1="200"
                    y1="225"
                    x2="400"
                    y2="225"
                    stroke="#fe9a00"
                    strokeWidth="2"
                    opacity="0.45"
                  />
                  <circle
                    cx="300"
                    cy="240"
                    r="8"
                    fill="none"
                    stroke="#fe9a00"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </g>

                {/* Bumpers */}
                <rect
                  x="70"
                  y="265"
                  width="22"
                  height="15"
                  rx="4"
                  fill="#fe9a00"
                  opacity="0.7"
                />
                <rect
                  x="650"
                  y="255"
                  width="18"
                  height="25"
                  rx="4"
                  fill="#fe9a00"
                  opacity="0.75"
                />

                {/* Undercarriage */}
                <rect
                  x="80"
                  y="280"
                  width="590"
                  height="8"
                  rx="4"
                  fill="#020617"
                  opacity="0.6"
                />
              </g>

              {/* Wheels */}
              <g>
                {/* Front Wheel */}
                <g>
                  <circle
                    cx="180"
                    cy="300"
                    r="40"
                    fill="url(#wheelGradient)"
                    stroke="#fe9a00"
                    strokeWidth="5"
                  />
                  <circle
                    cx="180"
                    cy="300"
                    r="28"
                    fill="none"
                    stroke="#fe9a00"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                  <circle
                    cx="180"
                    cy="300"
                    r="15"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />
                  {/* Wheel spokes */}
                  <g stroke="#fe9a00" strokeWidth="2" opacity="0.55">
                    <line x1="180" y1="272" x2="180" y2="328" />
                    <line x1="152" y1="300" x2="208" y2="300" />
                    <line x1="160" y1="280" x2="200" y2="320" />
                    <line x1="200" y1="280" x2="160" y2="320" />
                  </g>
                  {/* Wheel rotation animation */}
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 180 300"
                    to="360 180 300"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </g>

                {/* Rear Wheel */}
                <g>
                  <circle
                    cx="520"
                    cy="300"
                    r="40"
                    fill="url(#wheelGradient)"
                    stroke="#fe9a00"
                    strokeWidth="5"
                  />
                  <circle
                    cx="520"
                    cy="300"
                    r="28"
                    fill="none"
                    stroke="#fe9a00"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                  <circle
                    cx="520"
                    cy="300"
                    r="15"
                    fill="#020617"
                    stroke="#fe9a00"
                    strokeWidth="2"
                  />
                  {/* Wheel spokes */}
                  <g stroke="#fe9a00" strokeWidth="2" opacity="0.55">
                    <line x1="520" y1="272" x2="520" y2="328" />
                    <line x1="492" y1="300" x2="548" y2="300" />
                    <line x1="500" y1="280" x2="540" y2="320" />
                    <line x1="540" y1="280" x2="500" y2="320" />
                  </g>
                  {/* Wheel rotation animation */}
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 520 300"
                    to="360 520 300"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </g>
              </g>

              {/* Exhaust Smoke */}
              <g opacity="0.3">
                {[0, 1, 2].map((i) => (
                  <circle key={i} cx="95" cy="280" r="8" fill="#fe9a00">
                    <animate
                      attributeName="cy"
                      from="280"
                      to="220"
                      dur="3s"
                      begin={`${i * 0.7}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="3s"
                      begin={`${i * 0.7}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="r"
                      from="8"
                      to="18"
                      dur="3s"
                      begin={`${i * 0.7}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </g>

              {/* Speed Lines */}
              <g
                stroke="#fe9a00"
                strokeWidth="3"
                opacity="0.2"
                strokeLinecap="round"
              >
                <line x1="30" y1="150" x2="60" y2="150">
                  <animate
                    attributeName="x1"
                    from="30"
                    to="-20"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    from="60"
                    to="10"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </line>
                <line x1="20" y1="200" x2="50" y2="200">
                  <animate
                    attributeName="x1"
                    from="20"
                    to="-30"
                    dur="1.3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    from="50"
                    to="0"
                    dur="1.3s"
                    repeatCount="indefinite"
                  />
                </line>
                <line x1="25" y1="250" x2="55" y2="250">
                  <animate
                    attributeName="x1"
                    from="25"
                    to="-25"
                    dur="1.7s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    from="55"
                    to="5"
                    dur="1.7s"
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            </g>
          </g>

          {/* Road */}
          <g opacity="0.25">
            <line
              x1="0"
              y1="500"
              x2="1000"
              y2="500"
              stroke="#fe9a00"
              strokeWidth="3"
              strokeDasharray="30,15"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="45"
                dur="1s"
                repeatCount="indefinite"
              />
            </line>
          </g>
        </svg>

        {/* Additional decorative elements */}
        <div className="absolute top-16 left-10 w-3 h-3 rounded-full bg-[#fe9a00] opacity-40 animate-pulse" />
        <div className="absolute top-40 right-1/4 w-2 h-2 rounded-full bg-[#fe9a00] opacity-30 animate-pulse delay-500" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-[#fe9a00] opacity-40 animate-pulse delay-1000" />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-[#020617]/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-[#020617]" />

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-2 pb-10 md:pb-14">
          {/* Top Section - Logo & CTA */}
          <div className="footer-reveal mb-12 md:mb-16 text-center">
            <Link
              href="/"
              className="inline-flex flex-col items-center group mb-2 md:mb-6"
            >
              <Image
                src="https://svh-bucket-s3.s3.eu-west-2.amazonaws.com/images/newww.png"
                alt="Success Van Hire"
                width={500}
                height={500}
                className="h-30 md:h-40 w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                priority
              />
              <span className="md:-mt-10 -mt-6 inline-flex items-center gap-2 rounded-full border border-[#fe9a00]/30 bg-black/20 px-4 py-1 text-[8px] uppercase tracking-[0.18em] text-[#fbbf24]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                Trusted Self-Drive Van & Minibus Hire in London
              </span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Clean, reliable vehicles. Transparent pricing. Easy online
              booking. Everything you need to keep your move or journey on
              track.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14 md:mb-16">
            {/* Contact Info */}
            <div className="footer-reveal">
              <h3 className="text-white text-lg md:text-xl font-black mb-5 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full" />
                CONTACT INFO
              </h3>
              <ul className="space-y-5">
                <li>
                  <a
                    href="tel:+442030111198"
                    className="group flex items-start gap-4 text-gray-400 hover:text-[#fe9a00] transition-all duration-300"
                  >
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#fe9a00]/15 group-hover:border-[#fe9a00]/60 transition-all duration-300 shrink-0">
                      <FiPhone className="text-[#fe9a00] text-lg group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="text-[10px] md:text-xs text-gray-500 mb-1 font-semibold uppercase tracking-[0.18em]">
                        Car Rental Office
                      </div>
                      <div className="font-bold text-sm md:text-base">
                        +44 20 3011 1198
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:Info@successvanhire.com"
                    className="group flex items-start gap-4 text-gray-400 hover:text-[#fe9a00] transition-all duration-300"
                  >
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#fe9a00]/15 group-hover:border-[#fe9a00]/60 transition-all duration-300 shrink-0">
                      <FiMail className="text-[#fe9a00] text-lg group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="text-[10px] md:text-xs text-gray-500 mb-1 font-semibold uppercase tracking-[0.18em]">
                        Email
                      </div>
                      <div className="font-bold text-sm md:text-base break-all">
                        Info@successvanhire.com
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div className="footer-reveal">
              <h3 className="text-white text-lg md:text-xl font-black mb-5 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full" />
                ADDRESS
              </h3>
              <div className="group">
                <div className="flex items-start gap-4 text-gray-400 group-hover:text-[#fe9a00] transition-colors duration-300">
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#fe9a00]/15 group-hover:border-[#fe9a00]/60 transition-all duration-300 shrink-0">
                    <FiMapPin className="text-[#fe9a00] text-lg" />
                  </div>
                  <div>
                    <div className="text-[10px] md:text-xs text-gray-500 mb-2 font-semibold uppercase tracking-[0.18em]">
                      Our Location
                    </div>
                    <address className="not-italic font-bold text-sm md:text-base leading-relaxed">
                      Strata House, Waterloo Road,
                      <br />
                      London, NW2 7UH
                    </address>
                    <a
                      href="https://maps.google.com/?q=Strata+House+Waterloo+Road+London+NW2+7UH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-[#fe9a00] text-xs md:text-sm font-semibold hover:gap-3 transition-all duration-300"
                    >
                      Get Directions
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Hours */}
            <div className="footer-reveal">
              <h3 className="text-white text-lg md:text-xl font-black mb-5 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full" />
                SERVICE HOURS
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <FiClock className="text-[#fe9a00] text-lg" />
                </div>
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
                    <span className="text-gray-400 font-semibold text-xs md:text-sm">
                      Monday - Friday
                    </span>
                    <span className="text-[#fe9a00] font-bold text-xs md:text-sm whitespace-nowrap">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
                    <span className="text-gray-400 font-semibold text-xs md:text-sm">
                      Saturday
                    </span>
                    <span className="text-[#fe9a00] font-bold text-xs md:text-sm whitespace-nowrap">
                      10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-400 font-semibold text-xs md:text-sm">
                      Sunday
                    </span>
                    <span className="text-red-400 font-bold text-xs md:text-sm">
                      Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-reveal">
              <h3 className="text-white text-lg md:text-xl font-black mb-5 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full" />
                QUICK LINKS
              </h3>
              <ul className="space-y-3">
                {menuLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`group flex items-center gap-3 text-gray-400 hover:text-[#fe9a00] transition-all duration-300 ${
                          isActive ? "text-[#fe9a00]" : ""
                        }`}
                      >
                        <Icon className="text-[#fe9a00] text-base opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                        <span className="font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        {isActive && (
                          <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-[#fe9a00]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="footer-reveal mb-10 md:mb-12">
            <div
              className="relative px-4 py-9 md:p-8 rounded-3xl border overflow-hidden"
              style={{
                background: "rgba(15, 23, 42, 0.5)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(254, 154, 0, 0.25)",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#fe9a00]/5 via-transparent to-[#fe9a00]/5" />

              <div className="relative text-center">
                <h3 className="text-white text-lg md:text-2xl font-black mb-2 md:mb-3">
                  Follow Us on Social Media
                </h3>
                <p className="text-gray-400 mb-6 text-xs md:text-sm">
                  Stay connected for the latest vehicle availability, offers,
                  and updates.
                </p>

                <div className="grid grid-cols-5 sm:grid-cols-5 items-center justify-center gap-4 md:gap-10 max-w-md mx-auto">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-110 hover:border-transparent hover:shadow-2xl"
                      style={{
                        background: `rgba(${parseInt(
                          social.color.slice(1, 3),
                          16
                        )}, ${parseInt(
                          social.color.slice(3, 5),
                          16
                        )}, ${parseInt(social.color.slice(5, 7), 16)}, 0.1)`,
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth > 640) {
                          // فقط در دسکتاپ (sm و بزرگتر)
                          e.currentTarget.style.background = `${social.color}30`;
                          e.currentTarget.style.boxShadow = `0 0 40px ${social.color}90`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth > 640) {
                          e.currentTarget.style.background = `rgba(${parseInt(
                            social.color.slice(1, 3),
                            16
                          )}, ${parseInt(
                            social.color.slice(3, 5),
                            16
                          )}, ${parseInt(social.color.slice(5, 7), 16)}, 0.1)`;
                          e.currentTarget.style.boxShadow =
                            "0 0 0 0 transparent";
                        }
                      }}
                    >
                      <social.icon
                        className="text-2xl sm:text-3xl text-center transition-colors duration-500"
                        style={{
                          color:
                            window.innerWidth <= 640 ? social.color : "#ffffff", // موبایل: رنگ اصلی، دسکتاپ: سفید (تا hover)
                        }}
                        onMouseEnter={(e) => {
                          if (window.innerWidth > 640) {
                            e.currentTarget.style.color = social.color;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (window.innerWidth > 640) {
                            e.currentTarget.style.color = "#ffffff";
                          }
                        }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider with Icon */}
          <div className="footer-reveal relative mb-6 md:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <div className="px-5 py-2.5 bg-[#020617] rounded-full border border-white/10 shadow-lg shadow-black/40">
                <svg
                  className="w-7 h-7 text-[#fe9a00]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-reveal">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center md:text-left">
              {/* Copyright */}
              <div className="text-gray-500 text-xs md:text-sm leading-relaxed">
                © {currentYear}{" "}
                <span className="text-[#fe9a00] font-bold">SuccessVanHire</span>
                , Inc.
                <br className="md:hidden" />
                <span className="hidden md:inline mx-2">•</span>
                <span>All rights reserved.</span>
              </div>
              <div className="mt-3 md:mt-0 md:ml-6 text-sm">
                <Link
                  href="/policy#cookie-settings"
                  className="text-gray-400 hover:text-[#fe9a00] font-semibold"
                >
                  Cookie settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </footer>
  );
}
