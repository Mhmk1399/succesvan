"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
  FiPhone,
  FiLogOut,
  FiLayout,
} from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const scrollbarStyles = `
  .navbar-menu::-webkit-scrollbar {
    width: 2px;
  }
  .navbar-menu::-webkit-scrollbar-track {
    background: transparent;
  }
  .navbar-menu::-webkit-scrollbar-thumb {
    background: #fe9a00;
    border-radius: 10px;
  }
  .navbar-menu::-webkit-scrollbar-thumb:hover {
    background: #ff8c00;
  }
`;

interface MenuItem {
  label: string;
  href: string;
  children?: { label: string; href: string; category?: string }[];
}

const menuItems: MenuItem[] = [
  { label: "HOME", href: "/" },
  { label: "BLOGS", href: "/blog" },
  {
    label: "SERVICES",
    href: "#services",
    children: [
      {
        label: "Reservation",
        href: "/reservation",
      },
      { label: "Automatic Van Rental", href: "/automatic-van-hire-london" },
    ],
  },
  {
    label: "AREAS",
    href: "#AREAS",
    children: [
      {
        label: "Explore Our Van Hire",
        href: "/van-hire-north-west-london",
      },
      {
        label: "Brent Cross",
        href: "/success-van-hire-van-rental-in-brent-cross-london-last-minute-bookings",
      },
      {
        label: "CAMDEN",
        href: "/van-hire-wembley-2-2",
      },
      {
        label: "CRICKLEWOOD",
        href: "/van-hire-cricklewood",
      },
      {
        label: "Golders Green",
        href: "/van-hire-golders-green",
      },
      {
        label: "Hampstead",
        href: "/van-hire-hampstead",
      },
      {
        label: "Hendon",
        href: "/van-hire-hendon",
      },
      {
        label: "Mill Hill",
        href: "/van-hire-mill-hill",
      },
      {
        label: "London",
        href: "/car-hire-nw-london",
      },
      {
        label: "Wembley",
        href: "/van-hire-wembley",
      },
    ],
  },
  { label: "ABOUT US", href: "/aboutus" },
  { label: "CONTACT", href: "/contact-us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    gsap.from(navRef.current, {
      duration: 0.8,
      y: -100,
      opacity: 0,
      ease: "power3.out",
    });
  }, []);



  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true);
      gsap.to(overlayRef.current, {
        duration: 0.3,
        opacity: 1,
        pointerEvents: "auto",
        ease: "power2.out",
      });
      gsap.to(menuRef.current, {
        duration: 0.4,
        x: 0,
        opacity: 1,
        ease: "power3.out",
      });
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    gsap.to(overlayRef.current, {
      duration: 0.3,
      opacity: 0,
      pointerEvents: "none",
      ease: "power2.in",
    });
    gsap.to(menuRef.current, {
      duration: 0.3,
      x: "-100%",
      opacity: 0,
      ease: "power3.in",
    });
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

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

  if (
    pathname === "/dashboard" ||
    pathname === "/customerDashboard" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-9999   backdrop-blur-xs "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Menu Button (Mobile) / Logo (Desktop) */}
            <div className="flex flex-row-reverse items-center">
              <button
                onClick={toggleMenu}
                className="  text-white z-999 text-2xl hover:text-[#fe9a00] transition-colors duration-300 p-2 rounded-lg hover:bg-slate-800/50"
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX /> : <FiMenu />}
              </button>
              <div className="group cursor-pointer hidden md:block">
                <Link href="/">
                  <Image
                    src="/assets/images/logo.png"
                    alt="SuccessVan Logo"
                    width={80}
                    height={50}
                    className="h-10 w-24 group-hover:scale-110 transition-transform duration-300"
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Center: Logo (Mobile) */}
            <div className="group cursor-pointer md:hidden">
              <Link href="/">
                <Image
                  src="/assets/images/logo.png"
                  alt="SuccessVan Logo"
                  width={80}
                  height={50}
                  className="h-10 w-24 group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </Link>
            </div>

            {/* Right Side: Login & Phone Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg hover:text-[#fe9a00] transition-all duration-300 font-medium text-sm hover:bg-white/5 border border-[#fe9a00]/30"
                  >
                    <FiUser size={18} />
                    {user.name} {user.lastName || ""}
                    <FiChevronDown
                      size={16}
                      className={`transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0f172b] border border-[#fe9a00]/30 rounded-lg shadow-xl overflow-hidden z-50">
                      <Link
                        href={user.role === "admin" ? "/dashboard" : "/customerDashboard"}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#fe9a00]/10 hover:text-[#fe9a00] transition-all duration-300"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiLayout size={18} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border-t border-[#fe9a00]/20"
                      >
                        <FiLogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg hover:text-[#fe9a00] transition-all duration-300 font-medium text-sm hover:bg-white/5"
                >
                  <FiUser size={18} />
                  LOGIN
                </Link>
              )}
              <Link
                href="tel:+442030111198"
                className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:from-[#fe9a00] hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 text-sm"
              >
                <FiPhone size={18} />
                +44 20 3011 1198
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="fixed inset-0 bg-black/60 z-30 opacity-0 pointer-events-none transition-opacity duration-300"
      />

      <style>{scrollbarStyles}</style>

      {/* Slide-In Menu */}
      <div
        ref={menuRef}
        className="navbar-menu fixed top-10 left-0 w-80 h-full bg-[#0f172b]/10 backdrop-blur-3xl transform -translate-x-full opacity-0 z-999 shadow-2xl overflow-y-auto"
      >
        {/* Menu Items */}
        <div className="flex flex-col space-y-2 p-6">
          {menuItems.map((item) => (
            <div key={item.label} className="relative">
              <button
                onClick={() => {
                  if (item.children) {
                    setActiveDropdown(
                      activeDropdown === item.label ? null : item.label
                    );
                  } else {
                    closeMenu();
                  }
                }}
                className="menu-link flex items-center justify-between w-full text-white text-lg font-semibold hover:text-[#fe9a00] transition-colors duration-300 py-3 px-4 rounded-lg hover:bg-slate-800/50"
              >
                <Link href={item.href}>{item.label}</Link>
                {item.children && (
                  <FiChevronDown
                    className={`text-xs transition-transform ${
                      activeDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu Dropdown */}
              {item.children && (
                <div
                  className={`ml-4  space-y-1 overflow-hidden transition-all duration-300 ${
                    activeDropdown === item.label
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {Array.from(
                    new Set(item.children.map((child) => child.category))
                  ).map((category, idx) => (
                    <div key={idx}>
                      {category && (
                        <div className="px-3 py-1 text-xs text-[#fe9a00] font-semibold tracking-wider bg-slate-800/50 rounded">
                          {category}
                        </div>
                      )}
                      {item.children
                        ?.filter((child) => child.category === category)
                        .map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="menu-link block px-4 py-2 text-white/80 text-sm hover:bg-[#fe9a00]/10 hover:text-[#fe9a00] transition-all duration-300 hover:translate-x-2 rounded"
                            onClick={closeMenu}
                          >
                            {child.label}
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 space-y-4 pb-12 ">
          <div className="flex items-center space-x-3 text-[#fe9a00] text-sm">
            <FiPhone className="text-lg" />
            <span className="font-semibold">+44 20 3011 1198</span>
          </div>
          <div className="flex items-center space-x-3 text-[#fe9a00] text-sm">
            <FaMapMarkerAlt className="text-lg" />
            <span className="font-semibold">London, UK</span>
          </div>
          <div className="flex gap-3 pt-4">
            {user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/dashboard" : "/customerDashboard"}
                  className="flex-1 px-4 py-2.5 text-center text-white rounded-lg hover:text-[#fe9a00] transition-all duration-300 font-medium text-sm hover:bg-white/5"
                  onClick={closeMenu}
                >
                  DASHBOARD
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-red-500/20 text-red-400 text-center font-bold rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex-1 px-4 py-2.5 text-center text-white rounded-lg hover:text-[#fe9a00] transition-all duration-300 font-medium text-sm hover:bg-white/5"
                  onClick={closeMenu}
                >
                  LOGIN
                </Link>
                <Link
                  href="/reservation"
                  className="flex-1 px-4 py-2.5 bg-[#fe9a00] text-slate-900 text-center font-bold rounded-lg hover:from-[#fe9a00] hover:to-amber-500 transition-all duration-300 text-sm"
                  onClick={closeMenu}
                >
                  RESERVE
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
