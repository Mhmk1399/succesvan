"use client";

import { useState } from "react";
import { FiPhone, FiCalendar, FiShare2, FiX } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import ReservationForm from "@/components/global/ReservationForm";

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const menuItems = [
    {
      id: "call",
      icon: FiPhone,
      color: "#fe9a00",
      href: "tel:+442030111198",
      label: "Call Us",
    },
    {
      id: "reserve",
      icon: FiCalendar,
      color: "#fe9a00",
      label: "Reserve Now",
      action: () => setShowReservationModal(true),
    },
    {
      id: "social",
      icon: FiShare2,
      color: "#fe9a00",
      label: "Follow Us",
      subItems: [
        {
          icon: FaInstagram,
          href: "https://instagram.com/successvanhire",
          label: "Instagram",
        },
      ],
    },
  ];

  return (
    <>
      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-7xl bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Complete Your Reservation
                </h2>
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="text-white hover:text-amber-400 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              <ReservationForm
                isModal={true}
                onClose={() => setShowReservationModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Container */}
      <div className="fixed bottom-8 left-8 z-50 flex flex-col items-end gap-4">
        {/* Accordion Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = isOpen && item.id === "social";

          return (
            <div key={item.id} className="flex flex-col items-end gap-3">
              {/* Sub Items for Social */}
              {item.subItems && isExpanded && (
                <div className="flex flex-col gap-3">
                  {item.subItems.map((subItem, idx) => {
                    const SubIcon = subItem.icon;
                    const subItemId = `${item.id}-${idx}`;
                    return (
                      <div key={idx} className="relative flex items-center">
                        <a
                          href={subItem.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setHoveredItem(subItemId)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className="group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                          style={{
                            background:
                              "linear-gradient(135deg, #fe9a00, #d97900)",
                            boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                            animation: `slideIn 0.3s ease-out ${
                              idx * 0.05
                            }s both`,
                          }}
                        >
                          <SubIcon className="text-white text-xl" />
                        </a>
                        {hoveredItem === subItemId && (
                          <div className="absolute left-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fadeIn">
                            {subItem.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Main Items */}
              {!item.subItems && isOpen && (
                <div className="relative flex items-center">
                  {item.action ? (
                    <button
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #fe9a00, #d97900)",
                        boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                        animation: `slideIn 0.3s ease-out ${
                          index * 0.05
                        }s both`,
                      }}
                    >
                      <Icon className="text-white text-xl" />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #fe9a00, #d97900)",
                        boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                        animation: `slideIn 0.3s ease-out ${
                          index * 0.05
                        }s both`,
                      }}
                    >
                      <Icon className="text-white text-xl" />
                    </a>
                  )}
                  {hoveredItem === item.id && (
                    <div className="absolute left-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fadeIn">
                      {item.label}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
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
