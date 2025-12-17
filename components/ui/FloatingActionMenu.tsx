"use client";

import { useState } from "react";
import { FiPhone, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    {
      id: "call",
      icon: FiPhone,
      color: "#0496ff",
      href: "tel:+442030111198",
      label: "Call Us",
    },
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      color: "#25D366",
      href: "https://wa.me/442030111198",
      label: "WhatsApp",
    },
  ];

  if (pathname === "/dashboard" || pathname === "/customerDashboard") {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            isOpen && (
              <div key={item.id} className="relative flex items-center">
                <a
                  href={item.href}
                  target={item.id === "whatsapp" ? "_blank" : undefined}
                  rel={
                    item.id === "whatsapp" ? "noopener noreferrer" : undefined
                  }
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${item.color})`,
                    boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <Icon size={20} className="text-white text-xl" />
                </a>
                {hoveredItem === item.id && (
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${item.color})`,
                      boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                    className="absolute right-full mr-3 px-3 py-2   text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fadeIn"
                  >
                    {item.label}
                  </div>
                )}
              </div>
            )
          );
        })}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #fe9a00, #d97900)",
            boxShadow: "0 10px 40px rgba(254, 154, 0, 0.4)",
          }}
        >
          <div
            className={`absolute transition-all duration-300 ${
              isOpen
                ? "scale-0 opacity-0 rotate-180"
                : "scale-100 opacity-100 rotate-0"
            }`}
          >
            <FiPhone className="text-white text-2xl" />
          </div>

          <div
            className={`absolute transition-all duration-300 ${
              isOpen
                ? "scale-100 opacity-100 rotate-0"
                : "scale-0 opacity-0 rotate-180"
            }`}
          >
            <FiX className="text-white text-2xl" />
          </div>

          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
