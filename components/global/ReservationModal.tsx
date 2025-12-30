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
  FiAlertCircle,
} from "react-icons/fi";

import AddOnsModal from "./AddOnsModal";
import VanCard from "./VanCard";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import Image from "next/image";
import { BsFuelPump } from "react-icons/bs";
import { WorkingTime } from "@/types/type";
import { MdDoorSliding } from "react-icons/md";

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
  doors: number;
  fuel: string;
  cargo: string;
  expert: string;
  selloffer?: number;
  gear: {
    availableTypes: ("manual" | "automatic")[];
    automaticExtraCost?: number;
  };
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

interface ReservationModalProps {
  onClose: () => void;
  isAdminMode?: boolean;
}

export default function ReservationModal({ onClose, isAdminMode = false }: ReservationModalProps) {
  const { user: authUser } = useAuth();
  const user = isAdminMode ? null : authUser; // Ignore logged-in user in admin mode
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
    acceptTerms: false,
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
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [customerUserId, setCustomerUserId] = useState<string>("");
  const [licenseFront, setLicenseFront] = useState<string>("");
  const [licenseBack, setLicenseBack] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [uploadingLicense, setUploadingLicense] = useState({ front: false, back: false });

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
    const originalPricePerDay = tier.pricePerDay;
    let pricePerDay = tier.pricePerDay;
    if (cat.selloffer && cat.selloffer > 0) {
      pricePerDay = pricePerDay * (1 - cat.selloffer / 100);
    }
    const originalDaysPrice = totalDays * originalPricePerDay;
    const daysPrice = totalDays * pricePerDay;
    const extraHoursPrice = extraHours * (cat.extrahoursRate || 0);
    const originalTotalPrice = originalDaysPrice + extraHoursPrice;
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
    return {
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      originalTotalPrice: parseFloat(originalTotalPrice.toFixed(2)),
      breakdown,
    };
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

  const finalPrice = useMemo(() => {
    if (!priceCalc) return null;
    if (!appliedDiscount) return priceCalc.totalPrice;
    const discountAmount = (priceCalc.totalPrice * appliedDiscount.percentage) / 100;
    return parseFloat((priceCalc.totalPrice - discountAmount).toFixed(2));
  }, [priceCalc, appliedDiscount]);

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
    fetch("/api/addons?status=active")
      .then((res) => res.json())
      .then((data) => {
        console.log("Add-ons response:", data);
        const addonsData = data.data?.data || data.data || [];
        setAddOns(Array.isArray(addonsData) ? addonsData : []);
      })
      .catch((err) => console.error(err));
  }, []);

  console.log(priceCalc, "priceCalc");
  console.log(addOns, "addOns");

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

    // In admin mode, always start at step 2 (authentication) for customer
    // In normal mode, check if user is logged in
    if (isAdminMode) {
      if (hasRentalData) {
        setStep(2); // Go to auth to get customer info
      } else {
        setStep(1); // Start from category selection
      }
    } else {
      // Normal customer flow
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
        }));
        if (hasRentalData) {
          setStep(3);
        } else {
          setStep(1);
        }
      } else {
        if (hasRentalData) {
          setStep(2);
        } else {
          setStep(1);
        }
      }
    }
  }, [types, isAdminMode, user]);

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
          phoneNumber: `+44${formData.phone}`,
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
          phoneNumber: `+44${formData.phone}`,
          code: formData.code,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      if (data.data.userExists) {
        if (!isAdminMode) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
        setCustomerUserId(data.data.user._id);
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

  const handleLicenseUpload = async (file: File, side: "front" | "back") => {
    setUploadingLicense({ ...uploadingLicense, [side]: true });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.error) throw new Error(uploadData.error);
      
      if (side === "front") {
        setLicenseFront(uploadData.url);
      } else {
        setLicenseBack(uploadData.url);
      }
      showToast.success(`License ${side} uploaded!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Upload failed");
    } finally {
      setUploadingLicense({ ...uploadingLicense, [side]: false });
    }
  };

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!address.trim()) newErrors.address = "Address required";
    if (isAdminMode) {
      if (!licenseFront) newErrors.licenseFront = "License front required";
      if (!licenseBack) newErrors.licenseBack = "License back required";
    }
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
          phoneNumber: `+44${formData.phone}`,
          name: formData.name,
          lastName: formData.lastName,
          emailAddress: formData.email,
          address: address,
          ...(isAdminMode && {
            licenceAttached: { front: licenseFront, back: licenseBack },
          }),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      if (!isAdminMode) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      setCustomerUserId(data.data.user._id);
      setIsNewUser(true);
      setStep(3);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
    if (!user) {
      setDiscountError("Please login to apply discount");
      return;
    }
    setIsApplyingDiscount(true);
    setDiscountError("");
    try {
      const res = await fetch(`/api/discounts?status=active`);
      const data = await res.json();
      if (!data.success) throw new Error("Invalid discount code");
      const discounts = data.data.data || data.data;
      const discount = discounts.find((d: any) => d.code.toUpperCase() === discountCode.toUpperCase());
      if (!discount) throw new Error("Invalid discount code");
      const now = new Date();
      const validFrom = new Date(discount.validFrom);
      const validTo = new Date(discount.validTo);
      if (now < validFrom || now > validTo) throw new Error("Discount code has expired");
      if (discount.usageLimit && discount.usageCount >= discount.usageLimit) throw new Error("Discount code usage limit reached");
      if (discount.usedBy?.includes(user._id)) throw new Error("You have already used this discount code");
      if (discount.categories?.length > 0 && formData.category) {
        const categoryIds = discount.categories.map((c: any) => c._id || c);
        if (!categoryIds.includes(formData.category)) throw new Error("Discount not valid for this vehicle");
      }
      setAppliedDiscount(discount);
      setDiscountError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid discount code";
      setDiscountError(message);
      setAppliedDiscount(null);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      setErrors({ acceptTerms: "You must accept the terms and conditions" });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      let userId = customerUserId;
      
      if (!isAdminMode) {
        const user = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")!)
          : null;
        if (!token || !user) {
          setErrors({ submit: "Please login first" });
          setStep(2);
          return;
        }
        userId = user._id;
      } else {
        if (!customerUserId) {
          setErrors({ submit: "Customer verification required" });
          setStep(2);
          return;
        }
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
          userId: userId,
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
            (finalPrice || priceCalc?.totalPrice || 0) +
            addOnsCost +
            (selectedCategory?.deposit || 0),
          driverAge: formData.driverAge,
          messege: "",
          status: "pending",
          addOns: selectedAddOns,
          discountCode: appliedDiscount?.code || null,
        },
      };

      if (appliedDiscount) {
        await fetch(`/api/discounts?id=${appliedDiscount._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addUserToUsedBy: user._id }),
        });
      }

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
      if (isAdminMode) {
        setTimeout(() => onClose(), 2000);
      } else if (isNewUser) {
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
                ? "Please upload your Licenses in the dashboard."
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
                                    <MdDoorSliding className="text-[#fe9a00] text-[10px]" />
                                    <span className="text-white text-[10px] font-semibold">
                                      {cat.doors}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                {catPrice ? (
                                  <>
                                    {(cat as any).selloffer &&
                                    (cat as any).selloffer > 0 ? (
                                      <>
                                        <div className="flex items-baseline gap-1 mb-1">
                                          <span className="text-sm font-bold text-gray-400 line-through">
                                            £{catPrice.originalTotalPrice}
                                          </span>
                                          <span className="text-2xl font-black text-[#37cf6f]">
                                            £{catPrice.totalPrice}
                                          </span>
                                        </div>
                                        <p className="text-[#fe9a00] text-[10px] font-bold mb-1">
                                          {(cat as any).selloffer}% OFF
                                        </p>
                                      </>
                                    ) : (
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-[#37cf6f]">
                                          £{catPrice.totalPrice}
                                        </span>
                                      </div>
                                    )}
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
                            originalPrice={catPrice?.originalTotalPrice}
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
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 font-medium">+44</div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          setFormData((prev) => ({
                            ...prev,
                            phone: digits,
                          }));
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                        placeholder="7400123456"
                      />
                    </div>
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
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiMapPin className="text-[#fe9a00]" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setErrors({ ...errors, address: "" });
                        }}
                        className={`w-full bg-white/5 border ${
                          errors.address ? "border-red-500" : "border-white/10"
                        } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]`}
                        placeholder="123 Main Street, London"
                      />
                      {errors.address && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>
                    {isAdminMode && (
                      <>
                        <div>
                          <label className="text-white text-sm font-semibold mb-2 block">
                            License Front
                          </label>
                          {licenseFront ? (
                            <div className="relative">
                              <img
                                src={licenseFront}
                                alt="License Front"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-[#fe9a00] hover:bg-orange-600 text-white rounded-lg cursor-pointer text-xs font-semibold">
                                {uploadingLicense.front ? "Uploading..." : "Change"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    e.target.files?.[0] &&
                                    handleLicenseUpload(e.target.files[0], "front")
                                  }
                                  disabled={uploadingLicense.front}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#fe9a00] transition-colors">
                              <span className="text-gray-400 text-sm">
                                {uploadingLicense.front ? "Uploading..." : "+ Upload Front"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  e.target.files?.[0] &&
                                  handleLicenseUpload(e.target.files[0], "front")
                                }
                                disabled={uploadingLicense.front}
                              />
                            </label>
                          )}
                          {errors.licenseFront && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.licenseFront}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-white text-sm font-semibold mb-2 block">
                            License Back
                          </label>
                          {licenseBack ? (
                            <div className="relative">
                              <img
                                src={licenseBack}
                                alt="License Back"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-[#fe9a00] hover:bg-orange-600 text-white rounded-lg cursor-pointer text-xs font-semibold">
                                {uploadingLicense.back ? "Uploading..." : "Change"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    e.target.files?.[0] &&
                                    handleLicenseUpload(e.target.files[0], "back")
                                  }
                                  disabled={uploadingLicense.back}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#fe9a00] transition-colors">
                              <span className="text-gray-400 text-sm">
                                {uploadingLicense.back ? "Uploading..." : "+ Upload Back"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  e.target.files?.[0] &&
                                  handleLicenseUpload(e.target.files[0], "back")
                                }
                                disabled={uploadingLicense.back}
                              />
                            </label>
                          )}
                          {errors.licenseBack && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.licenseBack}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-white text-sm font-semibold mb-2 block">
                            Address
                          </label>
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00] resize-none"
                            placeholder="Full address"
                          />
                          {errors.address && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.address}
                            </p>
                          )}
                        </div>
                      </>
                    )}
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
                          Gearbox
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

                <div>
                  <h4 className="text-white font-semibold mb-3">
                    Available Add-ons
                  </h4>
                  {!Array.isArray(addOns) || addOns.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <FiAlertCircle className="text-gray-400 text-2xl mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No add-ons available</p>
                    </div>
                  ) : !priceCalc ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 border-2 border-[#fe9a00]/30 border-t-[#fe9a00] rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-400 text-sm">Loading pricing...</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                      {addOns.filter((addon) => {
                        return addon.pricingType === "flat" || addon.tieredPrice?.tiers?.some(
                          (tier) => priceCalc.totalDays >= tier.minDays && priceCalc.totalDays <= tier.maxDays
                        );
                      }).map((addon) => {
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
                                  <div className="mt-2">
                                    <p className="text-gray-400 text-xs mb-1">
                                      {addon.tieredPrice?.isPerDay && `(per day × ${rentalDays} days)`}
                                    </p>
                                    {addon.tieredPrice?.tiers?.filter(
                                      (tier) => rentalDays >= tier.minDays && rentalDays <= tier.maxDays
                                    ).map((tier) => {
                                      const originalIdx = addon.tieredPrice?.tiers?.indexOf(tier) || 0;
                                      const totalPrice = addon.tieredPrice?.isPerDay
                                        ? tier.price * rentalDays
                                        : tier.price;
                                      return (
                                        <p key={originalIdx} className="text-[#fe9a00] text-sm font-bold">
                                          £{tier.price}
                                          {addon.tieredPrice?.isPerDay && (
                                            <span className="text-gray-400 text-xs ml-1">
                                              /day × {rentalDays} days = £{totalPrice.toFixed(2)}
                                            </span>
                                          )}
                                        </p>
                                      );
                                    })}
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
                                      let defaultTierIndex = undefined;
                                      if (addon.pricingType === "tiered" && addon.tieredPrice?.tiers) {
                                        const matchingTierIndex = addon.tieredPrice.tiers.findIndex(
                                          (tier) => rentalDays >= tier.minDays && rentalDays <= tier.maxDays
                                        );
                                        defaultTierIndex = matchingTierIndex !== -1 ? matchingTierIndex : 0;
                                      }
                                      return [
                                        ...prev,
                                        {
                                          addOn: addon._id,
                                          quantity: 1,
                                          selectedTierIndex: defaultTierIndex,
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
                  )}
                </div>

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
                  selectedCategory?.gear?.availableTypes?.length || 0 > 1 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-2">
                        Gearbox
                      </h4>
                      <p className="text-white capitalize">
                        {formData.gearType}
                      </p>
                      {formData.gearType === "automatic" &&
                        (selectedCategory?.gear as Category["gear"])?.automaticExtraCost|| 0 > 0 && (
                          <p className="text-gray-400 text-sm mt-1">
                            +£
                            {(selectedCategory?.gear as Category["gear"]).automaticExtraCost|| 0}
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

                {/* Discount Code */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Discount Code</h4>
                  {!appliedDiscount ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value.toUpperCase());
                            setDiscountError("");
                          }}
                          placeholder="Enter code"
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] uppercase text-sm"
                        />
                        <button
                          onClick={handleApplyDiscount}
                          disabled={isApplyingDiscount || !discountCode.trim()}
                          className="px-4 py-2 bg-[#fe9a00] hover:bg-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 text-sm"
                        >
                          {isApplyingDiscount ? "..." : "Apply"}
                        </button>
                      </div>
                      {discountError && (
                        <p className="text-red-400 text-xs">{discountError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-400 font-bold">{appliedDiscount.code}</p>
                          <p className="text-green-300 text-xs mt-1">
                            {appliedDiscount.percentage}% discount applied
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveDiscount}
                          className="text-red-400 hover:text-red-300 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                {priceCalc && (
                  <div className="bg-linear-to-br from-[#fe9a00]/20 to-orange-600/20 border border-[#fe9a00]/30 rounded-xl p-4">
                    <h4 className="text-white font-bold text-lg mb-3">
                      Price Breakdown
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">{priceCalc.breakdown}</p>
                      {appliedDiscount && (
                        <div className="flex justify-between items-center text-green-400 pt-2">
                          <span className="font-semibold">
                            Discount ({appliedDiscount.percentage}%)
                          </span>
                          <span className="font-semibold">
                            -£{((priceCalc.totalPrice * appliedDiscount.percentage) / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-white/20">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-lg">
                            Total Price:
                          </span>
                          <span className="text-[#fe9a00] font-black text-3xl">
                            £{finalPrice || priceCalc.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 items-center">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          acceptTerms: e.target.checked,
                        }))
                      }
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#fe9a00] focus:ring-[#fe9a00] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-gray-300 text-sm">
                      I agree to the{" "}
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        className="text-[#fe9a00] hover:underline font-semibold"
                      >
                        Terms & Conditions
                      </a>{" "}
                      
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-red-400 text-xs mt-2">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.acceptTerms}
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
