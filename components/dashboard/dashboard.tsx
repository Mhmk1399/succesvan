"use client";

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import {
  FiHome,
  FiMapPin,
  FiTruck,
  FiCalendar,
  FiTag,
  FiClipboard,
  FiMenu,
  FiX,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiUser,
  FiMessageSquare,
  FiBarChart2,
  FiGrid,
  FiMessageCircle,
  FiPackage,
  FiPercent,
  FiPlusCircle,
  FiSun,
  FiVolume2,
  FiUsers,
} from "react-icons/fi";
import { useStats } from "../../hooks/useStats";
import { useRecentReservations } from "../../hooks/useRecentReservations";
import { useFleetStatus } from "../../hooks/useFleetStatus";
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
import { Category, MenuItem } from "../../types/type";
import DiscountManagement from "./DiscountManagement";
import CustomSelect from "../ui/CustomSelect";
import { showToast } from "../../lib/toast";
import AddPostBlog from "./addBlog";
import TicketsManagement from "./TicketsManagement";
import { FiPlus, FiFileText } from "react-icons/fi";

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
    icon: <FiPackage />, // Better than Layers — represents vehicle types/models
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
    icon: <FiGrid />, // Better than Tag — categories are like a grid of groups
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
    icon: <FiSun />, // Much better than Calendar — clearly represents holidays/special days
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "addons",
    label: "AddOns",
    icon: <FiPlusCircle />, // Perfect — represents extra add-ons
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "discounts",
    label: "Discounts",
    icon: <FiPercent />, // Perfect and instantly recognizable
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
    icon: <FiMessageCircle />, // Better than Command — represents customer reviews
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "contacts",
    label: "Users",
    icon: <FiUsers />, // Better than Users — contacts are inquiries/messages
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: <FiVolume2 />, // Perfect — like broadcasting news
    color: "from-rose-500 to-rose-600",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FiBarChart2 />, // Much better than FileText — reports = analytics
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "tickets",
    label: "Tickets",
    icon: <FiMessageSquare />,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: <FiFileText />,
    color: "from-violet-500 to-violet-600",
  },
];

interface User {
  name: string;
  lastName: string;
  role: string;
  emailData?: {
    emailAddress: string;
  };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.log("Failed to parse user data");
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a101f]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#111827] border-r border-white/5 z-50 transition-all duration-300 flex flex-col
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          ${sidebarCollapsed ? "w-18" : "w-56"}`}
      >
        {/* Logo */}
        <div
          className={`h-17.25 flex items-center border-b   border-white/5 ${
            sidebarCollapsed ? "justify-center px-2" : "px-4"
          }`}
        >
          {sidebarCollapsed ? (
            <Image
              src="https://svh-bucket-s3.s3.eu-west-2.amazonaws.com/images/newww.png"
              alt="SuccessVan"
              width={50}
              height={28}
              className="object-contain mr-3 mt-2"
            />
          ) : (
            <div className="flex items-center justify-center  ml-8 mt-4">
              <Image
                src="https://svh-bucket-s3.s3.eu-west-2.amazonaws.com/images/newww.png"
                alt="SuccessVan"
                width={120}
                height={36}
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => {
                  handleTabChange(item.id);
                }}
                className={`w-full flex items-center cursor-pointer gap-3 px-3 py-2 rounded-lg transition-all duration-200 mb-1
                  ${
                    activeTab === item.id
                      ? "bg-[#fe9a00] text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                  ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <span
                  className={`text-base  shrink-0 ${
                    activeTab === item.id ? "text-white" : "text-[#fe9a00]"
                  }`}
                >
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm truncate">
                    {item.label}
                  </span>
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-3 w-8 h-8 bg-[#1f2937] border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white hover:bg-[#fe9a00] transition-all duration-200 shadow-lg z-60"
        >
          {sidebarCollapsed ? (
            <FiChevronRight size={16} />
          ) : (
            <FiChevronLeft size={16} />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300   ${
          sidebarCollapsed ? "lg:ml-18" : "lg:ml-56"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#111827]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between z-40">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors shrink-0"
            >
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="truncate">
                  {menuItems.find((item) => item.id === activeTab)?.label}
                </span>
                <span className="hidden md:flex items-center gap-1 text-xs text-gray-400 font-medium shrink-0">
                  <FiCalendar className="text-[#fe9a00] text-sm" />
                  {new Date().toLocaleDateString("en-GB", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block truncate">
                Welcome back, {user?.name || "Admin"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-[#fe9a00] hover:bg-[#e68a00] text-white font-semibold rounded-lg transition-colors text-sm"
            >
              <span>Visit Site</span>
              <FiExternalLink size={14} />
            </Link>

            <div className="flex items-center gap-3 md:bg-white/5 rounded-lg md:px-3 py-1">
              <div className=" flex flex-col text-right mr-2 min-w-0">
                <span className="text-white text-xs md:text-sm font-semibold truncate">
                  {user?.name}  
                </span>
                <span className="text-gray-400 text-[10px] md:text-xs truncate">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                title="Logout"
                className="p-2 rounded-md hover:bg-white/10 transition"
              >
                <FiLogOut className="text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-5">
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
          {activeTab === "tickets" && <TicketsManagement />}
          {activeTab === "blogs" && <AddPostBlog />}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl border border-white/10 w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
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

interface DashboardContentProps {
  handleTabChange: (tabId: string) => void;
}
interface Reservation {
  _id: string;
  category: Category;
  selectedGear?: "manual" | "automatic";
  startDate: string;
  totalPrice: number;
  vehicle?: {
    _id: string;
    title: string;
    number: string;
  };
  status: string;
}
interface TodayActivity {
  pickups: Reservation[];
  returns: Reservation[];
}

function DashboardContent({ handleTabChange }: DashboardContentProps) {
  const { stats, isLoading: statsLoading } = useStats();
  const { reservations, isLoading: reservationsLoading } =
    useRecentReservations();
  const { todayActivity, isLoading: fleetLoading } =
    useFleetStatus() as unknown as {
      todayActivity: TodayActivity;
      isLoading: boolean;
    };
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [assigning, setAssigning] = useState(false);

  const statCards = [
    {
      label: "Vehicles",
      value: stats.vehicles,
      icon: <FiTruck />,
      color: "bg-orange-500",
      tabId: "vehicles",
    },
    {
      label: "Reserves",
      value: stats.reservations,
      icon: <FiClipboard />,
      color: "bg-indigo-500",
      tabId: "reserves",
    },
    {
      label: "Offices",
      value: stats.offices,
      icon: <FiMapPin />,
      color: "bg-emerald-500",
      tabId: "offices",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: <FiTag />,
      color: "bg-pink-500",
      tabId: "categories",
    },
  ];

  useEffect(() => {
    const loadAvailableVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles?available=true&limit=500");
        const result = await response.json();
        if (result.success && result.data) {
          setAvailableVehicles(result.data);
        }
      } catch (err) {
        console.log("Failed to load available vehicles for matching", err);
      }
    };

    loadAvailableVehicles();
  }, []);

  const handleCompleteReservation = async (
    reservationId: string,
    currentVehicleId?: string,
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
      console.log(err);
      showToast.error("Network error. Please try again.");
    }
  };

  const openAssignModal = async (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setSelectedVehicleId("");
    setIsAssignModalOpen(true);
  };

  const assignVehicle = async () => {
    if (!selectedReservationId || !selectedVehicleId) {
      showToast.error("Please select a vehicle");
      return;
    }

    setAssigning(true);

    try {
      const vehicleUpdateRes = await fetch(
        `/api/vehicles/${selectedVehicleId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: false }),
        },
      );

      if (!vehicleUpdateRes.ok) {
        const errorData = await vehicleUpdateRes.json();
        showToast.error(errorData.message || "Failed to update vehicle status");
        setAssigning(false);
        return;
      }

      const reservationUpdateRes = await fetch(
        `/api/reservations/${selectedReservationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicle: selectedVehicleId,
            status: "delivered",
          }),
        },
      );

      if (!reservationUpdateRes.ok) {
        const errorData = await reservationUpdateRes.json();

        await fetch(`/api/vehicles/${selectedVehicleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: true }),
        });

        showToast.error(
          errorData.message || "Failed to assign vehicle to reservation",
        );
        setAssigning(false);
        return;
      }

      showToast.success("Vehicle successfully assigned and marked as in use!");

      setIsAssignModalOpen(false);
      setSelectedReservationId(null);
      setSelectedVehicleId("");

      window.location.reload();
    } catch (err) {
      console.log("Assignment error:", err);
      showToast.error("Network error. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Quick Actions */}

      {/* Stats Cards - Compact Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleTabChange(stat.tabId)}
            className="bg-[#111827] border border-white/5 rounded-xl p-4 hover:border-[#fe9a00]/30 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2.5 rounded-lg`}>
                <span className="text-white text-base">{stat.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? "-" : stat.value}
                </p>
                <p className="text-gray-500 text-xs font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Activity */}
      <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-white">Today's Activity</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          {/* Today's Pickups */}

          {/* Today's Pickups */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-[#fe9a00] rounded-full"></span>
                Pickups
              </h4>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {todayActivity.pickups.length}
              </span>
            </div>

            {fleetLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-[#fe9a00] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : todayActivity.pickups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No pickups today</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar">
                {todayActivity.pickups.map((res: any) => {
                  // آیا حداقل یک خودرو با دسته‌بندی + گیربکس مطابق موجود است؟
                  const hasExactMatch = availableVehicles.some((veh: any) => {
                    return (
                      veh.available &&
                      veh.category?._id === res.category._id &&
                      res.selectedGear &&
                      veh.gear?.availableTypes?.some(
                        (g: any) => g.gearType === res.selectedGear,
                      )
                    );
                  });

                  // آیا حداقل یک خودرو در این دسته‌بندی موجود است (حتی با گیربکس متفاوت)؟
                  const hasAnyVehicleInCategory = availableVehicles.some(
                    (veh: any) => {
                      return (
                        veh.available && veh.category?._id === res.category._id
                      );
                    },
                  );

                  return (
                    <div
                      key={res._id}
                      className="bg-white/5 rounded-lg p-3 hover:bg-white/[0.07] transition"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm truncate">
                            {res.vehicle
                              ? `${res.vehicle.title} (${res.vehicle.number})`
                              : "No vehicle assigned"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {res.category.name} •{" "}
                            {new Date(res.startDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {res.selectedGear && (
                              <span className="ml-2 text-[#fe9a00] font-medium uppercase">
                                ({res.selectedGear})
                              </span>
                            )}
                          </p>
                          <p className="text-xs font-medium text-[#fe9a00] mt-1">
                            £{res.totalPrice}
                          </p>
                        </div>

                        {/* فقط اگر دقیقاً گیربکس مطابق بود، دکمه Assign فعال باشه */}
                        {!res.vehicle && hasExactMatch && (
                          <button
                            onClick={() => openAssignModal(res._id)}
                            className="px-3 py-1.5 text-xs bg-[#fe9a00] hover:bg-[#e68a00] text-white font-semibold rounded-lg transition whitespace-nowrap"
                          >
                            Assign
                          </button>
                        )}

                        {/* اگر خودرو در دسته‌بندی هست ولی گیربکس مطابق نیست */}
                        {!res.vehicle &&
                          !hasExactMatch &&
                          hasAnyVehicleInCategory && (
                            <div className="text-right space-y-0.5">
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-xs text-orange-400 font-medium">
                                  Gearbox not matching
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500">
                                Requested:{" "}
                                <span className="text-[#fe9a00] font-medium uppercase">
                                  {res.selectedGear}
                                </span>
                                <br />
                                Available vehicles have different gearbox
                              </p>
                            </div>
                          )}

                        {/* اگر اصلاً خودروی موجودی در دسته‌بندی نیست */}
                        {!res.vehicle && !hasAnyVehicleInCategory && (
                          <span className="text-xs text-red-400 font-medium">
                            No vehicle available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Today's Returns */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Returns
              </h4>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {todayActivity.returns.length}
              </span>
            </div>

            {fleetLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : todayActivity.returns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No returns today</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar">
                {todayActivity.returns.map((res: any) => (
                  <div
                    key={res._id}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/[0.07] transition"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">
                          {res.vehicle.title} ({res.vehicle.number})
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {res.category.name} • Due{" "}
                          {new Date(res.endDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs font-medium text-emerald-400 mt-1">
                          £{res.totalPrice}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleCompleteReservation(res._id, res.vehicle._id)
                        }
                        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition whitespace-nowrap"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reserves */}
      <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Recent Reserves</h3>
          <button
            onClick={() => handleTabChange("reserves")}
            className="text-xs font-semibold text-[#fe9a00] hover:text-orange-400 transition"
          >
            View All →
          </button>
        </div>

        <div className="p-5">
          {reservationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#fe9a00] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No reservations yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reservations.map((res: any) => (
                <div
                  key={res._id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/[0.07] transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold text-sm">
                        #{res._id?.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(res.createdAt!).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
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
                      {res.status === "delivered" ? "collected" : res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 mb-0.5">Total</p>
                      <p className="text-[#fe9a00] font-bold">
                        £{res.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5">Pickup</p>
                      <p className="text-white font-medium">
                        {new Date(res.startDate!).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5">Return</p>
                      <p className="text-white font-medium">
                        {new Date(res.endDate!).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5">Category</p>
                      <p className="text-white font-medium truncate">
                        {res.category.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign Vehicle Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Assign Vehicle</h3>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedReservationId(null);
                  setSelectedVehicleId("");
                }}
                disabled={assigning}
                className="p-1.5 hover:bg-white/10 rounded-lg transition"
              >
                <FiX className="text-gray-400 text-lg" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Available Vehicles in Category
                </label>

                {(() => {
                  const currentRes = todayActivity.pickups.find(
                    (r: any) => r._id === selectedReservationId,
                  );

                  if (!currentRes) return null;

                  const categoryVehicles = availableVehicles.filter(
                    (veh: any) =>
                      veh.available &&
                      veh.category?._id === currentRes.category._id,
                  );

                  const requestedGear = currentRes.selectedGear;

                  return (
                    <>
                      {requestedGear && (
                        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <p className="text-sm text-white">
                            Customer requested:{" "}
                            <span className="font-bold text-[#fe9a00] uppercase">
                              {requestedGear}
                            </span>{" "}
                            gearbox
                          </p>
                        </div>
                      )}

                      <CustomSelect
                        options={categoryVehicles.map((veh: any) => {
                          const vehicleGears = veh.gear?.availableTypes || [];
                          const hasMatchingGear = requestedGear
                            ? vehicleGears.some(
                                (g: any) => g.gearType === requestedGear,
                              )
                            : true;

                          return {
                            _id: veh._id,
                            name: `${veh.title} (${veh.number}) — ${
                              veh.office?.name || "No Office"
                            }`,
                            suffix:
                              vehicleGears.length > 0
                                ? ` [${vehicleGears
                                    .map((g: any) => g.gearType.toUpperCase())
                                    .join("/")}]`
                                : " [No Gear Info]",
                            disabled: !hasMatchingGear, // مهم: غیرفعال کن اگر گیربکس مطابقت نداره
                          };
                        })}
                        value={selectedVehicleId}
                        onChange={(val) => setSelectedVehicleId(val)}
                        placeholder={
                          categoryVehicles.length === 0
                            ? "No vehicles available in this category"
                            : "Select a vehicle..."
                        }
                      />

                      {requestedGear &&
                        categoryVehicles.length > 0 &&
                        !categoryVehicles.some((v) =>
                          v.gear?.availableTypes?.some(
                            (g: any) => g.gearType === requestedGear,
                          ),
                        ) && (
                          <p className="text-center text-red-400 text-sm mt-4 font-medium">
                            ⚠️ No vehicle with requested {requestedGear} gearbox
                            available.
                            <br />
                            <span className="text-xs text-gray-400">
                              You can still assign a different gearbox if
                              necessary.
                            </span>
                          </p>
                        )}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedReservationId(null);
                  setSelectedVehicleId("");
                }}
                disabled={assigning}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition text-sm"
              >
                Cancel
              </button>

              <button
                onClick={assignVehicle}
                disabled={!selectedVehicleId || assigning}
                className="flex-1 py-2.5 bg-[#fe9a00] hover:bg-[#e68a00] text-white font-semibold rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Assigning...
                  </span>
                ) : (
                  "Assign & Deliver"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
