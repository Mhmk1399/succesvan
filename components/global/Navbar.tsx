"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  FiChevronDown,
  FiChevronRight,
  FiUser,
  FiPhone,
  FiLogOut,
  FiLayout,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAnnouncement } from "./AnnouncementBar";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: {
    label: string;
    href: string;
    category?: string;
    icon?: React.ReactNode;
  }[];
}

const menuItems: MenuItem[] = [
  { label: "HOME", href: "/" },
  { label: "BLOGS", href: "/blog" },
  {
    label: "SERVICES",
    href: "#services",
    children: [
      { label: "Reservation", href: "/reservation" },
      { label: "Automatic Van Rental", href: "/automatic-van-hire-london" },
    ],
  },
  {
    label: "AREAS",
    href: "#AREAS",
    children: [
      { label: "Explore Our Van Hire", href: "/van-hire-north-west-london" },
      {
        label: "Brent Cross",
        href: "/success-van-hire-van-rental-in-brent-cross-london-last-minute-bookings",
      },
      { label: "Camden", href: "/van-hire-wembley-2-2" },
      { label: "Cricklewood", href: "/van-hire-cricklewood" },
      { label: "Golders Green", href: "/van-hire-golders-green" },
      { label: "Hampstead", href: "/van-hire-hampstead" },
      { label: "Hendon", href: "/van-hire-hendon" },
      { label: "Mill Hill", href: "/van-hire-mill-hill" },
      { label: "London", href: "/car-hire-nw-london" },
      { label: "Wembley", href: "/van-hire-wembley" },
    ],
  },
  { label: "ABOUT US", href: "/aboutus" },
  { label: "CONTACT", href: "/contact-us" },
];

// Animated Hamburger Icon
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-6 h-4 flex flex-col justify-between">
      <span
        className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
          isOpen ? "opacity-0 scale-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </div>
  );
}

// User Avatar Component
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#fe9a00] to-amber-600 flex items-center justify-center text-slate-900 font-bold text-sm shadow-lg shadow-amber-500/20">
      {initials}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasAnnouncement } = useAnnouncement();

  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Initial animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power4.out",
      });
    });
    return () => ctx.revert();
  }, []);
  

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll detection with throttle
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      gsap.to(overlayRef.current, {
        duration: 0.4,
        opacity: 1,
        pointerEvents: "auto",
        ease: "power2.out",
      });
      gsap.to(menuRef.current, {
        duration: 0.5,
        x: 0,
        opacity: 1,
        ease: "power4.out",
      });
      // Stagger animate menu items
      gsap.from(menuItemsRef.current, {
        duration: 0.4,
        x: -30,
        opacity: 0,
        stagger: 0.05,
        delay: 0.2,
        ease: "power3.out",
      });
    } else {
      closeMenu();
    }
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    gsap.to(overlayRef.current, {
      duration: 0.3,
      opacity: 0,
      pointerEvents: "none",
      ease: "power2.in",
    });
    gsap.to(menuRef.current, {
      duration: 0.4,
      x: "-100%",
      opacity: 0,
      ease: "power3.in",
    });
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setShowDropdown(false);
    closeMenu();
  }, [logout, closeMenu]);

  // Hide on dashboard pages
  if (["/dashboard", "/customerDashboard", "/register"].includes(pathname)) {
    return null;
  }

  const navTopPosition =
    isScrolled || !hasAnnouncement ? "0px" : isMobile ? "32px" : "41px";

  return (
    <>
      {/* Main Navbar */}
      <nav
        ref={navRef}
        className={`fixed w-full z-9999 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0a0f1c]/50 backdrop-blur-xl shadow-2xl shadow-black/20"
            : "bg-linear-to-b from-[#0a0f1c]/10 to-[#0a0f1c]/10 backdrop-blur-sm"
        }`}
        style={{ top: navTopPosition }}
      >
        {/* Animated linear line at top */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#fe9a00] to-transparent transition-opacity duration-500 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Menu Toggle */}
              <button
                onClick={toggleMenu}
                className={`relative text-white z-999 p-2 rounded-xl transition-all duration-300 group ${
                  isOpen
                    ? "bg-[#fe9a00] text-slate-900"
                    : "hover:bg-white/10 hover:text-[#fe9a00]"
                }`}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <HamburgerIcon isOpen={isOpen} />
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {isOpen ? "Close" : "Menu"}
                </span>
              </button>

              {/* Logo - Desktop */}
              <Link href="/" className="hidden md:block group relative">
                <div className="absolute -inset-2 bg-linear-to-r from-[#fe9a00]/20 to-amber-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="/assets/images/logo.png"
                  alt="SuccessVan Logo"
                  width={100}
                  height={60}
                  className="h-10 w-auto relative group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>
            </div>

            {/* Center Logo - Mobile */}
            <Link href="/" className="md:hidden group">
              <Image
                src="/assets/images/logo.png"
                alt="SuccessVan Logo"
                width={90}
                height={55}
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* User Section - Desktop */}
              <div className="hidden md:block">
                {user ? (
                  <div ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                        showDropdown ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <UserAvatar name={user.name} />
                      <div className="hidden lg:block text-left">
                        <p className="text-white text-sm font-medium leading-tight">
                          {user.name} {user.lastName || ""}
                        </p>
                        <p className="text-white/50 text-xs">
                          {user.role === "admin" ? "Administrator" : "Customer"}
                        </p>
                      </div>
                      <FiChevronDown
                        size={16}
                        className={`text-white/60 transition-transform duration-300 ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute right-0 mt-2 w-56 origin-top-right transition-all duration-300 ${
                        showDropdown
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-[#141f38] rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden">
                        {/* User Info Header */}
                        <div className="p-4 bg-linear-to-br from-[#fe9a00]/10 to-transparent border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.name} />
                            <div>
                              <p className="text-white font-medium text-sm">
                                {user.name} {user.lastName || ""}
                              </p>
                              <p className="text-white/50 text-xs">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href={
                              user.role === "admin"
                                ? "/dashboard"
                                : "/customerDashboard"
                            }
                            className="flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#fe9a00]/10 flex items-center justify-center group-hover:bg-[#fe9a00]/20 transition-colors">
                              <FiLayout size={16} className="text-[#fe9a00]" />
                            </div>
                            <span className="text-sm font-medium">
                              Dashboard
                            </span>
                            <FiChevronRight
                              size={14}
                              className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                            />
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group mt-1"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                              <FiLogOut size={16} className="text-red-400" />
                            </div>
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 font-medium text-sm group"
                  >
                    <FiUser
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* CTA Button - Phone */}
              <Link
                href="tel:+442030111198"
                className="group relative flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-linear-to-r from-[#fe9a00] to-amber-500 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 text-sm overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <FiPhone
                  size={18}
                  className="relative z-10 group-hover:rotate-12 transition-transform"
                />
                <span className="relative z-10 hidden md:block">
                  +44 20 3011 1198
                </span>
                <span className="relative z-10 md:hidden">Call</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-998 opacity-0 pointer-events-none"
      />

      {/* Slide-In Menu */}
      <div
        ref={menuRef}
        className="fixed left-0 w-[320px] md:w-95 h-screen bg-linear-to-b from-[#141f38] via-[#0f172a] to-[#080d17] transform -translate-x-full opacity-0 z-999 shadow-2xl shadow-black/50 overflow-hidden"
        // style={{ top: navTopPosition }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fe9a00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

        {/* Scrollable Content */}
        <div
          className={`relative h-full ${
            isScrolled ? "mt-10" : "mt-25"
          }  overflow-y-auto scrollbar-thin scrollbar-thumb-[#fe9a00]/30 scrollbar-track-transparent`}
        >
          {/* Menu Items */}
          <div className="px-4 space-y-1">
            {menuItems.map((item, index) => (
              <div
                key={item.label}
                ref={(el) => {
                  menuItemsRef.current[index] = el;
                }}
                className="relative"
              >
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.label ? null : item.label
                        )
                      }
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`flex items-center justify-between w-full text-base font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 group ${
                        activeDropdown === item.label
                          ? "bg-[#fe9a00]/10 text-[#fe9a00]"
                          : "text-white hover:bg-white/5 hover:text-[#fe9a00]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            activeDropdown === item.label ||
                            hoveredItem === item.label
                              ? "bg-[#fe9a00] scale-100"
                              : "bg-white/30 scale-75"
                          }`}
                        />
                        {item.label}
                      </span>
                      <FiChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-400 ease-out ${
                        activeDropdown === item.label
                          ? "max-h-125 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-4 mt-1 mb-2 pl-4 border-l-2 border-[#fe9a00]/20 space-y-0.5">
                        {item.children?.map((child, childIndex) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 group ${
                              pathname === child.href
                                ? "text-[#fe9a00] bg-[#fe9a00]/10"
                                : "text-white/70 hover:text-[#fe9a00] hover:bg-[#fe9a00]/5"
                            }`}
                            onClick={closeMenu}
                            style={{
                              animationDelay: `${childIndex * 50}ms`,
                            }}
                          >
                            <FiChevronRight
                              size={12}
                              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                            />
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              {child.label}
                            </span>
                            {pathname === child.href && (
                              <span className="ml-auto text-xs bg-[#fe9a00]/20 text-[#fe9a00] px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center gap-3 text-base font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 group ${
                      pathname === item.href
                        ? "bg-[#fe9a00]/10 text-[#fe9a00]"
                        : "text-white hover:bg-white/5 hover:text-[#fe9a00]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        pathname === item.href || hoveredItem === item.label
                          ? "bg-[#fe9a00] scale-100"
                          : "bg-white/30 scale-75"
                      }`}
                    />
                    {item.label}
                    {pathname === item.href && (
                      <span className="ml-auto text-xs bg-[#fe9a00]/20 text-[#fe9a00] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Quick Contact Section */}
          <div className="mt-8 mx-4 p-4 bg-linear-to-br from-white/5 to-transparent rounded-2xl border border-white/5">
            <div className="space-y-3">
              <a
                href="tel:+442030111198"
                className="flex items-center gap-3 text-white/80 hover:text-[#fe9a00] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#fe9a00]/10 flex items-center justify-center group-hover:bg-[#fe9a00]/20 transition-colors">
                  <FiPhone size={18} className="text-[#fe9a00]" />
                </div>
                <div>
                  <p className="text-sm font-medium">+44 20 3011 1198</p>
                  <p className="text-xs text-white/40">Call us anytime</p>
                </div>
              </a>

              <a
                href="https://maps.google.com/?q=Strata+House+Waterloo+Road+London+NW2+7UH"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-[#fe9a00] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#fe9a00]/10 flex items-center justify-center group-hover:bg-[#fe9a00]/20 transition-colors">
                  <FiMapPin size={18} className="text-[#fe9a00]" />
                </div>
                <div>
                  <p className="text-sm font-medium">London, UK</p>
                  <p className="text-xs text-white/40">View on map</p>
                </div>
              </a>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 mt-6 p-4 bg-linear-to-t from-[#080d17] via-[#080d17] to-transparent">
            {user ? (
              <div className="flex gap-3">
                <Link
                  href={
                    user.role === "admin" ? "/dashboard" : "/customerDashboard"
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 font-medium text-sm border border-white/10"
                  onClick={closeMenu}
                >
                  <FiLayout size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300 font-medium text-sm border border-red-500/20"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/register"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 font-medium text-sm border border-white/10"
                  onClick={closeMenu}
                >
                  <FiUser size={18} />
                  Login
                </Link>
                <Link
                  href="/reservation"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#fe9a00] to-amber-500 text-slate-900 rounded-xl transition-all duration-300 font-bold text-sm group"
                  onClick={closeMenu}
                >
                  <HiSparkles size={18} />
                  Reserve
                  <FiArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )}

            {/* Copyright */}
            <p className="text-center text-white/30 text-xs mt-4">
              © {new Date().getFullYear()} SuccessVan. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(254, 154, 0, 0.3);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(254, 154, 0, 0.5);
        }
      `}</style>
    </>
  );
}
