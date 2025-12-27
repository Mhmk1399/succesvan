"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { IoIosArrowForward } from "react-icons/io";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiUsers,
  FiPackage,
  FiCheckCircle,
  FiInfo,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiMessageSquare,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import Image from "next/image";
import { VanData, Office } from "@/types/type";
import CustomSelect from "@/components/ui/CustomSelect";
import TimeSelect from "@/components/ui/TimeSelect";
import { generateTimeSlots } from "@/utils/timeSlots";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import AddOnsModal from "./AddOnsModal";

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
  status?: "active" | "inactive";
}
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category extends VanData {
  expert?: string;
  properties?: { key: string; value: string }[];
  purpose?: string;
}

interface VanListingProps {
  vans?: VanData[];
}

export default function VanListingHome({ vans = [] }: VanListingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(vans.length === 0);

  const [categories, setCategories] = useState<Category[]>(vans as Category[]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (vans.length > 0) {
      setCategories(vans as Category[]);
    }
  }, [vans.length]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/categories?status=active")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const categoriesData = data?.data?.data || data?.data || [];
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          console.log("Setting van categories:", categoriesData.length);
          setCategories(categoriesData);
        }
      })
      .catch((err) => console.log("Failed to fetch categories", err))
      .finally(() => setIsLoading(false));
  }, [vans.length]);

  const setCardRef = useCallback((index: number, el: HTMLDivElement | null) => {
    cardsRef.current[index] = el;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0f172b] py-20 z-10"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Choose Your
            <br />
            <span className="text-[#fe9a00]">Perfect Van</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find the ideal van for your needs from our modern fleet
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <SkeletonCard key={index} />
              ))}
          </div>
        ) : categories.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              {categories.map((category, index) => (
                <div key={category._id} ref={(el) => setCardRef(index, el)}>
                  <CategoryCard
                    category={category}
                    onView={() => setSelectedCategory(category)}
                    onDetails={() => {
                      setSelectedCategory(category);
                      setShowDetailsModal(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiAlertCircle className="mx-auto h-20 w-20 text-gray-400 mb-6" />
            <h3 className="text-2xl lg:text-3xl font-black text-white mb-4">
              No vans available right now
            </h3>
            <p className="text-gray-400 text-lg max-w-md mb-8">
              Our fleet is being updated. Check back soon or contact us for
              options.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedCategory && (
        <CategoryDetailsModal
          category={selectedCategory}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Reservation Panel */}
      {selectedCategory && !showDetailsModal && (
        <ReservationPanelPortal
          van={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </section>
  );
}

function ReservationPanelPortal({
  van,
  onClose,
}: {
  van: VanData;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <ReservationPanel van={van} onClose={onClose} />,
    document.body
  );
}

function ReservationPanel({
  van,
  onClose,
}: {
  van: VanData;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"auth" | "details">("auth");
  const [authStep, setAuthStep] = useState<"phone" | "code" | "register">(
    "phone"
  );
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    code: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "10:00",
    returnTime: "10:00",
    pickupLocation: "",
    notes: "",
    acceptTerms: false,
    office: "",
    category: van._id,
    driverAge: 25,
    gearType: "manual" as "manual" | "automatic",
  });

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [startDateReservedSlots, setStartDateReservedSlots] = useState<
    {
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      isSameDay: boolean;
    }[]
  >([]);
  const [endDateReservedSlots, setEndDateReservedSlots] = useState<
    {
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      isSameDay: boolean;
    }[]
  >([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<
    { addOn: string; quantity: number; selectedTierIndex?: number }[]
  >([]);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [addOnsCost, setAddOnsCost] = useState(0);

  const [pickupExtensionPrice, setPickupExtensionPrice] = useState(0);
  const [returnExtensionPrice, setReturnExtensionPrice] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const basePriceCalc = usePriceCalculation(
    dateRange[0].startDate && formData.pickupTime
      ? `${format(dateRange[0].startDate, "yyyy-MM-dd")}T${
          formData.pickupTime
        }:00`
      : "",
    dateRange[0].endDate && formData.returnTime
      ? `${format(dateRange[0].endDate, "yyyy-MM-dd")}T${
          formData.returnTime
        }:00`
      : "",
    (van as any).pricingTiers || [],
    (van as any).extrahoursRate || 0,
    pickupExtensionPrice,
    returnExtensionPrice,
    formData.gearType === "automatic" &&
      (van as any)?.gear?.availableTypes?.includes("automatic") &&
      (van as any)?.gear?.availableTypes?.includes("manual")
      ? (van as any)?.gear?.automaticExtraCost || 0
      : 0,
    addOnsCost,
    (van as any)?.selloffer || 0
  );

  const priceCalc = useMemo(() => {
    if (!basePriceCalc) return null;
    if (!appliedDiscount) return basePriceCalc;
    const discountAmount =
      (basePriceCalc.totalPrice * appliedDiscount.percentage) / 100;
    return {
      ...basePriceCalc,
      totalPrice: parseFloat(
        (basePriceCalc.totalPrice - discountAmount).toFixed(2)
      ),
      discountAmount,
    };
  }, [basePriceCalc, appliedDiscount]);

  // Fetch offices
  useEffect(() => {
    console.log("Fetching offices...");
    fetch("/api/offices")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Offices response:", data);
        const offices = data?.data?.data || data?.data || [];
        if (Array.isArray(offices)) {
          setOffices(offices);
        }
      })
      .catch((err) => console.log("Failed to fetch offices", err));
  }, []);

  // Fetch add-ons
  useEffect(() => {
    fetch("/api/addons?status=active")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const addOns = data?.data?.data || data?.data || [];
        if (Array.isArray(addOns)) {
          setAddOns(addOns);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Calculate extension prices
  useEffect(() => {
    if (!formData.office || !dateRange[0].startDate || !formData.pickupTime) {
      setPickupExtensionPrice(0);
      return;
    }
    const office = offices.find((o) => o._id === formData.office);
    if (!office) return;
    const date = dateRange[0].startDate;
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
      const [pickupHour, pickupMin] = formData.pickupTime
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
      const beforeStart =
        startMinutes - workingDay.pickupExtension.hoursBefore * 60;
      const afterEnd = endMinutes + workingDay.pickupExtension.hoursAfter * 60;
      if (pickupMinutes < startMinutes || pickupMinutes > endMinutes) {
        if (pickupMinutes >= beforeStart && pickupMinutes < startMinutes) {
          setPickupExtensionPrice(workingDay.pickupExtension.flatPrice || 0);
        } else if (pickupMinutes > endMinutes && pickupMinutes <= afterEnd) {
          setPickupExtensionPrice(workingDay.pickupExtension.flatPrice || 0);
        } else {
          setPickupExtensionPrice(0);
        }
      } else {
        setPickupExtensionPrice(0);
      }
    } else {
      setPickupExtensionPrice(0);
    }
  }, [formData.office, formData.pickupTime, dateRange, offices]);

  useEffect(() => {
    if (!formData.office || !dateRange[0].endDate || !formData.returnTime) {
      setReturnExtensionPrice(0);
      return;
    }
    const office = offices.find((o) => o._id === formData.office);
    if (!office) return;
    const date = dateRange[0].endDate;
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
      const [returnHour, returnMin] = formData.returnTime
        .split(":")
        .map(Number);
      const [startHour, startMin] = (workingDay.startTime || "00:00")
        .split(":")
        .map(Number);
      const [endHour, endMin] = (workingDay.endTime || "23:59")
        .split(":")
        .map(Number);
      const returnMinutes = returnHour * 60 + returnMin;
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const beforeStart =
        startMinutes - workingDay.returnExtension.hoursBefore * 60;
      const afterEnd = endMinutes + workingDay.returnExtension.hoursAfter * 60;
      if (returnMinutes < startMinutes || returnMinutes > endMinutes) {
        if (returnMinutes >= beforeStart && returnMinutes < startMinutes) {
          setReturnExtensionPrice(workingDay.returnExtension.flatPrice || 0);
        } else if (returnMinutes > endMinutes && returnMinutes <= afterEnd) {
          setReturnExtensionPrice(workingDay.returnExtension.flatPrice || 0);
        } else {
          setReturnExtensionPrice(0);
        }
      } else {
        setReturnExtensionPrice(0);
      }
    } else {
      setReturnExtensionPrice(0);
    }
  }, [formData.office, formData.returnTime, dateRange, offices]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null;
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
      const discount = discounts.find(
        (d: any) => d.code.toUpperCase() === discountCode.toUpperCase()
      );
      if (!discount) throw new Error("Invalid discount code");
      const now = new Date();
      const validFrom = new Date(discount.validFrom);
      const validTo = new Date(discount.validTo);
      if (now < validFrom || now > validTo)
        throw new Error("Discount code has expired");
      if (discount.usageLimit && discount.usageCount >= discount.usageLimit)
        throw new Error("Discount code usage limit reached");
      if (discount.usedBy?.includes(user._id))
        throw new Error("You have already used this discount code");
      if (discount.categories?.length > 0) {
        const categoryIds = discount.categories.map((c: any) => c._id || c);
        if (!categoryIds.includes(van._id))
          throw new Error("Discount not valid for this vehicle");
      }
      setAppliedDiscount(discount);
      setDiscountError("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid discount code";
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

  // Calculate add-ons cost
  useEffect(() => {
    const rentalDays = basePriceCalc?.totalDays || 1;
    const cost = selectedAddOns.reduce((total, item) => {
      const addon = addOns.find((a) => a._id === item.addOn);
      if (!addon) return total;
      if (addon.pricingType === "flat") {
        const amount = addon.flatPrice?.amount || 0;
        const isPerDay = addon.flatPrice?.isPerDay || false;
        const price =
          (isPerDay ? amount * (basePriceCalc?.totalDays || 1) : amount) *
          item.quantity;
        return total + price;
      } else {
        const tierIndex = item.selectedTierIndex ?? 0;
        const tier = addon.tieredPrice?.tiers?.[tierIndex];
        if (tier) {
          const isPerDay = addon.tieredPrice?.isPerDay || false;
          const price =
            (isPerDay
              ? tier.price * (basePriceCalc?.totalDays || 1)
              : tier.price) * item.quantity;
          return total + price;
        }
        return total;
      }
    }, 0);
    setAddOnsCost(cost);
  }, [selectedAddOns, basePriceCalc, addOns]);

  const pickupTimeSlots = useMemo(() => {
    if (!formData.office || !dateRange[0].startDate) return [];
    const office = offices.find((o) => o._id === formData.office);
    if (!office) return [];

    const date = dateRange[0].startDate;
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

        if (workingDay.pickupExtension) {
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
  }, [formData.office, dateRange, offices]);

  const returnTimeSlots = useMemo(() => {
    if (!formData.office || !dateRange[0].endDate) return [];
    const office = offices.find((o) => o._id === formData.office);
    if (!office) return [];

    const date = dateRange[0].endDate;
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

        if (workingDay.returnExtension) {
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
  }, [formData.office, dateRange, offices]);

  useEffect(() => {
    if (formData.office && dateRange[0].startDate) {
      const date = dateRange[0].startDate;
      const startDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      setStartDateReservedSlots([]);
      fetch(
        `/api/reservations/by-office?office=${formData.office}&startDate=${startDate}&type=start`
      )
        .then((res) => res.json())
        .then((data) => {
          setStartDateReservedSlots(data.data?.reservedSlots || []);
        })
        .catch((err) => console.error(err));
    }
  }, [formData.office, dateRange]);

  useEffect(() => {
    if (formData.office && dateRange[0].endDate) {
      const date = dateRange[0].endDate;
      const endDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      setEndDateReservedSlots([]);
      fetch(
        `/api/reservations/by-office?office=${formData.office}&endDate=${endDate}&type=end`
      )
        .then((res) => res.json())
        .then((data) => {
          setEndDateReservedSlots(data.data?.reservedSlots || []);
        })
        .catch((err) => console.error(err));
    }
  }, [formData.office, dateRange]);

  // Check if user is logged in and load URL params
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const userData = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        lastName: userData.lastName || "",
        email: userData.emaildata?.emailAddress || "",
        phone: userData.phoneData?.phoneNumber || "",
      }));
      setStep("details");
    }

    const stored = sessionStorage.getItem("rentalDetails");
    if (stored) {
      const details = JSON.parse(stored);
      setFormData((prev) => ({
        ...prev,
        pickupDate: details.pickupDate || "",
        returnDate: details.returnDate || "",
        notes: details.message || "",
        office: details.office || "",
      }));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const ageParam = urlParams.get("age");
    const officeParam = urlParams.get("office");

    if (ageParam) {
      setFormData((prev) => ({ ...prev, driverAge: parseInt(ageParam) || 25 }));
    }
    if (officeParam) {
      setFormData((prev) => ({ ...prev, office: officeParam }));
    }
  }, []);

  // Lock body scroll when panel opens
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Validate dates
  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      if (returnDate <= pickup) {
        setErrors((prev) => ({
          ...prev,
          returnDate: "Return date must be after pickup date",
        }));
      } else {
        setErrors((prev) => ({ ...prev, returnDate: "" }));
      }
    }
  }, [formData.pickupDate, formData.returnDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSendCode = async () => {
    if (!formData.phone.trim()) {
      setErrors({ phone: "Phone number required" });
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
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setFormData((prev) => ({
          ...prev,
          name: data.data.user.name,
          lastName: data.data.user.lastName,
          email: data.data.user.emaildata?.emailAddress || "",
        }));
        setStep("details");
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
          phoneNumber: `+44${formData.phone}`,
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
      setStep("details");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.office) newErrors.office = "Office is required";
    if (!formData.pickupDate) newErrors.pickupDate = "Pickup date is required";
    if (!formData.returnDate) newErrors.returnDate = "Return date is required";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null;

      if (!token || !user) {
        setErrors({ submit: "Please login first" });
        setStep("auth");
        return;
      }

      const pickupDateTime = new Date(
        `${formData.pickupDate}T${formData.pickupTime}:00`
      );
      const returnDateTime = new Date(
        `${formData.returnDate}T${formData.returnTime}:00`
      );

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
          startDate: pickupDateTime,
          endDate: returnDateTime,
          totalPrice: priceCalc?.totalPrice || 0,
          driverAge: formData.driverAge || 25,
          messege: formData.notes,
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

      if (isNewUser) {
        setTimeout(() => {
          window.location.href = "/customerDashboard?uploadLicense=true";
        }, 2000);
      } else {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log("Reservation error:", error);
      setErrors({ submit: message || "Failed to create reservation" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedOffice = () => {
    return offices.find((o) => o._id === formData.office);
  };

  const isDateDisabled = (date: Date) => {
    const office = getSelectedOffice();
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
      (sd) => sd.month === month && sd.day === day
    );
    if (specialDay && !specialDay.isOpen) return true;

    const workingDay = office.workingTime?.find((w) => w.day === dayName);
    if (workingDay && !workingDay.isOpen) return true;

    return false;
  };

  if (isSuccess) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999"
          onClick={onClose}
        />
        <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-linear-to-br from-[#0f172b] to-[#1e293b] z-10000 flex items-center justify-center animate-in slide-in-from-right duration-300">
          <div className="text-center p-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <FiCheckCircle className="text-5xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Booking Confirmed!
            </h3>
            <p className="text-gray-400">
              {isNewUser
                ? "Please upload your license in the dashboard to finalize your request."
                : "We'll send you a confirmation email shortly."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen z-10000 w-full sm:max-w-lg bg-linear-to-br from-[#0f172b] to-[#1e293b] border-l border-white/10 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-[#0f172b] to-[#1e293b] backdrop-blur-xl border-b border-white/10 p-6 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-white">Complete Booking</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all hover:rotate-90 duration-300"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Fill in your details to reserve this van
          </p>
        </div>

        {/* Van Summary Card */}
        <div className="m-6 p-4 rounded-2xl bg-linear-to-br from-[#fe9a00]/10 to-[#fe9a00]/5 border border-[#fe9a00]/20 backdrop-blur-sm">
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 shrink-0 overflow-hidden">
              <Image
                src={van.image}
                alt={van.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-base line-clamp-2 mb-1">
                {van.name}
              </h3>
              <div className="flex items-baseline gap-2 ">
                {(van as any).selloffer && (van as any).selloffer > 0 ? (
                  <>
                    <span className="text-gray-500 font-semibold text-sm line-through">
                      £{(van as any).showPrice || 0}
                    </span>
                    <span className="text-[#fe9a00] font-black text-2xl">
                      £
                      {(
                        ((van as any).showPrice || 0) *
                        (1 - (van as any).selloffer / 100)
                      ).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-[#fe9a00] font-black text-2xl">
                    £{(van as any).showPrice || 0}
                  </span>
                )}
              </div>
              {(van as any).selloffer && (van as any).selloffer > 0 && (
                <span className="inline-block px-2 py-0.5 bg-[#fe9a00] text-slate-900 text-[10px] font-bold rounded">
                  {(van as any).selloffer}% OFF
                </span>
              )}
              <p className="text-gray-400 text-xs">from</p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
              <FiPackage className="text-[#fe9a00] mx-auto mb-1 text-sm" />
              <p className="text-white font-semibold text-xs">{van.doors}</p>
              <p className="text-gray-400 text-[10px]">doors</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
              <BsFuelPump className="text-[#fe9a00] mx-auto mb-1 text-sm" />
              <p className="text-white font-semibold text-xs">{van.fuel}</p>
              <p className="text-gray-400 text-[10px]">Fuel</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
              <FiUsers className="text-[#fe9a00] mx-auto mb-1 text-sm" />
              <p className="text-white font-semibold text-xs">{van.seats}</p>
              <p className="text-gray-400 text-[10px]">Seats</p>
            </div>
          </div>
        </div>

        {/* Auth Step */}
        {step === "auth" && (
          <div className="px-6 pb-6 space-y-5">
            <div className="text-center mb-4">
              <h3 className="text-white font-bold text-lg mb-2">
                Login or Sign Up
              </h3>
              <p className="text-gray-400 text-sm">
                Verify your phone to continue
              </p>
            </div>

            {authStep === "phone" && (
              <div>
                <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                  <FiPhone className="text-[#fe9a00]" />
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 font-medium">
                    +44
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, phone: digits }));
                    }}
                    className={`w-full bg-white/5 border ${
                      errors.phone ? "border-red-500" : "border-white/10"
                    } rounded-xl pl-14 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                    placeholder="7400123456"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
                <button
                  type="button"
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
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  maxLength={6}
                  className={`w-full bg-white/5 border ${
                    errors.code ? "border-red-500" : "border-white/10"
                  } rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                  placeholder="000000"
                />
                {errors.code && (
                  <p className="text-red-400 text-xs mt-1 text-center">
                    {errors.code}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-[#fe9a00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </button>
                <button
                  type="button"
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border ${
                      errors.name ? "border-red-500" : "border-white/10"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                    placeholder="John"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiUser className="text-[#fe9a00]" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border ${
                      errors.lastName ? "border-red-500" : "border-white/10"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border ${
                      errors.email ? "border-red-500" : "border-white/10"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <button
                  type="button"
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

        {/* Form */}
        {step === "details" && (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#fe9a00]/20 flex items-center justify-center text-[#fe9a00] text-xs font-bold">
                  1
                </div>
                Personal Information
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="  text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiUser className="text-[#fe9a00]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border ${
                      errors.name ? "border-red-500" : "border-white/10"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle className="text-xs" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="  text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiMail className="text-[#fe9a00]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border ${
                      errors.email ? "border-red-500" : "border-white/10"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle className="text-xs" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="  text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiPhone className="text-[#fe9a00]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border ${
                      errors.phone ? "border-red-500" : "border-white/10"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                    placeholder="+44 123 456 7890"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle className="text-xs" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Rental Details Section */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#fe9a00]/20 flex items-center justify-center text-[#fe9a00] text-xs font-bold">
                  2
                </div>
                Rental Details
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiMapPin className="text-[#fe9a00]" />
                    Office Location
                  </label>
                  <CustomSelect
                    options={offices}
                    value={formData.office}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, office: value }))
                    }
                    placeholder="Select office"
                  />
                  {errors.office && (
                    <p className="text-red-400 text-xs mt-1">{errors.office}</p>
                  )}
                </div>

                <div>
                  <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiCalendar className="text-[#fe9a00]" />
                    Pickup & Return Dates
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDateRange(!showDateRange)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-left focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all"
                    >
                      {dateRange[0].startDate && dateRange[0].endDate
                        ? `${format(
                            dateRange[0].startDate,
                            "MMM dd"
                          )} - ${format(dateRange[0].endDate, "MMM dd, yyyy")}`
                        : "Select dates"}
                    </button>
                    {showDateRange && (
                      <div className="absolute z-50 mt-2 bg-slate-800 border border-white/20 rounded-xl p-4 shadow-2xl">
                        <DateRange
                          ranges={dateRange}
                          onChange={(item) => {
                            setDateRange([item.selection]);
                            setFormData((prev) => ({
                              ...prev,
                              pickupDate: format(
                                item.selection.startDate!,
                                "yyyy-MM-dd"
                              ),
                              returnDate: format(
                                item.selection.endDate!,
                                "yyyy-MM-dd"
                              ),
                            }));
                          }}
                          minDate={new Date()}
                          rangeColors={["#fe9a00"]}
                          disabledDates={
                            formData.office
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
                          className="w-full mt-3 px-4 py-2 bg-[#fe9a00] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                      <FiClock className="text-[#fe9a00]" />
                      Pickup Time
                    </label>
                    {dateRange[0].startDate &&
                      (() => {
                        const office = getSelectedOffice();
                        const date = dateRange[0].startDate;
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
                              end: pickupTimeSlots[pickupTimeSlots.length - 1],
                              normalStart: workingDay.startTime || "00:00",
                              normalEnd: workingDay.endTime || "23:59",
                              price: workingDay.pickupExtension.flatPrice,
                            }
                          : undefined;
                        return (
                          <TimeSelect
                            value={formData.pickupTime}
                            onChange={(time) =>
                              setFormData((prev) => ({
                                ...prev,
                                pickupTime: time,
                              }))
                            }
                            slots={pickupTimeSlots}
                            reservedSlots={startDateReservedSlots}
                            selectedDate={dateRange[0].startDate}
                            isStartTime={true}
                            extensionTimes={extensionTimes}
                          />
                        );
                      })()}
                  </div>
                  <div>
                    <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                      <FiClock className="text-[#fe9a00]" />
                      Return Time
                    </label>
                    {dateRange[0].endDate &&
                      (() => {
                        const office = getSelectedOffice();
                        const date = dateRange[0].endDate;
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
                              end: returnTimeSlots[returnTimeSlots.length - 1],
                              normalStart: workingDay.startTime || "00:00",
                              normalEnd: workingDay.endTime || "23:59",
                              price: workingDay.returnExtension.flatPrice,
                            }
                          : undefined;
                        return (
                          <TimeSelect
                            value={formData.returnTime}
                            onChange={(time) =>
                              setFormData((prev) => ({
                                ...prev,
                                returnTime: time,
                              }))
                            }
                            slots={returnTimeSlots}
                            reservedSlots={endDateReservedSlots}
                            selectedDate={dateRange[0].endDate}
                            isStartTime={false}
                            extensionTimes={extensionTimes}
                          />
                        );
                      })()}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiUser className="text-[#fe9a00]" />
                    Driver Age
                  </label>
                  <input
                    type="number"
                    name="driverAge"
                    value={formData.driverAge}
                    onChange={handleChange}
                    placeholder="25-70"
                    min="25"
                    max="70"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="  text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiMessageSquare className="text-[#fe9a00]" />
                    Additional Notes{" "}
                    <span className="text-gray-500 text-xs font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all resize-none"
                    placeholder="Any special requirements or questions?"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Gear Selection */}
            {(van as any)?.gear?.availableTypes?.length > 1 && (
              <div>
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#fe9a00]/20 flex items-center justify-center text-[#fe9a00] text-xs font-bold">
                    3
                  </div>
                  Gear Type
                </h3>
                <div className="flex gap-2">
                  {(van as any).gear.availableTypes.includes("manual") && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gearType: "manual" }))
                      }
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        formData.gearType === "manual"
                          ? "bg-[#fe9a00] text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      Manual
                    </button>
                  )}
                  {(van as any).gear.availableTypes.includes("automatic") && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          gearType: "automatic",
                        }))
                      }
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        formData.gearType === "automatic"
                          ? "bg-[#fe9a00] text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <div>Automatic</div>
                      {(van as any)?.gear?.automaticExtraCost > 0 && (
                        <div className="text-xs mt-0.5">
                          +£{(van as any).gear.automaticExtraCost}/day
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Add-ons Section */}
            {addOns.length > 0 &&
              dateRange[0].startDate &&
              dateRange[0].endDate && (
                <div>
                  <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#fe9a00]/20 flex items-center justify-center text-[#fe9a00] text-xs font-bold">
                      {(van as any)?.gear?.availableTypes?.length > 1
                        ? "4"
                        : "3"}
                    </div>
                    Add-ons
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddOnsModal(true)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#fe9a00]/50 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-white font-semibold text-sm">
                          {selectedAddOns.length === 0
                            ? "Select Add-ons"
                            : `${selectedAddOns.length} Add-on${
                                selectedAddOns.length > 1 ? "s" : ""
                              } Selected`}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {selectedAddOns.length === 0
                            ? "Enhance your rental experience"
                            : `Total: £${addOnsCost}`}
                        </p>
                      </div>
                      <FiPackage className="text-[#fe9a00] text-xl group-hover:scale-110 transition-transform" />
                    </div>
                  </button>
                </div>
              )}

            {/* Divider */}
            {addOns.length > 0 &&
              dateRange[0].startDate &&
              dateRange[0].endDate && (
                <div className="border-t border-white/10"></div>
              )}

            {/* Discount Code Section */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#fe9a00]/20 flex items-center justify-center text-[#fe9a00] text-xs font-bold">
                  {addOns.length > 0 &&
                  formData.pickupDate &&
                  formData.returnDate
                    ? (van as any)?.gear?.availableTypes?.length > 1
                      ? "5"
                      : "4"
                    : (van as any)?.gear?.availableTypes?.length > 1
                    ? "4"
                    : "3"}
                </div>
                Discount Code
              </h3>
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
                      placeholder="Enter discount code"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount || !discountCode.trim()}
                      className="px-6 py-3 bg-[#fe9a00] hover:bg-orange-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApplyingDiscount ? "..." : "Apply"}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <FiAlertCircle className="text-xs" />
                      {discountError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-bold">
                        {appliedDiscount.code}
                      </p>
                      <p className="text-green-300 text-xs mt-1">
                        {appliedDiscount.percentage}% discount applied
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Cost Summary */}
            <div className="bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-4 space-y-3">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#fe9a00]/20 flex items-center justify-center text-[#fe9a00] text-xs font-bold">
                  {addOns.length > 0 &&
                  formData.pickupDate &&
                  formData.returnDate
                    ? (van as any)?.gear?.availableTypes?.length > 1
                      ? "5"
                      : "4"
                    : (van as any)?.gear?.availableTypes?.length > 1
                    ? "4"
                    : "3"}
                </div>
                Cost Summary
              </h3>

              <div className="space-y-2 text-sm">
                {priceCalc && (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-gray-400">Rental charges</span>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {priceCalc.totalDays} days x £{priceCalc.pricePerDay}
                          {priceCalc.extraHours > 0 &&
                            ` + ${priceCalc.extraHours}h x £${priceCalc.extraHoursRate}`}
                        </div>
                      </div>
                      <span className="text-white font-semibold">
                        £
                        {(
                          priceCalc.totalDays * priceCalc.pricePerDay +
                          priceCalc.extraHours * priceCalc.extraHoursRate
                        ).toFixed(2)}
                      </span>
                    </div>
                    {formData.gearType === "automatic" &&
                      (van as any)?.gear?.automaticExtraCost > 0 && (
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-400">
                              Automatic gear
                            </span>
                            <div className="text-gray-500 text-xs mt-0.5">
                              {priceCalc.totalDays} days x £
                              {(van as any).gear.automaticExtraCost}
                            </div>
                          </div>
                          <span className="text-white font-semibold">
                            £
                            {(
                              (van as any).gear.automaticExtraCost *
                              priceCalc.totalDays
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                    {pickupExtensionPrice > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Pickup Extension</span>
                        <span className="text-white font-semibold">
                          £{pickupExtensionPrice}
                        </span>
                      </div>
                    )}
                    {returnExtensionPrice > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Return Extension</span>
                        <span className="text-white font-semibold">
                          £{returnExtensionPrice}
                        </span>
                      </div>
                    )}
                    {selectedAddOns.map((item) => {
                      const addon = addOns.find((a) => a._id === item.addOn);
                      if (!addon) return null;
                      let price = 0;
                      if (addon.pricingType === "flat") {
                        const amount = addon.flatPrice?.amount || 0;
                        const isPerDay = addon.flatPrice?.isPerDay || false;
                        price =
                          (isPerDay ? amount * priceCalc.totalDays : amount) *
                          item.quantity;
                      } else if (
                        item.selectedTierIndex !== undefined &&
                        addon.tieredPrice?.tiers?.[item.selectedTierIndex]
                      ) {
                        const tier =
                          addon.tieredPrice.tiers[item.selectedTierIndex];
                        const isPerDay = addon.tieredPrice.isPerDay || false;
                        price =
                          (isPerDay
                            ? tier.price * priceCalc.totalDays
                            : tier.price) * item.quantity;
                      }
                      return (
                        <div
                          key={item.addOn}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-400">
                            {addon.name}
                            {item.quantity > 1 && ` x ${item.quantity}`}
                          </span>
                          <span className="text-white font-semibold">
                            £{price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                    {appliedDiscount && (
                      <div className="flex justify-between items-center text-green-400">
                        <span className="font-semibold">
                          Discount ({appliedDiscount.percentage}%)
                        </span>
                        <span className="font-semibold">
                          -£{(priceCalc as any).discountAmount?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-[#fe9a00]/20 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">
                          Total Price
                        </span>
                        <span className="text-[#fe9a00] font-black text-xl">
                          £{priceCalc.totalPrice}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {!priceCalc && (
                  <div className="text-center text-gray-400 py-4">
                    Select dates and times to see pricing
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
                <p className="text-blue-300 text-xs flex items-start gap-2">
                  <FiInfo className="text-sm mt-0.5 shrink-0" />
                  <span>
                    Security deposit is fully refundable upon return of the van
                    in good condition
                  </span>
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-[#fe9a00] checked:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all cursor-pointer"
                />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-[#fe9a00] hover:underline font-semibold"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-[#fe9a00] hover:underline font-semibold"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1 ml-8">
                  <FiAlertCircle className="text-xs" />
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-linear-to-r from-[#fe9a00] to-[#ff8800] hover:from-[#ff8800] hover:to-[#fe9a00] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="text-xl" />
                    Confirm Reservation
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
              <div className="flex items-center gap-1">
                <FiCheckCircle className="text-green-500" />
                <span>Secure Booking</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <FiCheckCircle className="text-green-500" />
                <span>Instant Confirmation</span>
              </div>
            </div>
          </form>
        )}

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
      </div>
    </>
  );
}

function CategoryCard({
  category,
  onView,
  onDetails,
}: {
  category: Category;
  onView: () => void;
  onDetails: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Optional: reset to start
    }
  };

  return (
    <div
      className="group relative h-125 rounded-3xl overflow-hidden cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Layer: Image + Video */}
      <div className="absolute inset-0">
        {/* Static Image (visible initially & fallback) */}
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
            unoptimized
            priority
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#fe9a00]/20 to-[#fe9a00]/5" />
        )}

        {/* {category.videoUrl && ( // ← Add videoUrl to your VanData type */}
        <video
          ref={videoRef}
          src={"/assets/videos/eeeee.mp4"}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-110"
        />
        {/* )} */}

        {/* Enhanced linear Overlay for Readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/50 group-hover:from-black/20 group-hover:via-black/5 group-hover:to-black/20 transition-all duration-700" />

        {/* Subtle Vignette + Glow Effect */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 ring-2 ring-[#fe9a00]/0 group-hover:ring-[#fe9a00]/30 transition-all duration-500 rounded-3xl pointer-events-none" />
      </div>

      {/* Content Layer */}
      <div className="relative h-full flex flex-col p-6 justify-between text-white z-10">
        <div>
          <h3 className="text-2xl font-black leading-tight mb-2 drop-shadow-lg">
            {category.name}
          </h3>
          <p className="text-gray-200 text-sm font-medium mb-5 drop-shadow-md">
            {category.expert}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center gap-2 shadow-sm">
              <FiUsers className="text-[#fe9a00] text-sm" />
              <span className="text-xs font-bold">{category.seats} seats</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center gap-2 shadow-sm">
              <BsFuelPump className="text-[#fe9a00] text-sm" />
              <span className="text-xs font-bold">{category.fuel}</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center gap-2 shadow-sm">
              <FiPackage className="text-[#fe9a00] text-sm" />
              <span className="text-xs font-bold">{category.doors} doors</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Van Dimensions Link */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetails();
            }}
            className="flex items-center gap-2 text-[#fe9a00] font-bold text-sm hover:gap-3 transition-all duration-300"
          >
            <span>Van Dimensions</span>
            <IoIosArrowForward className="text-lg" />
          </button>

          {/* Price + Book Button */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-300 text-sm">from</p>
              {(category as any).selloffer > 0 ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-medium text-gray-400 line-through">
                      £{(category as any).showPrice}
                    </span>
                    <span className="text-3xl font-black">
                      £
                      {(
                        (category as any).showPrice *
                        (1 - (category as any).selloffer / 100)
                      ).toFixed(2)}
                      <span className="text-gray-300 text-sm font-normal ml-1">
                        /day
                      </span>
                    </span>
                  </div>
                  <span className="inline-block mt-1 px-3 py-1 bg-[#fe9a00] text-black text-xs font-bold rounded-full">
                    {(category as any).selloffer}% OFF
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-black">
                  £{(category as any).showPrice}
                  <span className="text-gray-300 text-sm font-normal ml-1">
                    /day
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="px-7 py-3 bg-linear-to-r from-[#fe9a00] to-[#ff8800] hover:from-[#ff8800] hover:to-[#fe9a00] text-black font-bold rounded-xl shadow-lg hover:shadow-[#fe9a00]/50 transform hover:scale-105 transition-all duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryDetailsModal({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"dimensions" | "purpose">(
    "dimensions"
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-9999">
        <div className="bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-2xl border border-white/10 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in z-9999 zoom-in duration-300">
          {/* Content */}
          <div className="p-7  w-full z-50">
            {/* Tabs */}
            <div className="flex justify-between items- w-full gap-3 border-b border-white/10 mb-1 overflow-hidden">
              <button
                onClick={() => setActiveTab("dimensions")}
                className={`px-4 py-3 font-semibold rounded-lg w-full transition-all relative ${
                  activeTab === "dimensions"
                    ? "text-gray-100 bg-[#fe9a00] hover:text-white"
                    : "text-white bg-black/50"
                }`}
              >
                Dimensions
              </button>
              <button
                onClick={() => setActiveTab("purpose")}
                className={`px-4 py-3 font-semibold w-full rounded-lg transition-all relative ${
                  activeTab === "purpose"
                    ? "text-gray-100 bg-[#fe9a00] hover:text-white"
                    : "text-white bg-black/50"
                }`}
              >
                Purpose
              </button>
            </div>

            {/* Dimensions Tab */}
            {activeTab === "dimensions" && (
              <div className="space-y-1 mb-1 grid grid-cols-2 gap-2">
                {category.properties && category.properties.length > 0 ? (
                  category.properties.map((prop, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-linear-to-r from-white/5 to-white/0 rounded-lg border border-white/10 hover:border-[#fe9a00]/50 hover:bg-linear-to-r hover:from-[#fe9a00]/10 hover:to-white/0 transition-all group"
                    >
                      <span className="text-gray-300 text-xs font-semibold group-hover:text-white transition-colors">
                        {prop.key}
                      </span>
                      <span className="text-[#fe9a00] text-[12px] font-bold text-right">
                        {prop.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No dimensions available
                  </p>
                )}
              </div>
            )}

            {/* Purpose Tab */}
            {activeTab === "purpose" && (
              <div className="space-y-4">
                {category.purpose ? (
                  <div className="p-5 bg-linear-to-br from-[#fe9a00]/15 to-[#fe9a00]/5 border border-[#fe9a00]/30 rounded-lg">
                    <p className="text-white whitespace-break-spaces leading-relaxed text-base">
                      {category.purpose}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No purpose information available
                  </p>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-linear-to-r from-[#fe9a00] to-[#ff9f1c] hover:from-[#ff9f1c] hover:to-[#fe9a00] text-black font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#fe9a00]/50 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const SkeletonCard = () => (
  <div className="group relative h-120 rounded-3xl overflow-hidden bg-gray-800/30 animate-pulse">
    {/* Image/linear fallback + Overlay */}
    <div className="absolute inset-0">
      <div className="w-full h-full bg-linear-to-br rounded-3xl from-[#fe9a00]/20 via-[#fe9a00]/10 to-[#fe9a00]/5"></div>
      <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-black/60 via-transparent/50 to-black/80"></div>
    </div>

    {/* Content */}
    <div className="relative h-full flex flex-col p-6 justify-between">
      <div>
        {/* Title */}
        <div className="h-7 bg-linear-to-r from-gray-600/70 to-gray-500/70 rounded-md w-64 mb-2"></div>
        {/* Expert */}
        <div className="h-5 bg-gray-600/50 rounded w-32 mb-6"></div>
        {/* Badges */}
        <div className="flex gap-1">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5 animate-pulse"
              >
                <div className="h-3 w-3 bg-[#fe9a00]/50 rounded-full"></div>
                <div className="h-3 bg-gray-500/50 rounded-full w-16"></div>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-3">
        {/* Dimensions button */}
        <div className="h-6 bg-gray-600/50 border-b-2 border-white/20 rounded-sm w-32"></div>
        {/* Price + Book button */}
        <div className="flex items-end justify-between gap-3">
          <div>
            {/* "from" */}
            {/* Price with strike + discounted + %OFF */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <div className="h-10 bg-linear-to-r from-gray-500 to-gray-400 rounded w-20"></div>{" "}
                {/* Main price */}
              </div>
            </div>
          </div>
          {/* Book Now button */}
          <div className="h-11 w-24 bg-gray-600/50 border-2 border-white/20 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);
