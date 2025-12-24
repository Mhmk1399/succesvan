"use client";

import { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import DynamicTableView from "./DynamicTableView";
import { Reservation } from "@/types/type";
import CustomSelect from "@/components/ui/CustomSelect";

export default function ReservationsManagement() {
  const mutateRef = useRef<(() => Promise<any>) | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newVehicle, setNewVehicle] = useState("");
  const [vehicles, setVehicles] = useState<{ _id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles");
        const data = await res.json();
        setVehicles(
          (data.data || []).map((vehicle: any) => ({
            _id: vehicle._id,
            name: vehicle.title || vehicle.number || "Unknown",
          }))
        );
      } catch (error) {
        console.log("Failed to fetch vehicles:", error);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleViewDetails = (item: Reservation) => {
    setSelectedReservation(item);
    setNewVehicle(
      typeof item.vehicle === "string" ? item.vehicle : item.vehicle?._id || ""
    );
    setIsDetailOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedReservation || !newStatus) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/reservations/${selectedReservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");

      showToast.success("Status updated successfully!");
      setIsStatusOpen(false);
      setNewStatus("");
      if (mutateRef.current) mutateRef.current();
      setIsDetailOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVehicleUpdate = async () => {
    if (!selectedReservation) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/reservations/${selectedReservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle: newVehicle || null }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");

      showToast.success("Vehicle updated successfully!");
      setIsEditOpen(false);
      if (mutateRef.current) mutateRef.current();
      setIsDetailOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DynamicTableView<Reservation>
        apiEndpoint="/api/reservations"
        title="Reservation"
        columns={[
          {
            key: "user",
            label: "User",
            render: (value: any) => value?.name || "-",
          },
          {
            key: "office",
            label: "Office",
            render: (value: any) => value?.name || "-",
          },
          {
            key: "startDate",
            label: "Start Date",
            render: (value: string) => new Date(value).toLocaleString() || "-",
          },
          {
            key: "endDate",
            label: "End Date",
            render: (value: string) => new Date(value).toLocaleString() || "-",
          },
          { key: "totalPrice", label: "Total Price" },
          {
            key: "status",
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
          { key: "driverAge", label: "Driver Age" },
        ]}
        onEdit={handleViewDetails}
        onMutate={(mutate) => (mutateRef.current = mutate)}
        hiddenColumns={["driverAge"] as (keyof Reservation)[]}
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
              {/* User Information */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">
                  User Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="text-white font-semibold">
                      {selectedReservation.user?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white font-semibold">
                      {selectedReservation.user?.emaildata?.emailAddress || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white font-semibold">
                      {selectedReservation.user?.phoneData?.phoneNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Driver Age</p>
                    <p className="text-white font-semibold">
                      {selectedReservation.driverAge}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">
                  Reservation Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Office</p>
                    <p className="text-white font-semibold">
                      {selectedReservation.office?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Category</p>
                    <p className="text-white font-semibold">
                      {(selectedReservation as any).category?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Vehicle</p>
                    <p className="text-white font-semibold">
                      {(selectedReservation as any).vehicle?.title || "-"}
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
                    <p className="text-gray-400">Duration</p>
                    <p className="text-white font-semibold">
                      {Math.ceil(
                        (new Date(selectedReservation.endDate).getTime() -
                          new Date(selectedReservation.startDate).getTime()) /
                          (1000 * 60 * 60)
                      )}{" "}
                      hours
                    </p>
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
                          let tierInfo = "";

                          if (addon?.pricingType === "flat") {
                            price = typeof addon.flatPrice === "object" 
                              ? addon.flatPrice?.amount || 0 
                              : addon.flatPrice || 0;
                          } else if (addon?.pricingType === "tiered") {
                            const tierIndex = item.selectedTierIndex ?? 0;
                            const tier = addon.tiers?.[tierIndex];
                            if (tier) {
                              price = tier.price;
                              tierInfo = ` (${tier.minDays}-${tier.maxDays} days)`;
                            }
                          }

                          return (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <div className="flex flex-col">
                                <span className="text-white font-semibold">
                                  {addon?.name || "Unknown"}
                                </span>
                                {addon?.description && (
                                  <span className="text-gray-400 text-xs">
                                    {addon.description}
                                  </span>
                                )}
                                {tierInfo && (
                                  <span className="text-[#fe9a00] text-xs">
                                    {tierInfo}
                                  </span>
                                )}
                              </div>
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

              {/* Vehicle Assignment */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Assign Vehicle</h3>
                </div>
                <button
                  onClick={() => setIsEditOpen(!isEditOpen)}
                  className="w-full px-4 py-2 bg-[#fe9a00]/20 text-[#fe9a00] rounded-lg hover:bg-[#fe9a00]/30 transition-colors font-semibold text-sm"
                >
                  Edit Vehicle
                </button>

                {isEditOpen && (
                  <div className="mt-3 space-y-2">
                    <CustomSelect
                      options={vehicles}
                      value={newVehicle}
                      onChange={setNewVehicle}
                      placeholder={
                        loadingVehicles
                          ? "Loading vehicles..."
                          : "Select Vehicle"
                      }
                    />
                    <button
                      onClick={handleVehicleUpdate}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Updating..." : "Update Vehicle"}
                    </button>
                  </div>
                )}
              </div>

              {/* Status Management */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Current Status</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                <button
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="w-full px-4 py-2 bg-[#fe9a00]/20 text-[#fe9a00] rounded-lg hover:bg-[#fe9a00]/30 transition-colors font-semibold text-sm"
                >
                  Change Status
                </button>

                {isStatusOpen && (
                  <div className="mt-3 space-y-2">
                    <CustomSelect
                      options={[
                        { _id: "pending", name: "Pending" },
                        { _id: "confirmed", name: "Confirmed" },
                        { _id: "completed", name: "Completed" },
                        { _id: "canceled", name: "Canceled" },
                      ]}
                      value={newStatus}
                      onChange={setNewStatus}
                      placeholder="Select new status"
                    />
                    <button
                      onClick={handleStatusChange}
                      disabled={isSubmitting || !newStatus}
                      className="w-full px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
