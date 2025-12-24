"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FiX,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiPackage,
  FiUsers,
} from "react-icons/fi";

import AddOnsModal from "./AddOnsModal";
import VanCard from "./VanCard";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { BsFuelPump } from "react-icons/bs";
import { generateTimeSlots, isTimeSlotAvailable } from "@/utils/timeSlots";
import { WorkingTime } from "@/types/type";

interface Office {
  _id: string;
  name: string;
  vehicles: any[];
}

interface Category {
  _id: string;
  name: string;
  image: string;
  pricingTiers: { minDays: number; maxDays: number; pricePerDay: number }[];
  extrahoursRate: number;
  deposit: number;
  seats: number;
  fuel: string;
  cargo: string;
  expert: string;
}

interface AddOn {
  _id: string;
  name: string;
  description?: string;
  pricingType: "flat" | "tiered";
  flatPrice?: {
    amount: number;
    isPerDay: boolean;
  };
  tieredPrice?: {
    isPerDay: boolean;
    tiers: { minDays: number; maxDays: number; price: number }[];
  };
}

export default function ReservationModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [offices, setOffices] = useState<Office[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [reservedSlots, setReservedSlots] = useState<
    { startTime: string; endTime: string }[]
  >([]);
  const [officeHours, setOfficeHours] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [selectedOfficeData, setSelectedOfficeData] = useState<any>(null);

  const [formData, setFormData] = useState({
    office: "",
    type: { name: "", _id: "" },
    startDate: "",
    startTime: "10:00",
    endDate: "",
    endTime: "10:00",
    driverAge: 25,
    category: "",
    gearType: "manual" as "manual" | "automatic",
    phone: "",
    code: "",
    name: "",
    lastName: "",
    email: "",
  });

  const [authStep, setAuthStep] = useState<"phone" | "code" | "register">(
    "phone"
  );
  const [selectedAddOns, setSelectedAddOns] = useState<
    { addOn: string; quantity: number; selectedTierIndex?: number }[]
  >([]);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const availableStartTimes = useMemo(() => {
    if (!officeHours) return [];
    const allSlots = generateTimeSlots(
      officeHours.startTime,
      officeHours.endTime,
      15
    );
    return allSlots.filter((slot) => isTimeSlotAvailable(slot, reservedSlots));
  }, [officeHours, reservedSlots]);

  const availableEndTimes = useMemo(() => {
    if (!officeHours || !formData.startTime) return [];
    const allSlots = generateTimeSlots(
      formData.startTime,
      officeHours.endTime,
      15
    );
    return allSlots.filter(
      (slot) =>
        slot > formData.startTime && isTimeSlotAvailable(slot, reservedSlots)
    );
  }, [officeHours, formData.startTime, reservedSlots]);

  const selectedCategory = categories.find((c) => c._id === formData.category);

  // Calculate extension prices
  const extensionPrices = useMemo(() => {
    let pickupExtension = 0;
    let returnExtension = 0;

    if (
      selectedOfficeData &&
      formData.startDate &&
      formData.startTime &&
      formData.endDate &&
      formData.endTime
    ) {
      const startDay = new Date(formData.startDate)
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const endDay = new Date(formData.endDate)
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      const startDaySchedule = selectedOfficeData.workingTime?.find(
        (wt: any) => wt.day === startDay
      );
      const endDaySchedule = selectedOfficeData.workingTime?.find(
        (wt: any) => wt.day === endDay
      );

      if (
        startDaySchedule?.pickupExtension &&
        formData.startTime < startDaySchedule.startTime
      ) {
        pickupExtension = startDaySchedule.pickupExtension.flatPrice || 0;
      }
      if (
        startDaySchedule?.pickupExtension &&
        formData.startTime > startDaySchedule.endTime
      ) {
        pickupExtension = startDaySchedule.pickupExtension.flatPrice || 0;
      }

      if (
        endDaySchedule?.returnExtension &&
        formData.endTime < endDaySchedule.startTime
      ) {
        returnExtension = endDaySchedule.returnExtension.flatPrice || 0;
      }
      if (
        endDaySchedule?.returnExtension &&
        formData.endTime > endDaySchedule.endTime
      ) {
        returnExtension = endDaySchedule.returnExtension.flatPrice || 0;
      }
    }

    return { pickupExtension, returnExtension };
  }, [
    selectedOfficeData,
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime,
  ]);

  const rentalDays = useMemo(() => {
    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.startTime ||
      !formData.endTime
    )
      return 0;
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    const diffTime = end.getTime() - start.getTime();
    const totalMinutes = diffTime / (1000 * 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const billableHours = remainingMinutes > 15 ? totalHours + 1 : totalHours;
    return Math.floor(billableHours / 24); // Use floor to match totalDays calculation
  }, [
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime,
  ]);

  const addOnsPrice = useMemo(() => {
    return selectedAddOns.reduce((sum, item) => {
      const addon = addOns.find((a) => a._id === item.addOn);
      if (!addon) return sum;
      if (addon.pricingType === "flat") {
        const amount = addon.flatPrice?.amount || 0;
        const isPerDay = addon.flatPrice?.isPerDay || false;
        return sum + (isPerDay ? amount * rentalDays : amount) * item.quantity;
      }
      if (
        item.selectedTierIndex !== undefined &&
        addon.tieredPrice?.tiers?.[item.selectedTierIndex]
      ) {
        const tier = addon.tieredPrice.tiers[item.selectedTierIndex];
        const isPerDay = addon.tieredPrice.isPerDay || false;
        return (
          sum +
          (isPerDay ? tier.price * rentalDays : tier.price) * item.quantity
        );
      }
      return sum;
    }, 0);
  }, [selectedAddOns, addOns, rentalDays]);

  const calculateCategoryPrice = (cat: Category) => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = formData.startDate
      ? `${formData.startDate}T${formData.startTime}`
      : "";
    const end = formData.endDate
      ? `${formData.endDate}T${formData.endTime}`
      : "";
    const diffTime = new Date(end).getTime() - new Date(start).getTime();
    const totalMinutes = diffTime / (1000 * 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const billableHours = remainingMinutes > 15 ? totalHours + 1 : totalHours;
    if (billableHours <= 0) return null;
    const totalDays = Math.floor(billableHours / 24);
    const extraHours = billableHours % 24;
    const tier =
      cat.pricingTiers.find(
        (t) => totalDays >= t.minDays && totalDays <= t.maxDays
      ) || cat.pricingTiers[cat.pricingTiers.length - 1];
    const pricePerDay = tier.pricePerDay;
    const daysPrice = totalDays * pricePerDay;
    const extraHoursPrice = extraHours * (cat.extrahoursRate || 0);
    const totalPrice = daysPrice + extraHoursPrice;
    let breakdown = "";
    if (totalDays > 0 && extraHours > 0) {
      breakdown = `${totalDays} day${
        totalDays > 1 ? "s" : ""
      } (£${pricePerDay}/day) + ${extraHours}h (£${
        cat.extrahoursRate
      }/hr) = £${totalPrice}`;
    } else if (totalDays > 0) {
      breakdown = `${totalDays} day${
        totalDays > 1 ? "s" : ""
      } (£${pricePerDay}/day) = £${totalPrice}`;
    } else {
      breakdown = `${extraHours}h (£${cat.extrahoursRate}/hr) = £${totalPrice}`;
    }
    return { totalPrice, breakdown };
  };

  const priceCalc = usePriceCalculation(
    formData.startDate ? `${formData.startDate}T${formData.startTime}` : "",
    formData.endDate ? `${formData.endDate}T${formData.endTime}` : "",
    selectedCategory?.pricingTiers || [],
    (selectedCategory as any)?.extrahoursRate || 0,
    extensionPrices.pickupExtension,
    extensionPrices.returnExtension,
    formData.gearType === "automatic" &&
      (selectedCategory as any)?.gear?.availableTypes?.includes("automatic") &&
      (selectedCategory as any)?.gear?.availableTypes?.includes("manual")
      ? (selectedCategory as any)?.gear?.automaticExtraCost || 0
      : 0,
    addOnsPrice
  );

  // Fetch offices and types
  useEffect(() => {
    Promise.all([
      fetch("/api/offices").then((res) => res.json()),
      fetch("/api/types").then((res) => res.json()),
    ])
      .then(([officeData, typeData]) => {
        setOffices(officeData.data || []);
        setTypes(typeData.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch and filter categories when office and type selected
  useEffect(() => {
    if (formData.office && formData.type) {
      const typeId =
        typeof formData.type === "string" ? formData.type : formData.type._id;
      fetch(`/api/offices/${formData.office}`)
        .then((res) => res.json())
        .then((data) => {
          const office = data.data;
          setSelectedOfficeData(office);
          if (office?.categories && office.categories.length > 0) {
            const filtered = office.categories.filter((cat: any) => {
              const catTypeId =
                typeof cat.type === "string" ? cat.type : cat.type?._id;
              return catTypeId === typeId;
            });
            setCategories(filtered);
          } else {
            setCategories([]);
          }
        })
        .catch((err) => console.error(err));
    } else {
      setCategories([]);
    }
  }, [formData.office, formData.type]);

  // Fetch add-ons
  useEffect(() => {
    fetch("/api/addons")
      .then((res) => res.json())
      .then((data) => setAddOns(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch office hours and reserved slots
  useEffect(() => {
    if (formData.office && formData.startDate) {
      Promise.all([
        fetch(`/api/offices/${formData.office}`).then((r) => r.json()),
        fetch(
          `/api/reservations/by-office?office=${formData.office}&startDate=${formData.startDate}`
        ).then((r) => r.json()),
      ])
        .then(([officeData, reservationData]) => {
          const office = officeData.data;
          const date = new Date(formData.startDate);
          const dayName = date
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();
          const workingDay = office?.workingTime?.find(
            (wt: WorkingTime) => wt.day === dayName && wt.isOpen
          );

          if (workingDay) {
            setOfficeHours({
              startTime: workingDay.startTime,
              endTime: workingDay.endTime,
            });
          }
          setReservedSlots(reservationData.data?.reservedSlots || []);
        })
        .catch((err) => console.error(err));
    }
  }, [formData.office, formData.startDate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Load data from sessionStorage and user context
  useEffect(() => {
    const stored = sessionStorage.getItem("rentalDetails");
    let hasRentalData = false;

    if (stored) {
      const details = JSON.parse(stored);
      const pickupDate = details.pickupDate
        ? new Date(details.pickupDate)
        : null;
      const returnDate = details.returnDate
        ? new Date(details.returnDate)
        : null;

      const typeObj =
        typeof details.type === "string"
          ? types.find((t) => t._id === details.type) || { name: "" }
          : details.type || { name: "" };
      setFormData((prev) => ({
        ...prev,
        office: details.office || "",
        type: typeObj,
        category: details.category || "",
        startDate: pickupDate ? pickupDate.toISOString().split("T")[0] : "",
        startTime: pickupDate ? pickupDate.toTimeString().slice(0, 5) : "10:00",
        endDate: returnDate ? returnDate.toISOString().split("T")[0] : "",
        endTime: returnDate ? returnDate.toTimeString().slice(0, 5) : "10:00",
        driverAge: details.driverAge || 25,
      }));
      hasRentalData = !!(
        details.office &&
        details.pickupDate &&
        details.returnDate &&
        details.category &&
        details.type
      );
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));

      // If user is logged in and has rental data, go to step 3
      if (hasRentalData) {
        setStep(3);
      } else {
        // If user is logged in but no rental data, stay on step 1
        setStep(1);
      }
    } else {
      // If no user, check if rental data exists
      if (hasRentalData) {
        setStep(2); // Go to auth step
      } else {
        setStep(1); // Start from beginning
      }
    }
  }, [user, types]);

  const handleSendCode = async () => {
    if (!formData.phone.trim()) {
      setErrors({ phone: "Phone required" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send-code",
          phoneNumber: formData.phone,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setAuthStep("code");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrors({ phone: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.code.trim()) {
      setErrors({ code: "Code required" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          phoneNumber: formData.phone,
          code: formData.code,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      if (data.data.userExists) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setFormData((prev) => ({
          ...prev,
          name: data.data.user.name,
          lastName: data.data.user.lastName,
          email: data.data.user.emaildata?.emailAddress || "",
        }));
        setStep(3);
      } else {
        setAuthStep("register");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrors({ code: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          phoneNumber: formData.phone,
          name: formData.name,
          lastName: formData.lastName,
          emailAddress: formData.email,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      setIsNewUser(true);
      setStep(3);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null;
      if (!token || !user) {
        setErrors({ submit: "Please login first" });
        setStep(2);
        return;
      }

      const addOnsCost = selectedAddOns.reduce((total, item) => {
        const addon = addOns.find((a) => a._id === item.addOn);
        if (!addon || !priceCalc) return total;

        if (addon.pricingType === "flat") {
          const amount = addon.flatPrice?.amount || 0;
          const isPerDay = addon.flatPrice?.isPerDay || false;
          const multiplier = isPerDay ? priceCalc.totalDays : 1;
          return total + amount * multiplier * item.quantity;
        } else {
          const tierIndex = item.selectedTierIndex ?? 0;
          const price = addon.tieredPrice?.tiers?.[tierIndex]?.price || 0;
          const isPerDay = addon.tieredPrice?.isPerDay || false;
          const multiplier = isPerDay ? priceCalc.totalDays : 1;
          return total + price * multiplier * item.quantity;
        }
      }, 0);

      const payload = {
        userData: {
          userId: user._id,
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone,
        },
        reservationData: {
          office: formData.office,
          category: formData.category,
          startDate: new Date(`${formData.startDate}T${formData.startTime}`),
          endDate: new Date(`${formData.endDate}T${formData.endTime}`),
          totalPrice:
            (priceCalc?.totalPrice || 0) +
            addOnsCost +
            (selectedCategory?.deposit || 0),
          driverAge: formData.driverAge,
          messege: "",
          status: "pending",
          addOns: selectedAddOns,
        },
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Reservation failed");
      setIsSuccess(true);
      if (isNewUser) {
        setTimeout(() => {
          window.location.href = "/customerDashboard#profile";
        }, 2000);
      } else {
        setTimeout(() => onClose(), 2000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrors({ submit: message || "Failed to create reservation" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-10000 flex items-center justify-center">
          <div className="bg-[#0f172b] rounded-2xl p-8 text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-5xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Booking Confirmed!
            </h3>
            <p className="text-gray-400">
              {isNewUser
                ? "Please upload your license in the dashboard."
                : "We'll send you a confirmation email shortly."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-10000 flex items-center justify-center p-2 overflow-y-auto">
        <div className="relative bg-[#0f172b] rounded-2xl max-w-6xl w-full max-h-[99vh] overflow-y-auto border border-white/10">
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-b from-[#0f172b] to-[#0f172b]/95 border-b border-white/10 px-4 py-3 flex items-center justify-between z-10 backdrop-blur-sm">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-black text-white">
                Book Your Van
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1 rounded-full transition-all ${
                        s <= step ? "bg-[#fe9a00] w-8" : "bg-white/20 w-6"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs md:text-sm text-gray-400 ml-2">
                  Step {step} of 4
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-4  shrink-0"
            >
              <FiX className="text-white text-xl" />
            </button>
          </div>

          <div className="p-2">
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="relative ">
                {categories.length > 0 ? (
                  <>
                    {/* Desktop: Grid Layout */}
                    <div className="hidden md:grid grid-cols-4 gap-2 max-h-[80vh] overflow-y-auto p-2 pt-2 pb-12">
                      {categories.map((cat) => {
                        const catPrice = calculateCategoryPrice(cat);
                        return (
                          <div
                            key={`${cat._id}-${formData.category}`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                category: cat._id,
                              }))
                            }
                            className={`group relative h-96 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                              formData.category === cat._id
                                ? "ring-2 ring-[#fe9a00]"
                                : ""
                            }`}
                          >
                            <div className="absolute inset-0">
                              <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-all duration-500"
                                unoptimized
                              />
                              <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90 group-hover:from-black/70 group-hover:to-black/95 transition-all duration-500"></div>
                            </div>
                            <div className="relative h-full flex flex-col p-4 justify-between">
                              <div>
                                <h4 className="text-base font-black text-white line-clamp-1">
                                  {cat.name}
                                </h4>
                                <p className="text-gray-300 text-xs mb-2 line-clamp-1">
                                  {cat.expert}
                                </p>
                                <div className="flex gap-1 flex-wrap">
                                  <div className="px-2   rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1">
                                    <FiUsers className="text-[#fe9a00] text-[10px]" />
                                    <span className="text-white text-[10px] font-semibold">
                                      {cat.seats}
                                    </span>
                                  </div>
                                  <div className="px-2   rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1">
                                    <BsFuelPump className="text-[#fe9a00] text-[10px]" />
                                    <span className="text-white text-[10px] font-semibold">
                                      {cat.fuel}
                                    </span>
                                  </div>
                                  <div className="px-2   rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1">
                                    <FiPackage className="text-[#fe9a00] text-[10px]" />
                                    <span className="text-white text-[10px] font-semibold">
                                      {cat.cargo}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                {catPrice ? (
                                  <>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-black text-[#37cf6f]">
                                        £{catPrice.totalPrice}
                                      </span>
                                    </div>
                                    <p className="text-gray-400 text-xs">
                                      {catPrice.breakdown}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-black text-[#37cf6f]">
                                        £{cat.pricingTiers[0]?.pricePerDay}
                                      </span>
                                      <span className="text-gray-300 text-sm font-semibold">
                                        /day
                                      </span>
                                    </div>
                                    <p className="text-gray-400 text-[9px]">
                                      from
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            {formData.category === cat._id && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#fe9a00] flex items-center justify-center">
                                <FiCheckCircle className="text-white text-sm" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile: VanCard Layout */}
                    <div className="md:hidden space-y-3 max-h-[80vh] overflow-y-auto p-2 pt-2 pb-12">
                      {categories.map((cat) => {
                        const catPrice = calculateCategoryPrice(cat);
                        return (
                          <VanCard
                            key={`${cat._id}-${formData.category}`}
                            van={cat}
                            isSelected={formData.category === cat._id}
                            onSelect={() =>
                              setFormData((prev) => ({
                                ...prev,
                                category: cat._id,
                              }))
                            }
                            calculatedPrice={catPrice?.totalPrice}
                            breakdown={catPrice?.breakdown}
                          />
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-[#fe9a00]/30 border-t-[#fe9a00] rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300 text-lg font-semibold">
                      Loading categories...
                    </p>
                    <p className="text-gray-500 text-sm mt-2">Please wait</p>
                  </div>
                )}

                {formData.category && (
                  <div className="absolute bottom-0 left-0 right-0 px-8 z-20 animate-[slideUp_0.5s_ease-out]">
                    <button
                      onClick={() => {
                        const stored = sessionStorage.getItem("rentalDetails");
                        if (stored) {
                          const details = JSON.parse(stored);
                          details.category = formData.category;
                          sessionStorage.setItem(
                            "rentalDetails",
                            JSON.stringify(details)
                          );
                        }
                        setStep(user ? 3 : 2);
                      }}
                      className="w-full bg-[#fe9a00] hover:bg-orange-600 hover:scale-[1.02] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-2xl"
                    >
                      {user ? "Continue" : "Continue to Login"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Authentication */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">
                  Login or Sign Up
                </h3>

                {authStep === "phone" && (
                  <div>
                    <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                      <FiPhone className="text-[#fe9a00]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                      placeholder="+44 123 456 7890"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                    <button
                      onClick={handleSendCode}
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-[#fe9a00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Send Code"}
                    </button>
                  </div>
                )}

                {authStep === "code" && (
                  <div>
                    <label className="text-white text-sm font-semibold mb-2 block text-center">
                      Enter Verification Code
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          code: e.target.value,
                        }))
                      }
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#fe9a00]"
                      placeholder="000000"
                    />
                    {errors.code && (
                      <p className="text-red-400 text-xs mt-1 text-center">
                        {errors.code}
                      </p>
                    )}
                    <button
                      onClick={handleVerifyCode}
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-[#fe9a00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Verifying..." : "Verify Code"}
                    </button>
                    <button
                      onClick={() => setAuthStep("phone")}
                      className="w-full mt-2 text-[#fe9a00] text-sm hover:underline"
                    >
                      Change phone number
                    </button>
                  </div>
                )}

                {authStep === "register" && (
                  <div className="space-y-3">
                    <p className="text-white text-sm text-center mb-4">
                      Complete your profile
                    </p>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiUser className="text-[#fe9a00]" />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                        placeholder="John"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiUser className="text-[#fe9a00]" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiMail className="text-[#fe9a00]" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleRegister}
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-[#fe9a00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Creating Account..."
                        : "Complete Registration"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Add-ons */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">
                  Add-ons & Gear Selection
                </h3>

                {selectedCategory && priceCalc && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex gap-3 mb-3">
                      <Image
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-bold">
                          {selectedCategory.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {priceCalc.breakdown}
                        </p>
                        <p className="text-[#fe9a00] font-bold text-lg mt-1">
                          Total: £{priceCalc.totalPrice}
                        </p>
                      </div>
                    </div>

                    {selectedCategory?.gear?.availableTypes?.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <h5 className="text-white text-sm font-semibold mb-2">
                          Gear Type
                        </h5>
                        <div className="flex gap-2">
                          {selectedCategory.gear.availableTypes.includes(
                            "manual"
                          ) && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  gearType: "manual",
                                }))
                              }
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                                formData.gearType === "manual"
                                  ? "bg-[#fe9a00] text-white"
                                  : "bg-white/10 text-gray-300 hover:bg-white/20"
                              }`}
                            >
                              Manual
                            </button>
                          )}
                          {selectedCategory.gear.availableTypes.includes(
                            "automatic"
                          ) && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  gearType: "automatic",
                                }))
                              }
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                                formData.gearType === "automatic"
                                  ? "bg-[#fe9a00] text-white"
                                  : "bg-white/10 text-gray-300 hover:bg-white/20"
                              }`}
                            >
                              Automatic
                              {(selectedCategory.gear as any)
                                ?.automaticExtraCost > 0 && (
                                <span className="text-xs ml-1">
                                  (+£
                                  {
                                    (selectedCategory.gear as any)
                                      .automaticExtraCost
                                  }
                                  /day)
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {addOns.length > 0 && priceCalc && (
                  <div>
                    <h4 className="text-white font-semibold mb-3">
                      Available Add-ons
                    </h4>
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                      {addOns.map((addon) => {
                        const selected = selectedAddOns.find(
                          (s) => s.addOn === addon._id
                        );
                        const rentalDays = priceCalc.totalDays;
                        return (
                          <div
                            key={addon._id}
                            className="bg-white/5 border border-white/10 rounded-xl p-3"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="text-white font-semibold text-sm">
                                  {addon.name}
                                </h5>
                                {addon.description && (
                                  <p className="text-gray-400 text-xs mt-1">
                                    {addon.description}
                                  </p>
                                )}
                                {addon.pricingType === "flat" ? (
                                  <p className="text-[#fe9a00] text-sm font-bold mt-1">
                                    £{addon.flatPrice?.amount || 0}
                                    {addon.flatPrice?.isPerDay && (
                                      <span className="text-gray-400 text-xs ml-1">
                                        /day × {rentalDays} days = £
                                        {(
                                          addon.flatPrice.amount * rentalDays
                                        ).toFixed(2)}
                                      </span>
                                    )}
                                  </p>
                                ) : (
                                  <div className="mt-2 space-y-1">
                                    {addon.tieredPrice?.tiers?.map(
                                      (tier, idx) => {
                                        const isInRange =
                                          rentalDays >= tier.minDays &&
                                          rentalDays <= tier.maxDays;
                                        const totalPrice = addon.tieredPrice
                                          ?.isPerDay
                                          ? tier.price * rentalDays
                                          : tier.price;
                                        return (
                                          <button
                                            key={idx}
                                            onClick={() => {
                                              const existing =
                                                selectedAddOns.find(
                                                  (s) => s.addOn === addon._id
                                                );
                                              if (
                                                existing?.selectedTierIndex ===
                                                idx
                                              )
                                                return;
                                              setSelectedAddOns((prev) => {
                                                const filtered = prev.filter(
                                                  (s) => s.addOn !== addon._id
                                                );
                                                return [
                                                  ...filtered,
                                                  {
                                                    addOn: addon._id,
                                                    quantity: 1,
                                                    selectedTierIndex: idx,
                                                  },
                                                ];
                                              });
                                            }}
                                            className={`text-xs px-2 py-1 rounded border transition-all ${
                                              selected?.selectedTierIndex ===
                                              idx
                                                ? "bg-[#fe9a00] border-[#fe9a00] text-white"
                                                : isInRange
                                                ? "bg-green-500/20 border-green-500/50 text-green-300 hover:border-[#fe9a00]/50"
                                                : "bg-white/5 border-white/10 text-gray-400 hover:border-[#fe9a00]/50"
                                            }`}
                                          >
                                            {tier.minDays}-{tier.maxDays} days:
                                            £{tier.price}
                                            {addon.tieredPrice?.isPerDay && (
                                              <span className="ml-1">
                                                /day = £{totalPrice.toFixed(2)}
                                              </span>
                                            )}
                                            {isInRange && (
                                              <span className="ml-1">✓</span>
                                            )}
                                          </button>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                <button
                                  onClick={() => {
                                    setSelectedAddOns((prev) => {
                                      const existing = prev.find(
                                        (s) => s.addOn === addon._id
                                      );
                                      if (!existing || existing.quantity <= 1) {
                                        return prev.filter(
                                          (s) => s.addOn !== addon._id
                                        );
                                      }
                                      return prev.map((s) =>
                                        s.addOn === addon._id
                                          ? { ...s, quantity: s.quantity - 1 }
                                          : s
                                      );
                                    });
                                  }}
                                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                                >
                                  -
                                </button>
                                <span className="text-white font-semibold w-6 text-center">
                                  {selected?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => {
                                    setSelectedAddOns((prev) => {
                                      const existing = prev.find(
                                        (s) => s.addOn === addon._id
                                      );
                                      if (existing) {
                                        return prev.map((s) =>
                                          s.addOn === addon._id
                                            ? { ...s, quantity: s.quantity + 1 }
                                            : s
                                        );
                                      }
                                      return [
                                        ...prev,
                                        {
                                          addOn: addon._id,
                                          quantity: 1,
                                          selectedTierIndex:
                                            addon.pricingType === "tiered"
                                              ? 0
                                              : undefined,
                                        },
                                      ];
                                    });
                                  }}
                                  className="w-7 h-7 rounded bg-[#fe9a00] hover:bg-orange-600 text-white flex items-center justify-center transition-all"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-[#fe9a00] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {/* Step 4: Final Review & Confirm */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">
                  Review Your Booking
                </h3>

                {/* Office & Location */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiMapPin className="text-[#fe9a00] text-lg" />
                    <h4 className="text-white font-semibold">
                      Pickup Location
                    </h4>
                  </div>
                  <p className="text-white font-bold">
                    {offices.find((o) => o._id === formData.office)?.name}
                  </p>
                </div>

                {/* Vehicle Details */}
                {selectedCategory && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3">
                      Vehicle Details
                    </h4>
                    <div className="flex gap-3">
                      <Image
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="text-white font-bold text-lg">
                          {selectedCategory.name}
                        </h5>
                        <p className="text-gray-400 text-sm">
                          {selectedCategory.expert} or similar
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <div className="px-2 py-1 rounded bg-white/10 text-xs text-white">
                            <FiUsers className="inline mr-1" />
                            {selectedCategory.seats} seats
                          </div>
                          <div className="px-2 py-1 rounded bg-white/10 text-xs text-white">
                            <BsFuelPump className="inline mr-1" />
                            {selectedCategory.fuel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rental Period */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCalendar className="text-[#fe9a00] text-lg" />
                    <h4 className="text-white font-semibold">Rental Period</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pickup:</span>
                      <span className="text-white font-semibold">
                        {formData.startDate} at {formData.startTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Return:</span>
                      <span className="text-white font-semibold">
                        {formData.endDate} at {formData.endTime}
                      </span>
                    </div>
                    {priceCalc && (
                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white font-semibold">
                          {priceCalc.totalDays} days,{" "}
                          {priceCalc.totalHours % 24} hours
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gear Type */}
                {formData.gearType &&
                  selectedCategory?.gear?.availableTypes?.length > 1 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-2">
                        Gear Type
                      </h4>
                      <p className="text-white capitalize">
                        {formData.gearType}
                      </p>
                      {formData.gearType === "automatic" &&
                        (selectedCategory.gear as any)?.automaticExtraCost >
                          0 && (
                          <p className="text-gray-400 text-sm mt-1">
                            +£
                            {(selectedCategory.gear as any).automaticExtraCost}
                            /day
                          </p>
                        )}
                    </div>
                  )}

                {/* Add-ons */}
                {selectedAddOns.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FiPackage className="text-[#fe9a00] text-lg" />
                      <h4 className="text-white font-semibold">Add-ons</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedAddOns.map((item) => {
                        const addon = addOns.find((a) => a._id === item.addOn);
                        if (!addon) return null;
                        let price = 0;
                        if (addon.pricingType === "flat") {
                          const amount = addon.flatPrice?.amount || 0;
                          const isPerDay = addon.flatPrice?.isPerDay || false;
                          price =
                            (isPerDay ? amount * rentalDays : amount) *
                            item.quantity;
                        } else if (
                          item.selectedTierIndex !== undefined &&
                          addon.tieredPrice?.tiers?.[item.selectedTierIndex]
                        ) {
                          const tier =
                            addon.tieredPrice.tiers[item.selectedTierIndex];
                          const isPerDay = addon.tieredPrice.isPerDay || false;
                          price =
                            (isPerDay ? tier.price * rentalDays : tier.price) *
                            item.quantity;
                        }
                        return (
                          <div
                            key={item.addOn}
                            className="flex justify-between"
                          >
                            <span className="text-gray-300">
                              {addon.name} × {item.quantity}
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

                {/* Customer Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiUser className="text-[#fe9a00] text-lg" />
                    <h4 className="text-white font-semibold">
                      Customer Details
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-semibold">
                        {formData.name} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white font-semibold">
                        {formData.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white font-semibold">
                        {formData.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Driver Age:</span>
                      <span className="text-white font-semibold">
                        {formData.driverAge} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                {priceCalc && (
                  <div className="bg-linear-to-br from-[#fe9a00]/20 to-orange-600/20 border border-[#fe9a00]/30 rounded-xl p-4">
                    <h4 className="text-white font-bold text-lg mb-3">
                      Price Breakdown
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">{priceCalc.breakdown}</p>
                      <div className="pt-3 border-t border-white/20">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-lg">
                            Total Price:
                          </span>
                          <span className="text-[#fe9a00] font-black text-3xl">
                            £{priceCalc.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#fe9a00] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Reservation"}
                  </button>
                </div>

                {errors.submit && (
                  <p className="text-red-400 text-sm text-center">
                    {errors.submit}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddOnsModal && priceCalc && addOns.length > 0 && (
        <AddOnsModal
          addOns={addOns}
          selectedAddOns={selectedAddOns}
          onSave={setSelectedAddOns}
          onClose={() => setShowAddOnsModal(false)}
          rentalDays={Math.ceil(priceCalc.totalHours / 24)}
        />
      )}
    </>
  );
}
