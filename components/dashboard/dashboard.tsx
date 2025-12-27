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
import CustomSelect from "../ui/CustomSelect";

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
          {activeTab === "dashboard" && (
            <DashboardContent handleTabChange={handleTabChange} />
          )}
          {activeTab === "type" && <TypesManagement />}
          {activeTab === "offices" && <OfficesContent />}
          {activeTab === "vehicles" && <VehiclesContent />}
          {activeTab === "holidays" && <SpecialDaysManagement />}
          {activeTab === "categories" && <CategoriesContent />}
          {activeTab === "addons" && <AddOnsContent />}
          {activeTab === "discounts" && <DiscountManagement />}
          {activeTab === "reserves" && <ReservationsManagement />}
          {activeTab === "Testimonial" && <TestimonialsManagement />}
          {activeTab === "contacts" && <ContactsManagement />}
          {activeTab === "announcements" && <AnnouncementManagement />}
          {activeTab === "reports" && <ReportsManagement />}
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

interface DashboardContentProps {
  handleTabChange: (tabId: string) => void;
}

function DashboardContent({ handleTabChange }: DashboardContentProps) {
  const { stats, isLoading: statsLoading } = useStats();
  const { reservations, isLoading: reservationsLoading } =
    useRecentReservations();
  const { todayActivity, isLoading: fleetLoading } = useFleetStatus();

  // Modal state for assigning vehicle
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [assigning, setAssigning] = useState(false);

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

  // Unified function to complete any reservation
  const handleCompleteReservation = async (
    reservationId: string,
    currentVehicleId?: string
  ) => {
    if (!reservationId) {
      alert("Invalid reservation");
      return;
    }

    if (!confirm("Mark this reservation as completed and free the vehicle?")) {
      return;
    }

    try {
      const patchRes = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          vehicle: null,
        }),
      });

      if (!patchRes.ok) {
        const error = await patchRes.json();
        alert(error.message || "Failed to complete reservation");
        return;
      }

      if (currentVehicleId) {
        const patchVehicle = await fetch(`/api/vehicles/${currentVehicleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: true }),
        });

        if (!patchVehicle.ok) {
          alert(
            "Reservation completed, but failed to mark vehicle as available."
          );
        }
      }

      alert("Reservation completed successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  const openAssignModal = async (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setSelectedVehicleId("");
    setIsAssignModalOpen(true);

    try {
      const response = await fetch("/api/vehicles?available=true&limit=100");
      const result = await response.json();

      if (result.success && result.data) {
        setAvailableVehicles(result.data);
      } else {
        alert("No available vehicles found.");
        setAvailableVehicles([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load available vehicles.");
      setAvailableVehicles([]);
    }
  };

  const assignVehicle = async () => {
    if (!selectedReservationId || !selectedVehicleId) return;

    setAssigning(true);
    try {
      const res = await fetch(`/api/reservations/${selectedReservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle: selectedVehicleId,
          status: "delivered", // Important: now the van is delivered
        }),
      });

      if (res.ok) {
        setIsAssignModalOpen(false);
        setSelectedReservationId(null);
        setSelectedVehicleId("");
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to assign vehicle");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  const handleEditVehicle = (vehicleId: string) => {
    sessionStorage.setItem("editVehicleId", vehicleId);
    handleTabChange("vehicles");
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-linear-to-br ${stat.color} p-6 rounded-2xl border border-white/10 text-white`}
          >
            <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-gray-200 text-sm mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-white">
              {statsLoading ? "-" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* New Section: Today's Activity */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-black text-white mb-4">Today's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Pickups */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Today's Pickups ({todayActivity.pickups.length})
            </h4>
            {fleetLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : todayActivity.pickups.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No pickups scheduled today
              </p>
            ) : (
              <div className="space-y-2">
                {todayActivity.pickups.map((res) => (
                  <div
                    key={res._id}
                    className="bg-white/5 rounded-lg p-3 text-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {res.vehicle
                            ? `${res.vehicle.title} (${res.vehicle.number})`
                            : "Vehicle not assigned yet"}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {res.category.name} • Pickup:{" "}
                          {new Date(res.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                      
                          <button
                            onClick={() => openAssignModal(res._id)}
                            className="px-4 py-1.5 text-xs bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded font-semibold transition"
                          >
                            Assign Vehicle
                          </button>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Returns */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Today's Returns ({todayActivity.returns.length})
            </h4>
            {fleetLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : todayActivity.returns.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No returns scheduled today
              </p>
            ) : (
              <div className="space-y-2">
                {todayActivity.returns.map((res) => (
                  <div
                    key={res._id}
                    className="bg-white/5 rounded-lg p-3 text-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {res.vehicle
                            ? `${res.vehicle.title} (${res.vehicle.number})`
                            : "No vehicle assigned"}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {res.category.name} • Return by:{" "}
                          {new Date(res.endDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium bg-blue-900 text-blue-300`}
                        >
                          Delivered
                        </span>

                        <button
                          onClick={() =>
                            handleCompleteReservation(res._id, res.vehicle._id)
                          }
                          className="px-4 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reserves */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-white">Recent Reserves</h3>
          <button
            onClick={() => handleTabChange("reserves")}
            className="text-sm font-medium text-[#fe9a00] hover:text-orange-400 transition-colors"
          >
            See All →
          </button>
        </div>

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
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        res.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : res.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : res.status === "delivered"
                          ? "bg-purple-500/20 text-purple-400"
                          : res.status === "completed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </span>
                  </div>
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

      {/* Assign Vehicle Modal */}

      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl border border-white/10 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Assign Vehicle</h3>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedReservationId(null);
                  setSelectedVehicleId("");
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                disabled={assigning}
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Vehicles Today
                </label>

                <CustomSelect
                  options={availableVehicles.map((veh) => ({
                    _id: veh._id,
                    name: `${veh.title} (${veh.number}) — ${
                      veh.office?.name || "Unknown Office"
                    }`,
                  }))}
                  value={selectedVehicleId}
                  onChange={(val) => setSelectedVehicleId(val)}
                  placeholder={
                    availableVehicles.length === 0
                      ? "No available vehicles today"
                      : "Search and select vehicle..."
                  }
                />
              </div>

              {availableVehicles.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No vehicles are available for assignment today.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedReservationId(null);
                  setSelectedVehicleId("");
                }}
                disabled={assigning}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={assignVehicle}
                disabled={
                  !selectedVehicleId ||
                  assigning ||
                  availableVehicles.length === 0
                }
                className="flex-1 px-4 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? "Assigning..." : "Assign Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
