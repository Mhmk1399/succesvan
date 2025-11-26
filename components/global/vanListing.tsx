"use client";

import { useState, useRef, useEffect } from "react";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Van data type
export interface VanData {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  priceUnit: string;
  seats: number;
  transmission: "Manual" | "Automatic";
  fuelType: string;
  cargo: string;
  doors: number;
  features: string[];
  popular?: boolean;
  available: boolean;
  deposit: number;
  mileage: string;
}

// Sample van data
export const vansData: VanData[] = [
  {
    id: 1,
    name: "Small Van - Ford Transit Custom",
    category: "Small Van",
    image: "/assets/images/van3.png",
    price: 45,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "6m³",
    doors: 3,
    features: [
      "Bluetooth",
      "Air Conditioning",
      "Parking Sensors",
      "USB Charging",
    ],
    popular: false,
    available: true,
    deposit: 200,
    mileage: "Unlimited",
  },
  {
    id: 2,
    name: "Medium Van - Mercedes Sprinter",
    category: "Medium Van",
    image: "/assets/images/van.png",
    price: 65,
    priceUnit: "per day",
    seats: 3,
    transmission: "Automatic",
    fuelType: "Diesel",
    cargo: "10m³",
    doors: 4,
    features: [
      "Cruise Control",
      "Air Conditioning",
      "Reversing Camera",
      "Bluetooth",
      "Sat Nav",
    ],
    popular: true,
    available: true,
    deposit: 300,
    mileage: "Unlimited",
  },
  {
    id: 3,
    name: "Large Van - Luton with Tail Lift",
    category: "Large Van",
    image: "/assets/images/van.png",
    price: 85,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "18m³",
    doors: 3,
    features: [
      "Tail Lift",
      "Air Conditioning",
      "Parking Sensors",
      "Extra Storage",
      "Heavy Duty",
    ],
    popular: true,
    available: true,
    deposit: 400,
    mileage: "Unlimited",
  },
  {
    id: 4,
    name: "Extra Large Van - Luton Box Van",
    category: "Extra Large",
    image: "/assets/images/van.png",
    price: 95,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "22m³",
    doors: 3,
    features: [
      "Tail Lift",
      "Long Wheelbase",
      "High Roof",
      "Air Conditioning",
      "Extra Secure",
    ],
    popular: false,
    available: true,
    deposit: 500,
    mileage: "Unlimited",
  },
  {
    id: 5,
    name: "Refrigerated Van - Temperature Controlled",
    category: "Specialist",
    image: "/assets/images/van.png",
    price: 110,
    priceUnit: "per day",
    seats: 3,
    transmission: "Automatic",
    fuelType: "Diesel",
    cargo: "12m³",
    doors: 4,
    features: [
      "Temperature Control",
      "Insulated",
      "Digital Display",
      "Air Conditioning",
      "Bluetooth",
    ],
    popular: false,
    available: true,
    deposit: 400,
    mileage: "Unlimited",
  },
  {
    id: 6,
    name: "Tipper Van - Construction Ready",
    category: "Specialist",
    image: "/assets/images/van.png",
    price: 75,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "8m³",
    doors: 3,
    features: [
      "Hydraulic Tipper",
      "Heavy Duty",
      "Cage Sides",
      "Tow Bar",
      "Construction Spec",
    ],
    popular: false,
    available: true,
    deposit: 350,
    mileage: "Unlimited",
  },
];

interface VanListingProps {
  vans?: VanData[];
  showFilters?: boolean;
}

export default function VanListing({
  vans = vansData,
  showFilters = true,
}: VanListingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [filteredVans, setFilteredVans] = useState(vans);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-low");
  const [selectedVan, setSelectedVan] = useState<VanData | null>(null);

  useEffect(() => {
    let filtered = [...vans];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((van) => van.category === selectedCategory);
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "capacity") {
      filtered.sort((a, b) => parseFloat(b.cargo) - parseFloat(a.cargo));
    }

    setFilteredVans(filtered);
  }, [selectedCategory, sortBy, vans]);

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
  }, [filteredVans]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0f172b] py-20">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
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

        {/* Vans Grid */}
        {filteredVans.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredVans.map((van, index) => (
              <div
                key={van.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <VanCard van={van} onBook={() => setSelectedVan(van)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <FiInfo className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No vans found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("price-low");
              }}
              className="px-6 py-3 rounded-xl bg-[#fe9a00] text-white font-bold hover:scale-105 transition-transform duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Reservation Panel */}
      {selectedVan && (
        <ReservationPanel
          van={selectedVan}
          onClose={() => setSelectedVan(null)}
        />
      )}
    </section>
  );
}

function ReservationPanel({
  van,
  onClose,
}: {
  van: VanData;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    notes: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rentalDays, setRentalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Lock body scroll when panel opens
  useEffect(() => {
    // Store original body overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Lock scroll
    document.body.style.overflow = "hidden";

    // Cleanup function to restore scroll
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Calculate rental days and total cost
  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const diffTime = returnDate.getTime() - pickup.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setRentalDays(diffDays);
        setTotalCost(diffDays * van.price);
        setErrors((prev) => ({ ...prev, returnDate: "" }));
      } else {
        setRentalDays(0);
        setTotalCost(0);
        setErrors((prev) => ({
          ...prev,
          returnDate: "Return date must be after pickup date",
        }));
      }
    } else {
      setRentalDays(0);
      setTotalCost(0);
    }
  }, [formData.pickupDate, formData.returnDate, van.price]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.pickupDate) newErrors.pickupDate = "Pickup date is required";
    if (!formData.returnDate) newErrors.returnDate = "Return date is required";
    if (!formData.pickupLocation.trim())
      newErrors.pickupLocation = "Pickup location is required";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Reservation:", { van, ...formData, rentalDays, totalCost });

    setIsSubmitting(false);
    setIsSuccess(true);

    // Close after showing success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  if (isSuccess) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-linear-to-br from-[#0f172b] to-[#1e293b] z-50 flex items-center justify-center animate-in slide-in-from-right duration-300">
          <div className="text-center p-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <FiCheckCircle className="text-5xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Booking Confirmed!
            </h3>
            <p className="text-gray-400">
              We'll send you a confirmation email shortly.
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-99999 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full sm:max-w-md bg-linear-to-br from-[#0f172b] to-[#1e293b] border-l border-white/10 z-99999 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
              <div className="flex items-baseline gap-2">
                <span className="text-[#fe9a00] font-black text-2xl">
                  £{van.price}
                </span>
                <span className="text-gray-400 text-xs">per day</span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
              <FiPackage className="text-[#fe9a00] mx-auto mb-1 text-sm" />
              <p className="text-white font-semibold text-xs">{van.cargo}</p>
              <p className="text-gray-400 text-[10px]">Cargo</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
              <BsFuelPump className="text-[#fe9a00] mx-auto mb-1 text-sm" />
              <p className="text-white font-semibold text-xs">{van.fuelType}</p>
              <p className="text-gray-400 text-[10px]">Fuel</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
              <FiUsers className="text-[#fe9a00] mx-auto mb-1 text-sm" />
              <p className="text-white font-semibold text-xs">{van.seats}</p>
              <p className="text-gray-400 text-[10px]">Seats</p>
            </div>
          </div>
        </div>

        {/* Form */}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="  text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiCalendar className="text-[#fe9a00]" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={today}
                    className={`w-full bg-white/5 border ${
                      errors.pickupDate ? "border-red-500" : "border-white/10"
                    } rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all text-sm`}
                  />
                  {errors.pickupDate && (
                    <p className="text-red-400 text-[10px] mt-1">Required</p>
                  )}
                </div>
                <div>
                  <label className="  text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiCalendar className="text-[#fe9a00]" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    min={formData.pickupDate || today}
                    className={`w-full bg-white/5 border ${
                      errors.returnDate ? "border-red-500" : "border-white/10"
                    } rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all text-sm`}
                  />
                  {errors.returnDate && (
                    <p className="text-red-400 text-[10px] mt-1">
                      {errors.returnDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Rental Duration Display */}
              {rentalDays > 0 && (
                <div className="bg-linear-to-r from-[#fe9a00]/10 to-transparent border border-[#fe9a00]/20 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FiClock className="text-[#fe9a00]" />
                    <span className="text-white font-semibold">
                      Rental Duration:{" "}
                      <span className="text-[#fe9a00]">
                        {rentalDays} {rentalDays === 1 ? "day" : "days"}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="  text-white text-sm font-semibold mb-2 flex items-center gap-2">
                  <FiMapPin className="text-[#fe9a00]" />
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border ${
                    errors.pickupLocation ? "border-red-500" : "border-white/10"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all`}
                  placeholder="London, UK"
                />
                {errors.pickupLocation && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="text-xs" />
                    {errors.pickupLocation}
                  </p>
                )}
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

          {/* Cost Summary */}
          <div className="bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#fe9a00]/20 flex items-center justify-center text-[#fe9a00] text-xs font-bold">
                3
              </div>
              Cost Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Daily Rate</span>
                <span className="text-white font-semibold">£{van.price}</span>
              </div>
              {rentalDays > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-semibold">
                      {rentalDays} {rentalDays === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rental Total</span>
                      <span className="text-white font-semibold">
                        £{totalCost}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Security Deposit</span>
                <span className="text-white font-semibold">£{van.deposit}</span>
              </div>
              <div className="border-t border-[#fe9a00]/20 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total Due Today</span>
                  <span className="text-[#fe9a00] font-black text-xl">
                    £{totalCost > 0 ? totalCost + van.deposit : van.deposit}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
              <p className="text-blue-300 text-xs flex items-start gap-2">
                <FiInfo className="text-sm mt-0.5 shrink-0" />
                <span>
                  Security deposit is fully refundable upon return of the van in
                  good condition
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
      </div>
    </>
  );
}

function VanCard({ van, onBook }: { van: VanData; onBook: () => void }) {
  return (
    <div className="group relative h-[500px] rounded-3xl overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0">
        <Image
          src={van.image}
          alt={van.name}
          fill
          className="object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/95 transition-all duration-500"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col p-6 justify-between">
        {/* Top Section */}
        <div>
          <h3 className="text-xl font-black text-white line-clamp-1 leading-tight mb-1">
            {van.name}
          </h3>
          <p className="text-gray-300 text-sm font-medium mb-4">or similar</p>

          {/* Specs Badges */}
          <div className="flex gap-1 flex-wrap">
            <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1.5">
              <FiPackage className="text-[#fe9a00] text-xs" />
              <span className="text-white text-xs font-semibold">
                {van.cargo}
              </span>
            </div>
            <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1.5">
              <BsFuelPump className="text-[#fe9a00] text-xs" />
              <span className="text-white text-xs font-semibold">
                {van.fuelType}
              </span>
            </div>
            <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1.5">
              <FiUsers className="text-[#fe9a00] text-xs" />
              <span className="text-white text-xs font-semibold">
                {van.seats}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* Mileage */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <FiCheckCircle className="text-xs text-green-500" />
            <span className="text-gray-200">
              {van.mileage} kilometers included
            </span>
          </div>

          {/* Price & Button */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white">
                  £{van.price}
                </span>
                <span className="text-gray-300 text-xs font-semibold">
                  /{van.priceUnit}
                </span>
              </div>
              <div className="text-gray-400 text-xs mt-1">
                + £{van.deposit} deposit
              </div>
            </div>
            <button
              disabled={!van.available}
              onClick={onBook}
              className={`group/btn relative cursor-pointer border-2 rounded-md border-white/50 px-6 py-2.5 font-bold text-sm overflow-hidden transition-all duration-300 whitespace-nowrap ${
                van.available
                  ? "text-white hover:scale-105 shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="relative text-[#fe9a00] z-10">Book Now</span>
              {van.available && (
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
