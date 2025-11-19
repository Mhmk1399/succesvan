"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiArrowUp,
  FiHome,
  FiMessageCircle,
  FiInfo,
  FiHelpCircle,
  FiFileText,
  FiHeart,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
];

const socialLinks = [
  {
    name: "Facebook",
    icon: FaFacebook,
    href: "https://facebook.com/successvanhire",
    color: "#1877f2",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://instagram.com/successvanhire",
    color: "#e4405f",
  },
  {
    name: "X",
    icon: FaXTwitter,
    href: "https://x.com/successvanhire",
    color: "#000000",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    href: "https://youtube.com/@successvanhire",
    color: "#ff0000",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    href: "https://github.com/successvanhire",
    color: "#333333",
  },
];

export default function Footer() {
  const pathName = usePathname();
  const footerRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<SVGSVGElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    const ctx = gsap.context(() => {
      // Animate van on scroll
      if (vanRef.current) {
        gsap.fromTo(
          vanRef.current,
          {
            x: -200,
            opacity: 0.2,
          },
          {
            x: 0,
            opacity: 0.5,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "top center",
              scrub: 1.5,
              once: true,
            },
          }
        );

        // Continuous floating animation
        gsap.to(vanRef.current, {
          y: -25,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Subtle rotation
        gsap.to(vanRef.current, {
          rotation: 2,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Animate footer sections
      gsap.utils.toArray(".footer-reveal").forEach((element: any, index) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });
    }, footerRef);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (pathName === "/terms-and-conditions" || pathName === "/register") {
    return null;
  }

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0f172b] overflow-hidden border-t border-[#fe9a00]/30"
    >
      {/* Animated SVG Van Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          ref={vanRef}
          viewBox="0 0 1000 600"
          className="absolute bottom-0 right-0 w-full lg:w-4/5 xl:w-3/4 h-auto opacity-50"
          style={{ maxWidth: "1400px" }}
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
                style={{ stopColor: "#fe9a00", stopOpacity: 0.7 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "#fe9a00", stopOpacity: 0.5 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#d97900", stopOpacity: 0.3 }}
              />
            </linearGradient>

            <linearGradient id="vanAccent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#fe9a00", stopOpacity: 0.9 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#fe9a00", stopOpacity: 0.4 }}
              />
            </linearGradient>

            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#0f172b", stopOpacity: 1 }}
              />
              <stop
                offset="70%"
                style={{ stopColor: "#1e293b", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#0f172b", stopOpacity: 1 }}
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

            <filter id="innerShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(150, 200)">
            {/* Main Van Body */}
            <g filter="url(#glow)">
              {/* Cargo Area */}
              <rect
                x="80"
                y="80"
                width="500"
                height="200"
                rx="15"
                fill="url(#vanBodyGradient)"
                stroke="#fe9a00"
                strokeWidth="4"
                opacity="0.9"
              />

              {/* Front Cabin */}
              <path
                d="M 580 120 L 650 140 L 650 260 L 580 280 Z"
                fill="url(#vanBodyGradient)"
                stroke="#fe9a00"
                strokeWidth="4"
                opacity="0.9"
              />

              {/* Cabin Roof */}
              <path
                d="M 580 120 L 620 100 L 650 110 L 650 140 Z"
                fill="url(#vanAccent)"
                stroke="#fe9a00"
                strokeWidth="3"
              />

              {/* Windows */}
              <g opacity="0.7">
                {/* Front window */}
                <path
                  d="M 590 150 L 630 160 L 630 240 L 590 250 Z"
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                />

                {/* Side windows */}
                <rect
                  x="120"
                  y="90"
                  width="90"
                  height="50"
                  rx="5"
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                />
                <rect
                  x="230"
                  y="90"
                  width="100"
                  height="50"
                  rx="5"
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                />
                <rect
                  x="350"
                  y="90"
                  width="100"
                  height="50"
                  rx="5"
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                />
                <rect
                  x="470"
                  y="90"
                  width="90"
                  height="50"
                  rx="5"
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                />
              </g>

              {/* Door Lines */}
              <g stroke="#fe9a00" strokeWidth="3" opacity="0.4">
                <line x1="330" y1="120" x2="330" y2="280" />
                <line x1="450" y1="120" x2="450" y2="280" />
              </g>

              {/* Door Handles */}
              <g fill="#fe9a00">
                <rect
                  x="320"
                  y="180"
                  width="20"
                  height="6"
                  rx="3"
                  opacity="0.8"
                />
                <rect
                  x="440"
                  y="180"
                  width="20"
                  height="6"
                  rx="3"
                  opacity="0.8"
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
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                  opacity="0.7"
                />
              </g>

              {/* Headlights */}
              <g>
                <ellipse
                  cx="645"
                  cy="270"
                  rx="12"
                  ry="20"
                  fill="#fe9a00"
                  opacity="0.9"
                >
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </ellipse>
                <ellipse
                  cx="645"
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
                  fontSize="42"
                  fill="#fe9a00"
                  fontWeight="bold"
                  textAnchor="middle"
                  letterSpacing="2"
                >
                  SUCCESS
                </text>
                <text
                  x="300"
                  y="210"
                  fontSize="28"
                  fill="#fe9a00"
                  textAnchor="middle"
                  opacity="0.8"
                  letterSpacing="3"
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
                  opacity="0.5"
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
                width="20"
                height="15"
                rx="4"
                fill="#fe9a00"
                opacity="0.7"
              />
              <rect
                x="645"
                y="255"
                width="15"
                height="25"
                rx="4"
                fill="#fe9a00"
                opacity="0.7"
              />

              {/* Undercarriage */}
              <rect
                x="80"
                y="280"
                width="570"
                height="8"
                rx="4"
                fill="#0f172b"
                opacity="0.5"
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
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                />

                {/* Wheel spokes */}
                <g stroke="#fe9a00" strokeWidth="2" opacity="0.5">
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
                  fill="#0f172b"
                  stroke="#fe9a00"
                  strokeWidth="2"
                />

                {/* Wheel spokes */}
                <g stroke="#fe9a00" strokeWidth="2" opacity="0.5">
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
                <circle key={i} cx="90" cy="280" r="8" fill="#fe9a00">
                  <animate
                    attributeName="cy"
                    from="280"
                    to="220"
                    dur="3s"
                    begin={`${i * 1}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="3s"
                    begin={`${i * 1}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    from="8"
                    to="20"
                    dur="3s"
                    begin={`${i * 1}s`}
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
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  from="60"
                  to="30"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="20" y1="200" x2="50" y2="200">
                <animate
                  attributeName="x1"
                  from="20"
                  to="-10"
                  dur="1.3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  from="50"
                  to="20"
                  dur="1.3s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="25" y1="250" x2="55" y2="250">
                <animate
                  attributeName="x1"
                  from="25"
                  to="-5"
                  dur="1.7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  from="55"
                  to="25"
                  dur="1.7s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          </g>

          {/* Road */}
          <g opacity="0.3">
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
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-[#fe9a00] opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-2 h-2 rounded-full bg-[#fe9a00] opacity-30 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-[#fe9a00] opacity-40 animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-[#0f172b] via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-linear-to-r from-[#0f172b]/50 via-transparent to-[#0f172b]/50"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Top Section - Logo & CTA */}
          <div className="footer-reveal mb-16 text-center">
            <Link href="/" className="inline-block group mb-8">
              <Image
                src="/assets/images/logo.png"
                alt="Success Van Hire"
                width={220}
                height={80}
                className="h-16 w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
              />
            </Link>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              London's most trusted van hire service. Reliable, affordable, and
              flexible van rental solutions for all your needs.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
            {/* Contact Info */}
            <div className="footer-reveal">
              <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full"></div>
                CONTACT INFO
              </h3>
              <ul className="space-y-5">
                <li>
                  <a
                    href="tel:+442030111198"
                    className="group flex items-start gap-4 text-gray-400 hover:text-[#fe9a00] transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#fe9a00]/20 group-hover:border-[#fe9a00]/50 transition-all duration-300  shrink-0">
                      <FiPhone className="text-[#fe9a00] text-lg group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">
                        Car Rental Office
                      </div>
                      <div className="font-bold text-base">
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
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#fe9a00]/20 group-hover:border-[#fe9a00]/50 transition-all duration-300  shrink-0">
                      <FiMail className="text-[#fe9a00] text-lg group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">
                        Email
                      </div>
                      <div className="font-bold text-base break-all">
                        Info@successvanhire.com
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div className="footer-reveal">
              <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full"></div>
                ADDRESS
              </h3>
              <div className="group">
                <div className="flex items-start gap-4 text-gray-400 group-hover:text-[#fe9a00] transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#fe9a00]/20 group-hover:border-[#fe9a00]/50 transition-all duration-300  shrink-0">
                    <FiMapPin className="text-[#fe9a00] text-lg" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-semibold uppercase">
                      Our Location
                    </div>
                    <address className="not-italic font-bold text-base leading-relaxed">
                      Strata House, Waterloo Road,
                      <br />
                      London, NW2 7UH
                    </address>
                    <a
                      href="https://maps.google.com/?q=Strata+House+Waterloo+Road+London+NW2+7UH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-[#fe9a00] text-sm font-semibold hover:gap-3 transition-all duration-300"
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
              <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full"></div>
                SERVICE HOURS
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center  shrink-0">
                  <FiClock className="text-[#fe9a00] text-lg" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-6 pb-3 border-b border-white/10">
                    <span className="text-gray-400 font-semibold text-sm">
                      Monday - Friday
                    </span>
                    <span className="text-[#fe9a00] font-bold text-sm whitespace-nowrap">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-6 pb-3 border-b border-white/10">
                    <span className="text-gray-400 font-semibold text-sm">
                      Saturday
                    </span>
                    <span className="text-[#fe9a00] font-bold text-sm whitespace-nowrap">
                      10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-gray-400 font-semibold text-sm">
                      Sunday
                    </span>
                    <span className="text-red-400 font-bold text-sm">
                      Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-reveal">
              <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#fe9a00] rounded-full"></div>
                QUICK LINKS
              </h3>
              <ul className="space-y-3">
                {menuLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-3 text-gray-400 hover:text-[#fe9a00] transition-all duration-300"
                      >
                        <Icon className="text-[#fe9a00] text-base opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                        <span className="font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="footer-reveal mb-12">
            <div
              className="relative p-8 rounded-3xl border overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(254, 154, 0, 0.2)",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#fe9a00]/5 via-transparent to-[#fe9a00]/5"></div>

              <div className="relative text-center">
                <h3 className="text-white text-2xl font-black mb-3">
                  Follow Us on Social Media
                </h3>
                <p className="text-gray-400 mb-6">
                  Stay connected for the latest updates and offers
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        aria-label={social.name}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#fe9a00] hover:border-[#fe9a00] transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                          <Icon className="text-gray-400 group-hover:text-white transition-colors text-2xl" />
                        </div>
                        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-gray-500 group-hover:text-[#fe9a00] transition-colors whitespace-nowrap">
                          {social.name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Divider with Icon */}
          <div className="footer-reveal relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-6 py-3 bg-[#0f172b] rounded-full border border-white/10">
                <svg
                  className="w-8 h-8 text-[#fe9a00]"
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              {/* Copyright */}
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()}{" "}
                <span className="text-[#fe9a00] font-bold">SuccessVanHire</span>
                , Inc.
                <br className="md:hidden" />
                <span className="hidden md:inline mx-2">•</span>
                All rights reserved.
              </div>

              {/* Powered By */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Powered by</span>
                <a
                  href="https://pgphp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#fe9a00] hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  PGPHP
                  <FiHeart className="text-red-500 animate-pulse" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 z-50 group shadow-2xl ${
            showScrollTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20 pointer-events-none"
          }`}
          style={{
            background: "linear-gradient(135deg, #fe9a00, #d97900)",
            boxShadow: "0 10px 40px rgba(254, 154, 0, 0.4)",
          }}
          aria-label="Scroll to top"
        >
          <FiArrowUp className="text-white text-2xl group-hover:-translate-y-2 transition-transform duration-300" />

          {/* Ripple effect on hover */}
          <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></span>
        </button>
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
