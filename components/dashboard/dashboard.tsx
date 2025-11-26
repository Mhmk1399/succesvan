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
} from "react-icons/fi";
import { useStats } from "@/hooks/useStats";
import OfficesContent from "./CreateOfficeForm";
import VehiclesContent from "./CreateVehicleForm";
import CategoriesContent from "./CreateCategoryForm";
import TypesManagement from "./TypesManagement";
import SpecialDaysManagement from "./SpecialDaysManagement";
import AddOnsContent from "./CreateAddOnForm";
import ReservationsManagement from "./ReservationsManagement";
import { MenuItem } from "@/types/type";

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
    id: "notifications",
    label: "Notifications",
    icon: <FiBell />,
    color: "from-red-500 to-red-600",
  },
  {
    id: "reserves",
    label: "Reserves",
    icon: <FiClipboard />,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: <FiUsers />,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FiFileText />,
    color: "from-yellow-500 to-yellow-600",
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

  return (
    <div className="min-h-screen bg-[#0f172b]">
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#1a2847] border-r border-white/10 z-50 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black text-white">
            Success<span className="text-[#fe9a00]">Van</span>
          </h1>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-[#fe9a00] text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
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

      <main className="lg:ml-64">
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
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#fe9a00] to-orange-600"></div>
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
          {activeTab === "notifications" && <NotificationsContent />}
          {activeTab === "reserves" && <ReservesContent />}
          {activeTab === "contacts" && <ContactsContent />}
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
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white font-semibold">
                    Reserve #{1000 + i}
                  </p>
                  <p className="text-gray-400 text-sm">2 days ago</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-4">Fleet Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Available</span>
              <span className="text-2xl font-black text-green-400">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">In Use</span>
              <span className="text-2xl font-black text-orange-400">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Maintenance</span>
              <span className="text-2xl font-black text-red-400">1</span>
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
