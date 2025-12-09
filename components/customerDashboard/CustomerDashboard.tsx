"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiClipboard,
  FiUser,
  FiGift,
  FiTag,
  FiExternalLink,
  FiLogOut,
  FiAlertCircle,
} from "react-icons/fi";
import { MdSmartToy } from "react-icons/md";
import ProfileContent from "./ProfileContent";
import DynamicTableView from "../dashboard/DynamicTableView";
import { Reservation } from "@/types/type";
import { showToast } from "@/lib/toast";

const menuItems = [
  {
    id: "offers",
    label: "Offers",
    icon: <FiGift />,
  },
  {
    id: "reserves",
    label: "My Reservations",
    icon: <FiClipboard />,
  },
  {
    id: "profile",
    label: "Profile",
    icon: <FiUser />,
  },

  {
    id: "discounts",
    label: "Discounts",
    icon: <FiTag />,
  },
  {
    id: "Ai",
    label: "AI assistance",
    icon: <MdSmartToy />,
  },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("reserves");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hasLicense, setHasLicense] = useState(true);

  const checkLicenseStatus = () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && typeof userData === 'object') {
          const hasLicenseUploaded = userData.licenceAttached?.front && userData.licenceAttached?.back;
          setHasLicense(hasLicenseUploaded);
        }
      } catch (error) {
        console.log("Failed to parse user data:", error);
      }
    }
  };

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

  useEffect(() => {
    checkLicenseStatus();
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && typeof userData === 'object') {
          const hasLicenseUploaded = userData.licenceAttached?.front && userData.licenceAttached?.back;
          
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("uploadLicense") === "true" && !hasLicenseUploaded) {
            showToast.error("Your reservation is pending. Please upload your license to confirm your reservation.");
            setActiveTab("profile");
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      } catch (error) {
        console.log("Failed to parse user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center cursor-pointer gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
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

        <div className="p-4 space-y-2 border-t border-white/10">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold"
          >
            <FiExternalLink className="text-lg" />
            <span>Back to Site</span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3 border border-red-500 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors font-semibold"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
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
          <div>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold"
            >
              <FiExternalLink className="text-lg" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {!hasLicense && (
            <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
              <FiAlertCircle className="text-yellow-500 text-xl mt-0.5  shrink-0" />
              <div>
                <h3 className="text-yellow-500 font-bold mb-1">License Required</h3>
                <p className="text-gray-300 text-sm">
                  Your reservations are pending. Please upload your driver's license in the Profile section to confirm your bookings.
                </p>
                <button
                  onClick={() => handleTabChange("profile")}
                  className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-semibold text-sm"
                >
                  Upload License Now
                </button>
              </div>
            </div>
          )}
        
          {activeTab === "reserves" && <ReservesContent />}
          {activeTab === "profile" && <ProfileContent onLicenseUpdate={checkLicenseStatus} />}
          {activeTab === "offers" && <OffersContent />}
          {activeTab === "discounts" && <DiscountsContent />}
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl border border-white/10 max-w-sm w-full p-6">
            <h3 className="text-xl font-black text-white mb-2">Logout</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservesContent() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasLicense, setHasLicense] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && typeof userData === 'object' && userData._id) {
          setUserId(userData._id);
          const hasLicenseUploaded = userData.licenceAttached?.front && userData.licenceAttached?.back;
          setHasLicense(hasLicenseUploaded);
        }
      } catch (error) {
        console.log("Failed to parse user data:", error);
      }
    }
  }, []);

  const handleEdit = async (reservation: Reservation) => {
    try {
      const res = await fetch(`/api/reservations/${reservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");
      showToast.success("Reservation updated successfully!");
    } catch (error: any) {
      showToast.error(error.message || "Update failed");
    }
  };

  if (!userId) {
    return <div className="text-gray-400">Loading reservations...</div>;
  }

  return (
    <DynamicTableView<Reservation>
      apiEndpoint={`/api/reservations?userId=${userId}`}
      title="Reservation"
      hideDelete
      columns={[
        {
          key: "office" as keyof Reservation,
          label: "Office",
          render: (value: any) => value?.name || "-",
        },
        {
          key: "startDate" as keyof Reservation,
          label: "Start Date",
          render: (value: string) =>
            new Date(value).toLocaleDateString() || "-",
        },
        {
          key: "endDate" as keyof Reservation,
          label: "End Date",
          render: (value: string) =>
            new Date(value).toLocaleDateString() || "-",
        },
        {
          key: "totalPrice" as keyof Reservation,
          label: "Total Price",
        },
        {
          key: "status" as keyof Reservation,
          label: "Status",
          render: (value: string) => (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                value === "confirmed"
                  ? "bg-green-500/20 text-green-400"
                  : value === "pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : value === "canceled"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {value}
            </span>
          ),
        },
        
      ]}
    />
  );
}

function OffersContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-2">
              Special Offer {i}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get up to 20% discount on your next reservation
            </p>
            <button className="w-full px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscountsContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white">
                Discount Code {i}
              </h3>
              <span className="text-2xl font-black text-[#fe9a00]">
                {10 + i * 5}%
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">Code: SAVE{i}0</p>
            <button className="w-full px-4 py-2 bg-[#fe9a00]/20 text-[#fe9a00] rounded-lg hover:bg-[#fe9a00]/30 transition-colors font-semibold text-sm">
              Copy Code
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
