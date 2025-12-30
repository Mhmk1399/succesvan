"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { FiX, FiCalendar, FiClock } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import DynamicTableView from "./DynamicTableView";
import { Reservation } from "@/types/type";
import CustomSelect from "@/components/ui/CustomSelect";
import { DateRange, Range } from "react-date-range";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import TimeSelect from "@/components/ui/TimeSelect";
import { generateTimeSlots } from "@/utils/timeSlots";
import AddOnsModal from "@/components/global/AddOnsModal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type MutateFn = () => Promise<void>;

export default function ReservationsManagement() {
  const mutateRef = useRef<MutateFn | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditDatesOpen, setIsEditDatesOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newVehicle, setNewVehicle] = useState("");
  const [vehicles, setVehicles] = useState<{ _id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<
    {
      _id: string;
      name: string;
      pricingTiers?: any[];
      extrahoursRate?: number;
      selloffer?: number;
    }[]
  >([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [showDateRange, setShowDateRange] = useState(false);
  const [editDateRange, setEditDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);
  const [editTimes, setEditTimes] = useState({
    startTime: "10:00",
    endTime: "10:00",
  });
  const [editCategory, setEditCategory] = useState("");
  const [pickupExtensionPrice, setPickupExtensionPrice] = useState(0);
  const [returnExtensionPrice, setReturnExtensionPrice] = useState(0);
  const [addOnsCost, setAddOnsCost] = useState(0);
  const [startDateReservedSlots, setStartDateReservedSlots] = useState<any[]>(
    []
  );
  const [endDateReservedSlots, setEndDateReservedSlots] = useState<any[]>([]);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [addOns, setAddOns] = useState<any[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<
    { addOn: string; quantity: number; selectedTierIndex?: number }[]
  >([]);

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c._id === editCategory);
  }, [editCategory, categories]);

  const pickupTimeSlots = useMemo(() => {
    if (!selectedReservation?.office || !editDateRange[0].startDate) return [];
    const office = offices.find(
      (o) => o._id === (selectedReservation.office as any)?._id
    );
    if (!office) return [];

    const date = editDateRange[0].startDate;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()];

    const specialDay = office.specialDays?.find(
      (sd: any) => sd.month === month && sd.day === day
    );
    let start = "00:00",
      end = "23:59";

    if (specialDay && specialDay.isOpen) {
      start = specialDay.startTime || "00:00";
      end = specialDay.endTime || "23:59";
    } else {
      const workingDay = office.workingTime?.find(
        (w: any) => w.day === dayName && w.isOpen
      );
      if (workingDay) {
        start = workingDay.startTime || "00:00";
        end = workingDay.endTime || "23:59";

        // If start and end are the same, check if there's an extension
        if (start === end) {
          if (
            !workingDay.pickupExtension ||
            (workingDay.pickupExtension.hoursBefore === 0 &&
              workingDay.pickupExtension.hoursAfter === 0)
          ) {
            return []; // No extension, return empty array
          }
          // Has extension, show only extension times
          const [startHour, startMin] = start.split(":").map(Number);
          const extendedStartMinutes = Math.max(
            0,
            startHour * 60 +
              startMin -
              workingDay.pickupExtension.hoursBefore * 60
          );
          const extendedEndMinutes = Math.min(
            1439,
            startHour * 60 +
              startMin +
              workingDay.pickupExtension.hoursAfter * 60
          );
          start = `${String(Math.floor(extendedStartMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedStartMinutes % 60).padStart(2, "0")}`;
          end = `${String(Math.floor(extendedEndMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedEndMinutes % 60).padStart(2, "0")}`;
        } else if (workingDay.pickupExtension) {
          const [startHour, startMin] = start.split(":").map(Number);
          const [endHour, endMin] = end.split(":").map(Number);
          const extendedStartMinutes = Math.max(
            0,
            startHour * 60 +
              startMin -
              workingDay.pickupExtension.hoursBefore * 60
          );
          const extendedEndMinutes = Math.min(
            1439,
            endHour * 60 + endMin + workingDay.pickupExtension.hoursAfter * 60
          );
          start = `${String(Math.floor(extendedStartMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedStartMinutes % 60).padStart(2, "0")}`;
          end = `${String(Math.floor(extendedEndMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedEndMinutes % 60).padStart(2, "0")}`;
        }
      }
    }

    return generateTimeSlots(start, end, 15);
  }, [selectedReservation, editDateRange, offices]);

  const returnTimeSlots = useMemo(() => {
    if (!selectedReservation?.office || !editDateRange[0].endDate) return [];
    const office = offices.find(
      (o) => o._id === (selectedReservation.office as any)?._id
    );
    if (!office) return [];

    const date = editDateRange[0].endDate;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()];

    const specialDay = office.specialDays?.find(
      (sd: any) => sd.month === month && sd.day === day
    );
    let start = "00:00",
      end = "23:59";

    if (specialDay && specialDay.isOpen) {
      start = specialDay.startTime || "00:00";
      end = specialDay.endTime || "23:59";
    } else {
      const workingDay = office.workingTime?.find(
        (w: any) => w.day === dayName && w.isOpen
      );
      if (workingDay) {
        start = workingDay.startTime || "00:00";
        end = workingDay.endTime || "23:59";

        // If start and end are the same, check if there's an extension
        if (start === end) {
          if (
            !workingDay.returnExtension ||
            (workingDay.returnExtension.hoursBefore === 0 &&
              workingDay.returnExtension.hoursAfter === 0)
          ) {
            return []; // No extension, return empty array
          }
          // Has extension, show only extension times
          const [startHour, startMin] = start.split(":").map(Number);
          const extendedStartMinutes = Math.max(
            0,
            startHour * 60 +
              startMin -
              workingDay.returnExtension.hoursBefore * 60
          );
          const extendedEndMinutes = Math.min(
            1439,
            startHour * 60 +
              startMin +
              workingDay.returnExtension.hoursAfter * 60
          );
          start = `${String(Math.floor(extendedStartMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedStartMinutes % 60).padStart(2, "0")}`;
          end = `${String(Math.floor(extendedEndMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedEndMinutes % 60).padStart(2, "0")}`;
        } else if (workingDay.returnExtension) {
          const [startHour, startMin] = start.split(":").map(Number);
          const [endHour, endMin] = end.split(":").map(Number);
          const extendedStartMinutes = Math.max(
            0,
            startHour * 60 +
              startMin -
              workingDay.returnExtension.hoursBefore * 60
          );
          const extendedEndMinutes = Math.min(
            1439,
            endHour * 60 + endMin + workingDay.returnExtension.hoursAfter * 60
          );
          start = `${String(Math.floor(extendedStartMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedStartMinutes % 60).padStart(2, "0")}`;
          end = `${String(Math.floor(extendedEndMinutes / 60)).padStart(
            2,
            "0"
          )}:${String(extendedEndMinutes % 60).padStart(2, "0")}`;
        }
      }
    }

    return generateTimeSlots(start, end, 15);
  }, [selectedReservation, editDateRange, offices]);

  const isDateDisabled = useMemo(() => {
    return (date: Date): boolean => {
      if (!selectedReservation?.office) return false;
      const office = offices.find(
        (o) => o._id === (selectedReservation.office as any)?._id
      );
      if (!office) return false;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayName = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][date.getDay()];
      const specialDay = office.specialDays?.find(
        (sd: any) => sd.month === month && sd.day === day
      );
      if (specialDay && !specialDay.isOpen) return true;
      const workingDay = office.workingTime?.find(
        (w: any) => w.day === dayName
      );
      if (workingDay && !workingDay.isOpen) return true;
      return false;
    };
  }, [selectedReservation, offices]);

  const priceCalc = usePriceCalculation(
    editDateRange[0].startDate && editTimes.startTime
      ? `${editDateRange[0].startDate.toISOString().split("T")[0]}T${
          editTimes.startTime
        }:00`
      : "",
    editDateRange[0].endDate && editTimes.endTime
      ? `${editDateRange[0].endDate.toISOString().split("T")[0]}T${
          editTimes.endTime
        }:00`
      : "",
    selectedCategory?.pricingTiers || [],
    selectedCategory?.extrahoursRate || 0,
    pickupExtensionPrice,
    returnExtensionPrice,
    0,
    addOnsCost,
    selectedCategory?.selloffer || 0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, usersRes, categoriesRes, officesRes, addOnsRes] =
          await Promise.all([
            fetch("/api/vehicles?status=active&available=true"),
            fetch("/api/users?limit=100"),
            fetch("/api/categories?status=active"),
            fetch("/api/offices"),
            fetch("/api/addons?status=active"),
          ]);
        const vehiclesData = await vehiclesRes.json();
        const usersData = await usersRes.json();
        const categoriesData = await categoriesRes.json();
        const officesData = await officesRes.json();
        const addOnsData = await addOnsRes.json();

        setVehicles(
          (vehiclesData.data || []).map((vehicle: any) => ({
            _id: vehicle._id,
            name: vehicle.title || vehicle.number || "Unknown",
          }))
        );
        setUsers(
          (usersData.data || []).map((user: any) => ({
            _id: user._id,
            name: `${user.name} ${user.lastName || ""}`.trim(),
          }))
        );
        setCategories(
          (categoriesData.data?.data || categoriesData.data || []).map(
            (cat: any) => ({
              _id: cat._id,
              name: cat.name,
              pricingTiers: cat.pricingTiers,
              extrahoursRate: cat.extrahoursRate,
              selloffer: cat.selloffer,
            })
          )
        );
        setOffices(officesData.data?.data || officesData.data || []);
        setAddOns(addOnsData.data?.data || addOnsData.data || []);
      } catch (error) {
        console.log("Failed to fetch data:", error);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (item: Reservation) => {
    setSelectedReservation(item);
    setNewVehicle(
      typeof item.vehicle === "string" ? item.vehicle : item.vehicle?._id || ""
    );
    setEditCategory((item as any).category?._id || "");
    setEditDateRange([
      {
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        key: "selection",
      },
    ]);
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    setEditTimes({
      startTime: `${String(startDate.getHours()).padStart(2, "0")}:${String(
        startDate.getMinutes()
      ).padStart(2, "0")}`,
      endTime: `${String(endDate.getHours()).padStart(2, "0")}:${String(
        endDate.getMinutes()
      ).padStart(2, "0")}`,
    });
    // Load existing add-ons
    if (item.addOns && item.addOns.length > 0) {
      setSelectedAddOns(
        item.addOns.map((addon: any) => ({
          addOn:
            typeof addon.addOn === "string" ? addon.addOn : addon.addOn?._id,
          quantity: addon.quantity,
          selectedTierIndex: addon.selectedTierIndex,
        }))
      );
    } else {
      setSelectedAddOns([]);
    }
    setIsDetailOpen(true);
  };

  // Calculate add-ons cost
  useEffect(() => {
    const cost = selectedAddOns.reduce((total: number, item: any) => {
      const addon = addOns.find((a) => a._id === item.addOn);
      if (!addon) return total;
      if (addon.pricingType === "flat") {
        const amount = addon.flatPrice?.amount || 0;
        const isPerDay = addon.flatPrice?.isPerDay || false;
        return (
          total +
          (isPerDay ? amount * (priceCalc?.totalDays || 1) : amount) *
            item.quantity
        );
      } else {
        const tier = addon.tieredPrice?.tiers?.[item.selectedTierIndex ?? 0];
        if (tier) {
          const isPerDay = addon.tieredPrice?.isPerDay || false;
          return (
            total +
            (isPerDay ? tier.price * (priceCalc?.totalDays || 1) : tier.price) *
              item.quantity
          );
        }
      }
      return total;
    }, 0);
    setAddOnsCost(cost);
  }, [selectedAddOns, priceCalc, addOns]);

  // Calculate extension prices
  useEffect(() => {
    if (
      !selectedReservation?.office ||
      !editDateRange[0].startDate ||
      !editTimes.startTime
    ) {
      setPickupExtensionPrice(0);
      return;
    }
    const office = offices.find(
      (o) => o._id === (selectedReservation.office as any)?._id
    );
    if (!office) return;
    const date = editDateRange[0].startDate;
    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()];
    const workingDay = office.workingTime?.find(
      (w: any) => w.day === dayName && w.isOpen
    );
    if (workingDay?.pickupExtension) {
      const [pickupHour, pickupMin] = editTimes.startTime
        .split(":")
        .map(Number);
      const [startHour, startMin] = (workingDay.startTime || "00:00")
        .split(":")
        .map(Number);
      const [endHour, endMin] = (workingDay.endTime || "23:59")
        .split(":")
        .map(Number);
      const pickupMinutes = pickupHour * 60 + pickupMin;
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      if (pickupMinutes < startMinutes || pickupMinutes > endMinutes) {
        setPickupExtensionPrice(workingDay.pickupExtension.flatPrice || 0);
      } else {
        setPickupExtensionPrice(0);
      }
    } else {
      setPickupExtensionPrice(0);
    }
  }, [selectedReservation, editTimes.startTime, editDateRange, offices]);

  useEffect(() => {
    if (
      !selectedReservation?.office ||
      !editDateRange[0].endDate ||
      !editTimes.endTime
    ) {
      setReturnExtensionPrice(0);
      return;
    }
    const office = offices.find(
      (o) => o._id === (selectedReservation.office as any)?._id
    );
    if (!office) return;
    const date = editDateRange[0].endDate;
    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()];
    const workingDay = office.workingTime?.find(
      (w: any) => w.day === dayName && w.isOpen
    );
    if (workingDay?.returnExtension) {
      const [returnHour, returnMin] = editTimes.endTime.split(":").map(Number);
      const [startHour, startMin] = (workingDay.startTime || "00:00")
        .split(":")
        .map(Number);
      const [endHour, endMin] = (workingDay.endTime || "23:59")
        .split(":")
        .map(Number);
      const returnMinutes = returnHour * 60 + returnMin;
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      if (returnMinutes < startMinutes || returnMinutes > endMinutes) {
        setReturnExtensionPrice(workingDay.returnExtension.flatPrice || 0);
      } else {
        setReturnExtensionPrice(0);
      }
    } else {
      setReturnExtensionPrice(0);
    }
  }, [selectedReservation, editTimes.endTime, editDateRange, offices]);

  // Fetch reserved slots
  useEffect(() => {
    if (selectedReservation?.office && editDateRange[0].startDate) {
      const date = editDateRange[0].startDate;
      const startDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      fetch(
        `/api/reservations/by-office?office=${
          (selectedReservation.office as any)._id
        }&startDate=${startDate}&type=start`
      )
        .then((res) => res.json())
        .then((data) =>
          setStartDateReservedSlots(data.data?.reservedSlots || [])
        )
        .catch((err) => console.error(err));
    }
  }, [selectedReservation, editDateRange]);

  useEffect(() => {
    if (selectedReservation?.office && editDateRange[0].endDate) {
      const date = editDateRange[0].endDate;
      const endDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      fetch(
        `/api/reservations/by-office?office=${
          (selectedReservation.office as any)._id
        }&endDate=${endDate}&type=end`
      )
        .then((res) => res.json())
        .then((data) => setEndDateReservedSlots(data.data?.reservedSlots || []))
        .catch((err) => console.error(err));
    }
  }, [selectedReservation, editDateRange]);

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

  const handleDatesUpdate = async () => {
    if (
      !selectedReservation ||
      !editDateRange[0].startDate ||
      !editDateRange[0].endDate ||
      !editCategory
    )
      return;
    setIsSubmitting(true);

    try {
      const startDate = new Date(editDateRange[0].startDate);
      const [startHour, startMin] = editTimes.startTime.split(":").map(Number);
      startDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date(editDateRange[0].endDate);
      const [endHour, endMin] = editTimes.endTime.split(":").map(Number);
      endDate.setHours(endHour, endMin, 0, 0);

      const res = await fetch(`/api/reservations/${selectedReservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          category: editCategory,
          totalPrice: priceCalc?.totalPrice || selectedReservation.totalPrice,
          addOns: selectedAddOns,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");

      showToast.success("Reservation updated successfully!");
      setIsEditDatesOpen(false);
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
        filters={[
          {
            key: "user",
            label: "Customer",
            type: "select",
            options: users.map((user) => ({ _id: user._id, name: user.name })),
          },
          { key: "phone", label: "Phone Number", type: "text" },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: categories,
          },

          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { _id: "pending", name: "Pending" },
              { _id: "confirmed", name: "Confirmed" },
              { _id: "delivered", name: "Collected" },
              { _id: "completed", name: "Completed" },
              { _id: "canceled", name: "Canceled" },
            ],
          },
          {
            key: "office",
            label: "Office",
            type: "select",
            options: offices.map((office) => ({
              _id: office._id,
              name: office.name,
            })),
          },
          {
            key: "totalPrice",
            label: "Total Price Range",
            type: "range",
            rangeType: "number",
          },
          { key: "startDate", label: "Start Date", type: "date" },
          { key: "endDate", label: "End Date", type: "date" },
        ]}
        title="Reservation"
        columns={[
          {
            key: "user",
            label: "Customer",
            render: (value: any) => value?.name || "-",
          },
          {
            key: "user",
            label: "Phone",
            render: (value: any) => value?.phoneData?.phoneNumber || "-",
          },
          {
            key: "user",
            label: "License",
            render: (value: any) => {
              const hasFront = value?.licenceAttached?.front;
              const hasBack = value?.licenceAttached?.back;
              
              if (hasFront && hasBack) {
                return (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                    Complete
                  </span>
                );
              }
              
              if (hasFront || hasBack) {
                return (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
                    Partial
                  </span>
                );
              }
              
              return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></span>
                  Missing
                </span>
              );
            },
          },
          {
            key: "office",
            label: "Office",
            render: (value: any) => value?.name || "-",
          },
          {
            key: "totalPrice",
            label: "Total Price",
            render: (value: number) => (value ? `£${value.toFixed(2)}` : "-"),
          },
          {
            key: "startDate",
            label: "Start Date",
            render: (value: string) =>
              value ? new Date(value).toLocaleDateString() : "-",
          },
          {
            key: "startDate",
            label: "Start Time",
            render: (value: string) =>
              value
                ? new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-",
          },
          {
            key: "endDate",
            label: "End Date",
            render: (value: string) =>
              value ? new Date(value).toLocaleDateString() : "-",
          },
          {
            key: "endDate",
            label: "End Time",
            render: (value: string) =>
              value
                ? new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-",
          },
          { key: "driverAge", label: "Driver Age" },
          {
            key: "status",
            label: "Status",
            render: (value: string) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  value === "pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : value === "confirmed"
                    ? "bg-blue-500/20 text-blue-400"
                    : value === "delivered"
                    ? "bg-green-500/20 text-green-400"
                    : value === "completed"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : value === "canceled"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        onEdit={handleViewDetails}
        onMutate={(mutate) => (mutateRef.current = mutate)}
        hideDelete={true}
        hiddenColumns={["driverAge"] as (keyof Reservation)[]}
      />
      {/* <DynamicTableView<Reservation>
        hideDelete={true}
        apiEndpoint="/api/reservations"
        filters={[
          { key: "name", label: "User", type: "select", options: users },
          { key: "category", label: "Category", type: "select", options: categories },
          { key: "startDate", label: "Start Date", type: "date" },
          { key: "endDate", label: "End Date", type: "date" },
          { key: "totalPrice", label: "Total Price", type: "text" },
        ]}
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
            key: "category",
            label: "Category",
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
                    : value === "delivered"
                    ? "bg-purple-500/20 text-purple-400"
                    : value === "canceled"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {value === "delivered" ? "collected" : value}
              </span>
            ),
          },
          { key: "driverAge", label: "Driver Age" },
        ]}
        onEdit={handleViewDetails}
        onMutate={(mutate) => (mutateRef.current = mutate)}
        hiddenColumns={["driverAge"] as (keyof Reservation)[]}
      /> */}

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

              {/* License Information */}
              {(selectedReservation.user?.licenceAttached?.front || selectedReservation.user?.licenceAttached?.back) && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">
                    Driver License
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReservation.user?.licenceAttached?.front && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Front Side</p>
                        <div className="relative">
                          <a
                            href={selectedReservation.user.licenceAttached.front}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={selectedReservation.user.licenceAttached.front}
                              alt="License Front"
                              className="w-full h-32 object-cover rounded-lg border border-white/10 cursor-pointer hover:border-[#fe9a00]/50 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                              <span className="text-white text-sm font-medium">Click to view full size</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedReservation.user?.licenceAttached?.back && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Back Side</p>
                        <div className="relative">
                          <a
                            href={selectedReservation.user.licenceAttached.back}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={selectedReservation.user.licenceAttached.back}
                              alt="License Back"
                              className="w-full h-32 object-cover rounded-lg border border-white/10 cursor-pointer hover:border-[#fe9a00]/50 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                              <span className="text-white text-sm font-medium">Click to view full size</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedReservation.user?.licenceAttached?.front && selectedReservation.user?.licenceAttached?.back
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        selectedReservation.user?.licenceAttached?.front && selectedReservation.user?.licenceAttached?.back
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }`}></span>
                      {selectedReservation.user?.licenceAttached?.front && selectedReservation.user?.licenceAttached?.back
                        ? "Complete License"
                        : "Partial License"
                      }
                    </span>
                  </div>
                </div>
              )}

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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold">Add-ons</h3>
                      <button
                        onClick={() => setShowAddOnsModal(true)}
                        className="text-[#fe9a00] text-xs hover:underline"
                      >
                        Edit Add-ons
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedAddOns.map((item: any, idx: number) => {
                        const addon =
                          addOns.find((a) => a._id === item.addOn) ||
                          item.addOn;
                        let price = 0;
                        let tierInfo = "";

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
                      })}
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

              {/* Edit Dates */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">
                  Edit Reservation
                </h3>
                <button
                  onClick={() => setIsEditDatesOpen(!isEditDatesOpen)}
                  className="w-full px-4 py-2 bg-[#fe9a00]/20 text-[#fe9a00] rounded-lg hover:bg-[#fe9a00]/30 transition-colors font-semibold text-sm"
                >
                  Edit Category, Dates & Times
                </button>

                {isEditDatesOpen && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Category
                      </label>
                      <CustomSelect
                        options={categories}
                        value={editCategory}
                        onChange={setEditCategory}
                        placeholder="Select Category"
                      />
                    </div>

                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiCalendar className="text-[#fe9a00]" /> Dates
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowDateRange(!showDateRange)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm text-left focus:outline-none focus:border-[#fe9a00]"
                      >
                        {editDateRange[0].startDate && editDateRange[0].endDate
                          ? `${editDateRange[0].startDate.toLocaleDateString()} - ${editDateRange[0].endDate.toLocaleDateString()}`
                          : "Select Dates"}
                      </button>
                      {showDateRange && (
                        <div
                          className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center"
                          onClick={() => setShowDateRange(false)}
                        >
                          <div
                            className="bg-slate-800 backdrop-blur-xl border border-white/20 rounded-lg p-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DateRange
                              ranges={editDateRange}
                              onChange={(item) => {
                                const { startDate, endDate } = item.selection;
                                setEditDateRange([
                                  {
                                    startDate: startDate || new Date(),
                                    endDate: endDate || new Date(),
                                    key: "selection",
                                  },
                                ]);
                              }}
                              minDate={new Date()}
                              rangeColors={["#fbbf24"]}
                              disabledDates={
                                selectedReservation?.office
                                  ? (Array.from({ length: 365 }, (_, i) => {
                                      const date = new Date();
                                      date.setDate(date.getDate() + i);
                                      return isDateDisabled(date) ? date : null;
                                    }).filter(Boolean) as Date[])
                                  : []
                              }
                            />
                            <button
                              type="button"
                              onClick={() => setShowDateRange(false)}
                              className="w-full mt-3 px-4 py-2 bg-[#fe9a00] text-slate-900 font-semibold rounded-lg hover:bg-[#e68a00] transition-colors text-sm"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                          <FiClock className="text-[#fe9a00]" /> Start Time
                        </label>
                        {editDateRange[0].startDate &&
                          (() => {
                            const office = offices.find(
                              (o) =>
                                o._id ===
                                (selectedReservation.office as any)?._id
                            );
                            const date = editDateRange[0].startDate;
                            const dayName = [
                              "sunday",
                              "monday",
                              "tuesday",
                              "wednesday",
                              "thursday",
                              "friday",
                              "saturday",
                            ][date.getDay()];
                            const workingDay = office?.workingTime?.find(
                              (w: any) => w.day === dayName && w.isOpen
                            );
                            const extensionTimes = workingDay?.pickupExtension
                              ? {
                                  start: pickupTimeSlots[0],
                                  end: pickupTimeSlots[
                                    pickupTimeSlots.length - 1
                                  ],
                                  normalStart: workingDay.startTime || "00:00",
                                  normalEnd: workingDay.endTime || "23:59",
                                  price: workingDay.pickupExtension.flatPrice,
                                }
                              : undefined;
                            return (
                              <TimeSelect
                                value={editTimes.startTime}
                                onChange={(time) =>
                                  setEditTimes((prev) => ({
                                    ...prev,
                                    startTime: time,
                                  }))
                                }
                                slots={pickupTimeSlots}
                                reservedSlots={startDateReservedSlots}
                                selectedDate={editDateRange[0].startDate}
                                isStartTime={true}
                                extensionTimes={extensionTimes}
                              />
                            );
                          })()}
                      </div>
                      <div>
                        <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                          <FiClock className="text-[#fe9a00]" /> End Time
                        </label>
                        {editDateRange[0].endDate &&
                          (() => {
                            const office = offices.find(
                              (o) =>
                                o._id ===
                                (selectedReservation.office as any)?._id
                            );
                            const date = editDateRange[0].endDate;
                            const dayName = [
                              "sunday",
                              "monday",
                              "tuesday",
                              "wednesday",
                              "thursday",
                              "friday",
                              "saturday",
                            ][date.getDay()];
                            const workingDay = office?.workingTime?.find(
                              (w: any) => w.day === dayName && w.isOpen
                            );
                            const extensionTimes = workingDay?.returnExtension
                              ? {
                                  start: returnTimeSlots[0],
                                  end: returnTimeSlots[
                                    returnTimeSlots.length - 1
                                  ],
                                  normalStart: workingDay.startTime || "00:00",
                                  normalEnd: workingDay.endTime || "23:59",
                                  price: workingDay.returnExtension.flatPrice,
                                }
                              : undefined;
                            return (
                              <TimeSelect
                                value={editTimes.endTime}
                                onChange={(time) =>
                                  setEditTimes((prev) => ({
                                    ...prev,
                                    endTime: time,
                                  }))
                                }
                                slots={returnTimeSlots}
                                reservedSlots={endDateReservedSlots}
                                selectedDate={editDateRange[0].endDate}
                                isStartTime={false}
                                extensionTimes={extensionTimes}
                              />
                            );
                          })()}
                      </div>
                    </div>

                    {priceCalc && (
                      <div className="bg-[#fe9a00]/10 border border-[#fe9a00]/30 rounded-lg p-3">
                        <p className="text-white text-sm font-semibold mb-1">
                          New Total Price
                        </p>
                        <p className="text-[#fe9a00] text-2xl font-black">
                          £{priceCalc.totalPrice}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {priceCalc.breakdown}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleDatesUpdate}
                      disabled={isSubmitting || !editCategory}
                      className="w-full px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Updating..." : "Update Reservation"}
                    </button>
                  </div>
                )}
              </div>

              {/* Add-ons Modal */}
              {showAddOnsModal && (
                <AddOnsModal
                  addOns={addOns}
                  selectedAddOns={selectedAddOns}
                  onSave={setSelectedAddOns}
                  onClose={() => setShowAddOnsModal(false)}
                  rentalDays={priceCalc?.totalDays || 1}
                />
              )}

              {/* Vehicle Assignment */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">
                  Assign Vehicle
                </h3>
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
                      onClick={async () => {
                        if (!newVehicle) return;
                        setIsSubmitting(true);
                        try {
                          // Update vehicle and status together
                          const res = await fetch(
                            `/api/reservations/${selectedReservation._id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                vehicle: newVehicle,
                                status: "delivered",
                              }),
                            }
                          );
                          const data = await res.json();
                          if (!data.success)
                            throw new Error(data.error || "Update failed");

                          showToast.success("Vehicle assigned and collected!");
                          setIsEditOpen(false);
                          if (mutateRef.current) mutateRef.current();
                          setIsDetailOpen(false);
                        } catch (error) {
                          const message =
                            error instanceof Error
                              ? error.message
                              : "Unknown error";
                          showToast.error(message || "Update failed");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      disabled={isSubmitting || !newVehicle}
                      className="w-full px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Updating..." : "Assign & Collected"}
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
                        : selectedReservation.status === "delivered"
                        ? "bg-purple-500/20 text-purple-400"
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
                        { _id: "delivered", name: "Collected" },
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
