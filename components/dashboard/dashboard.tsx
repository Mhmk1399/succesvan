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
import { showToast } from "@/lib/toast";

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
      tabId: "vehicles",
    },
    {
      label: "All Reserves",
      value: stats.reservations,
      icon: <FiClipboard />,
      color: "from-indigo-500 to-indigo-600",
      tabId: "reserves",
    },
    {
      label: "Offices",
      value: stats.offices,
      icon: <FiMapPin />,
      color: "from-green-500 to-green-600",
      tabId: "offices",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: <FiTag />,
      color: "from-pink-500 to-pink-600",
      tabId: "categories",
    },
  ];

  const handleCompleteReservation = async (
    reservationId: string,
    currentVehicleId?: string
  ) => {
    if (!reservationId) {
      showToast.error("Invalid reservation");
      return;
    }

    try {
      const patchRes = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", vehicle: null }),
      });

      if (!patchRes.ok) {
        const error = await patchRes.json();
        showToast.error(error.message || "Failed to complete reservation");
        return;
      }

      if (currentVehicleId) {
        const patchVehicle = await fetch(`/api/vehicles/${currentVehicleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: true }),
        });

        if (!patchVehicle.ok) {
          showToast.error("Reservation completed, but failed to free vehicle.");
          return;
        }
      }

      showToast.success("Reservation completed successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      showToast.error("Network error. Please try again.");
    }
  };

  const openAssignModal = async (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setSelectedVehicleId("");
    setIsAssignModalOpen(true);

    try {
      const response = await fetch("/api/vehicles?available=true&limit=100");
      const result = await response.json();

      if (result.success && result.data?.length > 0) {
        setAvailableVehicles(result.data);
      } else {
        showToast.error("No available vehicles found today.");
        setAvailableVehicles([]);
      }
    } catch (err) {
      console.error(err);
      showToast.error("Failed to load available vehicles.");
      setAvailableVehicles([]);
    }
  };

  const assignVehicle = async () => {
  if (!selectedReservationId || !selectedVehicleId) {
    showToast.error("Please select a vehicle");
    return;
  }

  setAssigning(true);

  try {
    // Step 1: Update the vehicle — set available = false
    const vehicleUpdateRes = await fetch(`/api/vehicles/${selectedVehicleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: false }),
    });

    if (!vehicleUpdateRes.ok) {
      const errorData = await vehicleUpdateRes.json();
      showToast.error(errorData.message || "Failed to update vehicle status");
      setAssigning(false);
      return;
    }

    // Step 2: Update the reservation — assign vehicle + set status to delivered
    const reservationUpdateRes = await fetch(`/api/reservations/${selectedReservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle: selectedVehicleId,
        status: "delivered",
      }),
    });

    if (!reservationUpdateRes.ok) {
      const errorData = await reservationUpdateRes.json();
      
      // If reservation update fails, try to rollback vehicle availability
      await fetch(`/api/vehicles/${selectedVehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: true }),
      });

      showToast.error(errorData.message || "Failed to assign vehicle to reservation");
      setAssigning(false);
      return;
    }

    // Success!
    showToast.success("Vehicle successfully assigned and marked as in use!");
    
    setIsAssignModalOpen(false);
    setSelectedReservationId(null);
    setSelectedVehicleId("");
    
    // Refresh page to reflect changes
    window.location.reload();
  } catch (err) {
    console.error("Assignment error:", err);
    showToast.error("Network error. Please try again.");
  } finally {
    setAssigning(false);
  }
};

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleTabChange(stat.tabId)}
            className={`bg-linear-to-br ${stat.color} p-3 rounded-2xl border border-white/10 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
          >
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="bg-white/20 p-3 rounded-lg">
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-xl font-black">
                {statsLoading ? "-" : stat.value}
              </p>
              <p className="text-gray-200 text-xs font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Activity */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-black text-white mb-6">Today's Activity</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Pickups */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Today's Pickups</span>
              <span className="text-sm font-normal text-gray-400">
                ({todayActivity.pickups.length})
              </span>
            </h4>

            {fleetLoading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : todayActivity.pickups.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No pickups scheduled today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayActivity.pickups.map((res: any) => (
                  <div
                    key={res._id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#fe9a00]/30 transition"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-white">
                          {res.vehicle
                            ? `${res.vehicle.title} (${res.vehicle.number})`
                            : "No vehicle assigned"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {res.category.name} • Pickup at{" "}
                          {new Date(res.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm font-medium text-[#fe9a00] mt-2">
                          Total: £{res.totalPrice}
                        </p>
                      </div>

                      <button
                        onClick={() => openAssignModal(res._id)}
                        className="px-5 py-2 text-sm bg-[#fe9a00] hover:bg-[#e68a00] text-white font-bold rounded-lg transition shadow-md"
                      >
                        Assign Vehicle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Returns */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Today's Returns</span>
              <span className="text-sm font-normal text-gray-400">
                ({todayActivity.returns.length})
              </span>
            </h4>

            {fleetLoading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : todayActivity.returns.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No returns scheduled today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayActivity.returns.map((res: any) => (
                  <div
                    key={res._id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-green-500/30 transition"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-white">
                          {res.vehicle.title} ({res.vehicle.number})
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {res.category.name} • Due by{" "}
                          {new Date(res.endDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm font-medium text-[#07da54] mt-2">
                          Paid: £{res.totalPrice}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                    
                        <button
                          onClick={() =>
                            handleCompleteReservation(res._id, res.vehicle._id)
                          }
                          className="px-5 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition shadow-md"
                        >
                          Mark Complete
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

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white">Recent Reserves</h3>
          <button
            onClick={() => handleTabChange("reserves")}
            className="text-sm font-bold text-[#fe9a00] hover:text-orange-400 transition"
          >
            See All →
          </button>
        </div>

        {reservationsLoading ? (
          <p className="text-gray-500 text-center py-8">
            Loading reservations...
          </p>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No reservations yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res: any) => (
              <div
                key={res._id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#fe9a00]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-bold">
                      Reserve #{res._id?.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(res.createdAt!).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      res.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : res.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : res.status === "delivered"
                        ? "bg-purple-500/20 text-purple-400"
                        : res.status === "completed"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {res.status === "delivered" ? "collected" : res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Price</p>
                    <p className="text-[#fe9a00] font-bold text-lg">
                      £{res.totalPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pickup</p>
                    <p className="text-white font-medium">
                      {new Date(res.startDate!).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Return</p>
                    <p className="text-white font-medium">
                      {new Date(res.endDate!).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="text-white font-medium">
                      {res.category.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Vehicle Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl border border-white/10 p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white">Assign Vehicle</h3>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedReservationId(null);
                  setSelectedVehicleId("");
                }}
                disabled={assigning}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <FiX className="text-white text-2xl" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">
                  Select Available Vehicle
                </label>

                <CustomSelect
                  options={availableVehicles.map((veh) => ({
                    _id: veh._id,
                    name: `${veh.title}  (${veh.number}) — ${
                      veh.office?.name || "No Office"
                    }`,
                  }))}
                  value={selectedVehicleId}
                  onChange={(val) => setSelectedVehicleId(val)}
                  placeholder={
                    availableVehicles.length === 0
                      ? "No vehicles available today"
                      : "Choose a vehicle..."
                  }
                />
              </div>

              {availableVehicles.length === 0 && (
                <p className="text-center text-gray-500 py-6">
                  No vehicles are currently available for assignment.
                </p>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedReservationId(null);
                  setSelectedVehicleId("");
                }}
                disabled={assigning}
                className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition"
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
                className="flex-1 py-3.5 bg-linear-to-r from-[#fe9a00] to-[#ff8800] hover:from-[#ff8800] hover:to-[#fe9a00] text-black font-bold rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? "Assigning..." : "Assign & Deliver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
