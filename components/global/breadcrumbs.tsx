"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const hiddenPaths = ["/", "/register", "/admin", "/dashboard"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      href: "/" + arr.slice(0, index + 1).join("/"),
    }));

  if (
    pathname === "/dashboard" ||
    pathname === "/customerDashboard" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <nav className="absolute top-16 left-0 right-0 z-40        py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#fe9a00] transition-colors"
          >
            <FiHome className="text-lg" />
            <span>Home</span>
          </Link>

          {segments.map((segment, index) => (
            <div key={segment.href} className="flex items-center gap-2">
              <FiChevronRight className="text-gray-600" />
              {index === segments.length - 1 ? (
                <span className="text-white font-semibold">
                  {segment.label}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className="text-gray-400 hover:text-[#fe9a00] transition-colors"
                >
                  {segment.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
