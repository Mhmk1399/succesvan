"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  FiMenu,
  FiX,
  FiClipboard,
  FiUser,
  FiTag,
  FiExternalLink,
  FiLogOut,
  FiAlertCircle,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import ProfileContent from "./ProfileContent";
import DynamicTableView from "../dashboard/DynamicTableView";
import { Reservation } from "@/types/type";
import { showToast } from "@/lib/toast";
import { DateRange, Range } from "react-date-range";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import TimeSelect from "@/components/ui/TimeSelect";
import { generateTimeSlots } from "@/utils/timeSlots";
import AddOnsModal from "@/components/global/AddOnsModal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const menuItems = [
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
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("reserves");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hasLicense, setHasLicense] = useState(true);
  const [hasAddress, setHasAddress] = useState(true);
  const [scrollToSection, setScrollToSection] = useState<
    "license" | "address" | null
  >(null);

  const checkLicenseStatus = () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && typeof userData === "object") {
          const hasLicenseUploaded =
            userData.licenceAttached?.front && userData.licenceAttached?.back;
          setHasLicense(hasLicenseUploaded);
          const hasAddressData =
            userData.address && userData.address.trim() !== "";
          setHasAddress(hasAddressData);
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
        if (userData && typeof userData === "object") {
          const hasLicenseUploaded =
            userData.licenceAttached?.front && userData.licenceAttached?.back;

          const urlParams = new URLSearchParams(window.location.search);
          if (
            urlParams.get("uploadLicense") === "true" &&
            !hasLicenseUploaded
          ) {
            showToast.error(
              "Your reservation is pending. Please upload your Licenses to confirm your reservation."
            );
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

  const handleTabChange = (tabId: string, section?: "license" | "address") => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    setSidebarOpen(false);
    if (section) {
      setScrollToSection(section);
      setTimeout(() => setScrollToSection(null), 500);
    }
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
              <FiAlertCircle className="text-yellow-500 text-xl mt-0.5 shrink-0" />
              <div>
                <h3 className="text-yellow-500 font-bold mb-1">
                  Licenses Required
                </h3>
                <p className="text-gray-300 text-sm">
                  Your reservations are pending. Please upload your driver's
                  Licenses in the Profile section to confirm your bookings.
                </p>
                <button
                  onClick={() => handleTabChange("profile", "license")}
                  className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-semibold text-sm"
                >
                  Upload Licenses Now
                </button>
              </div>
            </div>
          )}
          {!hasAddress && (
            <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
              <FiAlertCircle className="text-blue-500 text-xl mt-0.5 shrink-0" />
              <div>
                <h3 className="text-blue-500 font-bold mb-1">
                  Address Required
                </h3>
                <p className="text-gray-300 text-sm">
                  Please add your address in the Profile section to complete
                  your profile.
                </p>
                <button
                  onClick={() => handleTabChange("profile", "address")}
                  className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold text-sm"
                >
                  Add Address Now
                </button>
              </div>
            </div>
          )}

          {activeTab === "reserves" && <ReservesContent />}
          {activeTab === "profile" && (
            <ProfileContent
              onLicenseUpdate={checkLicenseStatus}
              scrollToSection={scrollToSection}
            />
          )}
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
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && typeof userData === "object" && userData._id) {
          setUserId(userData._id);
          const hasLicenseUploaded =
            userData.licenceAttached?.front && userData.licenceAttached?.back;
          setHasLicense(hasLicenseUploaded);
        }
      } catch (error) {
        console.log("Failed to parse user data:", error);
      }
    }
  }, []);

  const handleViewDetails = (item: Reservation) => {
    setSelectedReservation(item);
    setIsDetailOpen(true);
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/reservations/${selectedReservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "canceled" }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Cancel failed");

      showToast.success("Reservation canceled successfully!");
      setIsDetailOpen(false);
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Cancel failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return <div className="text-gray-400">Loading reservations...</div>;
  }

  return (
    <>
      <DynamicTableView<Reservation>
        apiEndpoint={`/api/reservations?userId=${userId}`}
        title="Reservation"
        hideDelete
        hiddenColumns={[]}
        onEdit={handleViewDetails}
        columns={[
          {
            key: "office" as keyof Reservation,
            label: "Office",
            render: (value: any) => {
              if (typeof value === "object" && value?.name) {
                return value.name;
              }
              return value || "-";
            },
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
            render: (value: any) => {
              if (
                typeof value === "object" &&
                value !== null &&
                value?.amount !== undefined
              ) {
                return <span>£{value.amount}</span>;
              }
              if (typeof value === "number") {
                return <span>£{value}</span>;
              }
              return <span>£0</span>;
            },
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

      {isDetailOpen && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">
                Reservation Details
              </h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Reservation Details */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">
                  Reservation Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Office</p>
                    <p className="text-white font-semibold">
                      {(selectedReservation.office as any)?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Category</p>
                    <p className="text-white font-semibold">
                      {(selectedReservation as any).category?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Start Date & Time</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedReservation.startDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">End Date & Time</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedReservation.endDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Price</p>
                    <p className="text-white font-semibold">
                      £{selectedReservation.totalPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedReservation.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : selectedReservation.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : selectedReservation.status === "canceled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {selectedReservation.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              {selectedReservation.addOns &&
                selectedReservation.addOns.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">Add-ons</h3>
                    <div className="space-y-2">
                      {selectedReservation.addOns.map(
                        (item: any, idx: number) => {
                          const addon = item.addOn;
                          let price = 0;

                          if (addon?.pricingType === "flat") {
                            price =
                              typeof addon.flatPrice === "object"
                                ? addon.flatPrice?.amount || 0
                                : addon.flatPrice || 0;
                          } else if (addon?.pricingType === "tiered") {
                            const tierIndex = item.selectedTierIndex ?? 0;
                            const tier = addon.tieredPrice?.tiers?.[tierIndex];
                            if (tier) {
                              price = tier.price;
                            }
                          }

                          return (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-white font-semibold">
                                {addon?.name || "Unknown"}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-gray-400">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-white font-semibold">
                                  £{price}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {/* Message */}
              {selectedReservation.messege && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">Message</h3>
                  <p className="text-gray-300 text-sm">
                    {selectedReservation.messege}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                >
                  Close
                </button>
                {selectedReservation.status === "pending" && (
                  <button
                    onClick={handleCancelReservation}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? "Canceling..." : "Cancel Reservation"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DiscountsContent() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch("/api/discounts?status=active");
      const data = await res.json();
      if (data.success) {
        const activeDiscounts = (data.data.data || data.data).filter(
          (d: any) => {
            const now = new Date();
            const validFrom = new Date(d.validFrom);
            const validTo = new Date(d.validTo);
            return (
              d.status === "active" &&
              now >= validFrom &&
              now <= validTo &&
              (!d.usageLimit || d.usageCount < d.usageLimit)
            );
          }
        );
        setDiscounts(activeDiscounts);
      }
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast.success("Code copied to clipboard!");
  };

  if (loading) {
    return <div className="text-gray-400">Loading discounts...</div>;
  }

  if (discounts.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <FiTag className="text-gray-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-black text-white mb-2">
          No Active Discounts
        </h3>
        <p className="text-gray-400">
          Check back later for new discount codes!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discounts.map((discount) => (
          <div
            key={discount._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#fe9a00]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white">{discount.code}</h3>
              <span className="text-2xl font-black text-[#fe9a00]">
                {discount.percentage}%
              </span>
            </div>
            {discount.categories?.length > 0 && (
              <p className="text-gray-400 text-sm mb-2">
                Valid for:{" "}
                {discount.categories.map((c: any) => c.name).join(", ")}
              </p>
            )}
            <p className="text-gray-500 text-xs mb-4">
              Valid until {new Date(discount.validTo).toLocaleDateString()}
              {discount.usageLimit && (
                <span className="ml-2">
                  • {discount.usageLimit - discount.usageCount} uses left
                </span>
              )}
            </p>
            <button
              onClick={() => copyCode(discount.code)}
              className="w-full px-4 py-2 bg-[#fe9a00]/20 text-[#fe9a00] rounded-lg hover:bg-[#fe9a00]/30 transition-colors font-semibold text-sm"
            >
              Copy Code
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
