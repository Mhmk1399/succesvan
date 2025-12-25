"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiMapPin,
  FiTruck,
  FiCalendar,
  FiTag,
  FiBell,
  FiClipboard,
  FiUsers,
  FiFileText,
  FiMenu,
  FiX,
  FiExternalLink,
  FiLayers,
  FiGift,
  FiCommand,
} from "react-icons/fi";
import { useStats } from "@/hooks/useStats";
import { useRecentReservations } from "@/hooks/useRecentReservations";
import { useFleetStatus } from "@/hooks/useFleetStatus";
import OfficesContent from "./CreateOfficeForm";
import VehiclesContent from "./CreateVehicleForm";
import CategoriesContent from "./CreateCategoryForm";
import TypesManagement from "./TypesManagement";
import SpecialDaysManagement from "./SpecialDaysManagement";
import AddOnsContent from "./CreateAddOnForm";
import ReservationsManagement from "./ReservationsManagement";
import TestimonialsManagement from "./TestimonialsManagement";
import ContactsManagement from "./ContactsManagement";
import AnnouncementManagement from "./AnnouncementManagement";
import ReportsManagement from "./ReportsManagement";
import { MenuItem } from "@/types/type";
import DiscountManagement from "./DiscountManagement";

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <FiHome />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "type",
    label: "Types",
    icon: <FiLayers />,
    color: "from-purple-500 to-blue-600",
  },
  {
    id: "offices",
    label: "Offices",
    icon: <FiMapPin />,
    color: "from-green-500 to-green-600",
  },
  {
    id: "categories",
    label: "Categories",
    icon: <FiTag />,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: <FiTruck />,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "holidays",
    label: "Holidays",
    icon: <FiCalendar />,
    color: "from-purple-500 to-purple-600",
  },

  {
    id: "addons",
    label: "AddOns",
    icon: <FiGift />,
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "discounts",
    label: "Discounts",
    icon: <FiTag />,
    color: "from-yellow-500 to-yellow-600",
  },
   
  {
    id: "reserves",
    label: "Reserves",
    icon: <FiClipboard />,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: "Testimonial",
    label: "Testimonials",
    icon: <FiCommand />,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: <FiUsers />,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: <FiBell />,
    color: "from-rose-500 to-rose-600",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FiFileText />,
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && menuItems.some((item) => item.id === hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172b]">
      <aside
        className={`fixed left-0 top-0 h-screen w-54 bg-[#1a2847] border-r border-white/10 z-50 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-black text-white">
            Success<span className="text-[#fe9a00]">Van</span>
          </h1>
        </div>

        <nav className="px-4 py-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-[#fe9a00] text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span
                className={`text-sm  ${
                  activeTab === item.id ? "text-white" : "text-[#fe9a00]"
                } `}
              >
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold"
          >
            <FiExternalLink className="text-lg" />
            <span>Visit Site</span>
          </Link>
        </div>
      </aside>

      <main className="lg:ml-54">
        <div className="sticky top-0 bg-[#1a2847] border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>

          <h2 className="text-2xl font-black text-white">
            {menuItems.find((item) => item.id === activeTab)?.label}
          </h2>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white font-semibold rounded-lg transition-colors"
            >
              Visit Site
              <FiExternalLink className="text-lg" />
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "type" && <TypesManagement />}
          {activeTab === "offices" && <OfficesContent />}
          {activeTab === "vehicles" && <VehiclesContent />}
          {activeTab === "holidays" && <HolidaysContent />}
          {activeTab === "categories" && <CategoriesContent />}
          {activeTab === "addons" && <AddOnsContent />}
          {activeTab === "discounts" && <DiscountManagement />}
          {activeTab === "notifications" && <NotificationsContent />}
          {activeTab === "reserves" && <ReservesContent />}
          {activeTab === "Testimonial" && <TestimonialsManagement />}
          {activeTab === "contacts" && <ContactsManagement />}
          {activeTab === "announcements" && <AnnouncementManagement />}
          {activeTab === "reports" && <ReportsManagement />}
          {activeTab === "documents" && <DocumentsContent />}
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function DashboardContent() {
  const { stats, isLoading } = useStats();
  const { reservations, isLoading: reservationsLoading } =
    useRecentReservations();
  const { fleetStatus, isLoading: fleetLoading } = useFleetStatus();

  const statCards = [
    {
      label: "Total Vehicles",
      value: stats.vehicles,
      icon: <FiTruck />,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "All Reserves",
      value: stats.reservations,
      icon: <FiClipboard />,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Offices",
      value: stats.offices,
      icon: <FiMapPin />,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: <FiTag />,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-linear-to-br ${stat.color} p-6 rounded-2xl border border-white/10 text-white`}
          >
            <div className={`bg-white/20 p-3 rounded-lg w-fit mb-4`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-gray-200 text-sm mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-white">
              {isLoading ? "-" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-4">
            Recent Reserves
          </h3>
          <div className="space-y-3">
            {reservationsLoading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : reservations.length > 0 ? (
              reservations.map((res) => (
                <div
                  key={res._id}
                  className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">
                        Reserve #{res._id?.slice(-4).toUpperCase()}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(res.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        res.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : res.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="text-[#07da54] font-bold">
                        £{res.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pickup</p>
                      <p className="text-gray-300 font-medium">
                        {new Date(res.startDate!).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Return</p>
                      <p className="text-gray-300 font-medium">
                        {new Date(res.endDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No reservations yet</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-4">Fleet Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Available</span>
              <span className="text-2xl font-black text-green-400">
                {fleetLoading ? "-" : fleetStatus.available}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">In Use</span>
              <span className="text-2xl font-black text-orange-400">
                {fleetLoading ? "-" : fleetStatus.inUse}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Maintenance</span>
              <span className="text-2xl font-black text-red-400">
                {fleetLoading ? "-" : fleetStatus.maintenance}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HolidaysContent() {
  return <SpecialDaysManagement />;
}

function NotificationsContent() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-4"
        >
          <div className="w-3 h-3 rounded-full bg-[#fe9a00] mt-2 shrink-0"></div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Notification {i}</h3>
            <p className="text-gray-400 text-sm mt-1">
              This is a sample notification message
            </p>
            <p className="text-gray-500 text-xs mt-2">{i} hours ago</p>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function ReservesContent() {
  return <ReservationsManagement />;
}

function ContactsContent() {
  return (
    <div className="space-y-6">
      <button className="px-6 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white font-bold rounded-lg transition-colors">
        + Add Contact
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-2">Contact {i}</h3>
            <p className="text-gray-400 text-sm mb-1">contact{i}@example.com</p>
            <p className="text-gray-400 text-sm mb-4">+44 123 456 {7890 + i}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#fe9a00]/20 text-[#fe9a00] rounded-lg hover:bg-[#fe9a00]/30 transition-colors text-sm font-semibold">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsContent() {
  return (
    <div className="space-y-6">
      <button className="px-6 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white font-bold rounded-lg transition-colors">
        + Upload Document
      </button>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#fe9a00]/20 flex items-center justify-center">
                <FiFileText className="text-[#fe9a00]" />
              </div>
              <div>
                <p className="text-white font-semibold">Document {i}.pdf</p>
                <p className="text-gray-400 text-xs">
                  2.4 MB • Uploaded 3 days ago
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              ⋮
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
