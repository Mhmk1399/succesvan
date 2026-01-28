"use client";

import { useState, useEffect, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { Reservation } from "@/types/type";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

interface ReservationDetailsModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationDetailsModal({
  reservation,
  isOpen,
  onClose,
}: ReservationDetailsModalProps) {
  const [addOns, setAddOns] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Get category pricing tiers directly from reservation data
  const categoryData = useMemo(() => {
    return reservation?.category as any;
  }, [reservation?.category]);

  // Calculate price using the hook with all parameters
  const startDateTimeString = reservation?.startDate
    ? new Date(reservation.startDate).toISOString()
    : "";
  const endDateTimeString = reservation?.endDate
    ? new Date(reservation.endDate).toISOString()
    : "";

  // Get gear extra cost if automatic
  const gearExtraCost = useMemo(() => {
    if ((reservation as any)?.selectedGear === "automatic" && categoryData?.gear?.automaticExtraCost) {
      return categoryData.gear.automaticExtraCost;
    }
    return 0;
  }, [categoryData, reservation]);

  const priceCalc = usePriceCalculation(
    startDateTimeString,
    endDateTimeString,
    categoryData?.pricingTiers || [],
    categoryData?.extrahoursRate || 0,
    0, // pickupExtensionPrice
    0, // returnExtensionPrice
    gearExtraCost,
    0, // addOnsPrice - we'll calculate separately
    categoryData?.selloffer || 0
  );

  // Fetch add-ons and categories
  useEffect(() => {
    Promise.all([
      fetch("/api/addons?status=active").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([addOnsData, categoriesData]) => {
        const addonsArray = addOnsData.data?.data || addOnsData.data || [];
        setAddOns(Array.isArray(addonsArray) ? addonsArray : []);
        setCategories(categoriesData.data || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const getAddOnPrice = (item: any) => {
    // The addon data is nested under item.addOn in the reservation data
    const addon = item.addOn || addOns.find((a) => a._id === item.addOn);
    if (!addon) return 0;

    if (addon.pricingType === "flat") {
      return typeof addon.flatPrice === "object"
        ? addon.flatPrice?.amount || 0
        : addon.flatPrice || 0;
    }

    if (addon.pricingType === "tiered") {
      const tierIndex = item.selectedTierIndex ?? 0;
      const tier = addon.tieredPrice?.tiers?.[tierIndex];
      return tier?.price || 0;
    }

    return 0;
  };

  const totalAddOnsPrice = useMemo(() => {
    if (!reservation?.addOns || reservation.addOns.length === 0) return 0;
    return reservation.addOns.reduce((sum, item: any) => {
      return sum + getAddOnPrice(item);
    }, 0);
  }, [reservation?.addOns, addOns]);

  // Early return after all hooks are defined
  if (!isOpen || !reservation) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a2847] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847] z-10">
            <div>
              <h2 className="text-2xl font-black text-white">
                Reservation Details
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                ID: {reservation._id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="text-white text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-[#fe9a00] rounded-full"></span>
                Customer Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold">
                    {reservation.user?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold text-sm">
                    {reservation.user?.emaildata?.emailAddress || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <p className="text-white font-semibold">
                    {reservation.user?.phoneData?.phoneNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Driver Age</p>
                  <p className="text-white font-semibold">
                    {reservation.driverAge} years
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Address</p>
                  <p className="text-white font-semibold text-sm">
                    {(reservation.user as any)?.address || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">City</p>
                  <p className="text-white font-semibold text-sm">
                    {(reservation.user as any)?.city || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Postal Code</p>
                  <p className="text-white font-semibold text-sm">
                    {(reservation.user as any)?.postalCode || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* License Information */}
            {(reservation.user?.licenceAttached?.front ||
              reservation.user?.licenceAttached?.back) && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#fe9a00] rounded-full"></span>
                  Driver License
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {reservation.user?.licenceAttached?.front && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Front Side</p>
                      <div className="relative group">
                        <a
                          href={reservation.user.licenceAttached.front}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={reservation.user.licenceAttached.front}
                            alt="License Front"
                            className="w-full h-40 object-cover rounded-lg border border-white/10 group-hover:border-[#fe9a00]/50 transition-colors"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs font-medium">
                              Click to view
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                  {reservation.user?.licenceAttached?.back && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Back Side</p>
                      <div className="relative group">
                        <a
                          href={reservation.user.licenceAttached.back}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={reservation.user.licenceAttached.back}
                            alt="License Back"
                            className="w-full h-40 object-cover rounded-lg border border-white/10 group-hover:border-[#fe9a00]/50 transition-colors"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs font-medium">
                              Click to view
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      reservation.user?.licenceAttached?.front &&
                      reservation.user?.licenceAttached?.back
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        reservation.user?.licenceAttached?.front &&
                        reservation.user?.licenceAttached?.back
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }`}
                    ></span>
                    {reservation.user?.licenceAttached?.front &&
                    reservation.user?.licenceAttached?.back
                      ? "Complete License"
                      : "Partial License"}
                  </span>
                </div>
              </div>
            )}

            {/* Rental Information */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-[#fe9a00] rounded-full"></span>
                Rental Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Office</p>
                  <p className="text-white font-semibold">
                    {reservation.office?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Category</p>
                  <p className="text-white font-semibold">
                    {(reservation.category as any)?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Vehicle</p>
                  <p className="text-white font-semibold">
                    {(reservation.vehicle as any)?.title || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Gear Type</p>
                  <p className="text-white font-semibold">
                    {(reservation as any).selectedGear || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      reservation.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : reservation.status === "confirmed"
                        ? "bg-blue-500/20 text-blue-400"
                        : reservation.status === "delivered"
                        ? "bg-purple-500/20 text-purple-400"
                        : reservation.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : reservation.status === "canceled"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {reservation.status === "delivered"
                      ? "Collected"
                      : reservation.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates & Times */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-[#fe9a00] rounded-full"></span>
                Rental Period
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pickup Date & Time</p>
                  <p className="text-white font-semibold">
                    {new Date(reservation.startDate).toLocaleString("en-GB")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Return Date & Time</p>
                  <p className="text-white font-semibold">
                    {new Date(reservation.endDate).toLocaleString("en-GB")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Duration</p>
                  <p className="text-white font-semibold">
                    {priceCalc?.totalDays || 0} days{" "}
                    {priceCalc?.extraHours || 0 > 0
                      ? `+ ${priceCalc?.extraHours || 0} hours`
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Hours</p>
                  <p className="text-white font-semibold">
                    {priceCalc?.totalHours || 0} hours
                  </p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gradient-to-br from-[#fe9a00]/20 to-[#fe9a00]/5 border border-[#fe9a00]/30 rounded-xl p-5">
              <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-[#fe9a00] rounded-full"></span>
                Price Breakdown
              </h3>
              <div className="space-y-3">
                {priceCalc && (
                  <>
                    {/* Base Rental Price */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">
                        Base Rental ({priceCalc.totalDays} day{priceCalc.totalDays !== 1 ? 's' : ''} × £
                        {priceCalc.pricePerDay.toFixed(2)}/day)
                      </span>
                      <span className="text-white font-semibold">
                        £{(priceCalc.totalDays * priceCalc.pricePerDay).toFixed(2)}
                      </span>
                    </div>

                    {/* Extra Hours */}
                    {priceCalc.extraHours > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          Extra Hours ({priceCalc.extraHours}h × £
                          {priceCalc.extraHoursRate.toFixed(2)}/hr)
                        </span>
                        <span className="text-white font-semibold">
                          £
                          {(
                            priceCalc.extraHours * priceCalc.extraHoursRate
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Gear Cost if Automatic */}
                    {gearExtraCost > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          Automatic Gear ({priceCalc.totalDays} day{priceCalc.totalDays !== 1 ? 's' : ''} × £
                          {gearExtraCost.toFixed(2)}/day)
                        </span>
                        <span className="text-white font-semibold">
                          £{(gearExtraCost * priceCalc.totalDays).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Pickup Extension */}
                    {priceCalc.pickupExtensionPrice ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">Pickup Extension</span>
                        <span className="text-white font-semibold">
                          £{priceCalc.pickupExtensionPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : null}

                    {/* Return Extension */}
                    {priceCalc.returnExtensionPrice ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">Return Extension</span>
                        <span className="text-white font-semibold">
                          £{priceCalc.returnExtensionPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : null}
                  </>
                )}

                {/* Add-ons Individual Breakdown */}
                {reservation.addOns && reservation.addOns.length > 0 && (
                  <div className="border-t border-[#fe9a00]/20 pt-3">
                    <p className="text-gray-300 text-sm font-semibold mb-2">Add-ons:</p>
                    <div className="space-y-2 ml-2">
                      {reservation.addOns.map((item: any, idx: number) => {
                        const addon = item.addOn;
                        const price = getAddOnPrice(item);
                        return (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">
                              {addon?.name || 'Unknown'} (x{item.quantity})
                            </span>
                            <span className="text-white font-semibold">
                              £{price.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center text-lg border-t border-[#fe9a00]/20 pt-3 mt-3">
                  <span className="text-white font-bold">Total Price</span>
                  <span className="text-[#fe9a00] font-black text-2xl">
                    £{reservation.totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Breakdown Text */}
                {priceCalc?.breakdown && (
                  <p className="text-gray-400 text-xs mt-3 p-2 bg-black/30 rounded">
                    Calculation: {priceCalc.breakdown}
                  </p>
                )}
              </div>
            </div>

            {/* Add-ons */}
            {reservation.addOns && reservation.addOns.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#fe9a00] rounded-full"></span>
                  Selected Add-ons
                </h3>
                <div className="space-y-3">
                  {reservation.addOns.map((item: any, idx: number) => {
                    const addon = item.addOn; // Direct access to nested addon object
                    const price = getAddOnPrice(item);

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-start p-3 bg-black/30 rounded-lg border border-white/5"
                      >
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {addon?.name || "Unknown"}
                          </p>
                          {addon?.description && (
                            <p className="text-gray-400 text-xs mt-1">
                              {addon.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-gray-400 text-xs mb-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-white font-semibold">
                            £{price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message */}
            {reservation.messege && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#fe9a00] rounded-full"></span>
                  Customer Message
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed bg-black/30 p-3 rounded-lg">
                  {reservation.messege}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
