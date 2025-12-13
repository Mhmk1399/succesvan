"use client";

import { useState, useEffect, useMemo } from "react";
import { FiX, FiMapPin, FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiCheckCircle, FiPackage, FiUsers } from "react-icons/fi";
import CustomSelect from "@/components/ui/CustomSelect";

import AddOnsModal from "./AddOnsModal";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { BsFuelPump } from "react-icons/bs";
import { generateTimeSlots, isTimeSlotAvailable } from "@/utils/timeSlots";

interface Office {
  _id: string;
  name: string;
  vehicles: any[];
}

interface Category {
  _id: string;
  name: string;
  image: string;
  pricingTiers: { minHours: number; maxHours: number; pricePerHour: number }[];
  deposit: number;
  seats: number;
  fuel: string;
  cargo: string;
}

interface AddOn {
  _id: string;
  name: string;
  description?: string;
  pricingType: "flat" | "tiered";
  flatPrice?: number;
  tiers?: { minDays: number; maxDays: number; price: number }[];
}

export default function ReservationModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [offices, setOffices] = useState<Office[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [reservedSlots, setReservedSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [officeHours, setOfficeHours] = useState<{ startTime: string; endTime: string } | null>(null);

  const [formData, setFormData] = useState({
    office: "",
    startDate: "",
    startTime: "10:00",
    endDate: "",
    endTime: "10:00",
    driverAge: 25,
    category: "",
    phone: "",
    code: "",
    name: "",
    lastName: "",
    email: "",
  });

  const [authStep, setAuthStep] = useState<"phone" | "code" | "register">("phone");
  const [selectedAddOns, setSelectedAddOns] = useState<{ addOn: string; quantity: number; selectedTierIndex?: number }[]>([]);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const availableStartTimes = useMemo(() => {
    if (!officeHours) return [];
    const allSlots = generateTimeSlots(officeHours.startTime, officeHours.endTime, 15);
    return allSlots.filter(slot => isTimeSlotAvailable(slot, reservedSlots));
  }, [officeHours, reservedSlots]);

  const availableEndTimes = useMemo(() => {
    if (!officeHours || !formData.startTime) return [];
    const allSlots = generateTimeSlots(formData.startTime, officeHours.endTime, 15);
    return allSlots.filter(slot => slot > formData.startTime && isTimeSlotAvailable(slot, reservedSlots));
  }, [officeHours, formData.startTime, reservedSlots]);

  const selectedCategory = categories.find(c => c._id === formData.category);
  const priceCalc = usePriceCalculation(
    formData.startDate ? `${formData.startDate}T${formData.startTime}` : "",
    formData.endDate ? `${formData.endDate}T${formData.endTime}` : "",
    selectedCategory?.pricingTiers || []
  );

  // Fetch offices
  useEffect(() => {
    fetch("/api/offices")
      .then(res => res.json())
      .then(data => setOffices(data.data || []))
      .catch(err => console.error(err));
  }, []);

  // Fetch categories when office selected
  useEffect(() => {
    if (formData.office) {
      fetch("/api/categories")
        .then(res => res.json())
        .then(data => {
          const allCategories = data.data || [];
          const office = offices.find(o => o._id === formData.office);
          
          if (office?.vehicles && office.vehicles.length > 0) {
            // Extract category IDs from office vehicles
            const officeCategoryIds = office.vehicles
              .map((v: any) => {
                if (typeof v === 'string') return v;
                if (v.vehicle) {
                  if (typeof v.vehicle === 'string') return v.vehicle;
                  if (v.vehicle.category) {
                    return typeof v.vehicle.category === 'string' ? v.vehicle.category : v.vehicle.category._id;
                  }
                  return v.vehicle._id;
                }
                if (v.category) return typeof v.category === 'string' ? v.category : v.category._id;
                return v._id;
              })
              .filter(Boolean);
            
            // Filter categories
            const filtered = allCategories.filter((cat: any) => 
              officeCategoryIds.includes(cat._id)
            );
            setCategories(filtered);
          } else {
            setCategories(allCategories);
          }
        })
        .catch(err => console.error(err));
    } else {
      setCategories([]);
    }
  }, [formData.office, offices]);

  // Fetch add-ons
  useEffect(() => {
    fetch("/api/addons")
      .then(res => res.json())
      .then(data => setAddOns(data.data || []))
      .catch(err => console.error(err));
  }, []);

  // Fetch office hours and reserved slots
  useEffect(() => {
    if (formData.office && formData.startDate) {
      Promise.all([
        fetch(`/api/offices/${formData.office}`).then(r => r.json()),
        fetch(`/api/reservations/by-office?office=${formData.office}&startDate=${formData.startDate}`).then(r => r.json())
      ]).then(([officeData, reservationData]) => {
        const office = officeData.data;
        const date = new Date(formData.startDate);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const workingDay = office?.workingTime?.find((wt: any) => wt.day === dayName && wt.isOpen);
        
        if (workingDay) {
          setOfficeHours({ startTime: workingDay.startTime, endTime: workingDay.endTime });
        }
        setReservedSlots(reservationData.data?.reservedSlots || []);
      }).catch(err => console.error(err));
    }
  }, [formData.office, formData.startDate]);

  // Load data from sessionStorage and user context
  useEffect(() => {
    const stored = sessionStorage.getItem("rentalDetails");
    let hasRentalData = false;
    
    if (stored) {
      const details = JSON.parse(stored);
      const pickupDate = details.pickupDate ? new Date(details.pickupDate) : null;
      const returnDate = details.returnDate ? new Date(details.returnDate) : null;
      
      setFormData(prev => ({
        ...prev,
        office: details.office || "",
        category: details.category || "",
        startDate: pickupDate ? pickupDate.toISOString().split('T')[0] : "",
        startTime: pickupDate ? pickupDate.toTimeString().slice(0, 5) : "10:00",
        endDate: returnDate ? returnDate.toISOString().split('T')[0] : "",
        endTime: returnDate ? returnDate.toTimeString().slice(0, 5) : "10:00",
        driverAge: details.driverAge || 25,
      }));
      hasRentalData = !!(details.office && details.pickupDate && details.returnDate && details.category);
    }

    if (user) {
      setFormData(prev => ({
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
  }, [user]);

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
        body: JSON.stringify({ action: "send-code", phoneNumber: formData.phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setAuthStep("code");
    } catch (error: any) {
      setErrors({ phone: error.message });
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
        body: JSON.stringify({ action: "verify", phoneNumber: formData.phone, code: formData.code }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      if (data.data.userExists) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setFormData(prev => ({
          ...prev,
          name: data.data.user.name,
          lastName: data.data.user.lastName,
          email: data.data.user.emaildata?.emailAddress || "",
        }));
        setStep(3);
      } else {
        setAuthStep("register");
      }
    } catch (error: any) {
      setErrors({ code: error.message });
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
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
      if (!token || !user) {
        setErrors({ submit: "Please login first" });
        setStep(2);
        return;
      }

      const addOnsCost = selectedAddOns.reduce((total, item) => {
        const addon = addOns.find(a => a._id === item.addOn);
        if (!addon) return total;
        if (addon.pricingType === "flat") {
          return total + (addon.flatPrice || 0) * item.quantity;
        } else {
          const tierIndex = item.selectedTierIndex ?? 0;
          const price = addon.tiers?.[tierIndex]?.price || 0;
          return total + price * item.quantity;
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
          totalPrice: (priceCalc?.totalPrice || 0) + addOnsCost + (selectedCategory?.deposit || 0),
          dirverAge: formData.driverAge,
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
          window.location.href = "/customerDashboard?uploadLicense=true";
        }, 2000);
      } else {
        setTimeout(() => onClose(), 2000);
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to create reservation" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]" onClick={onClose} />
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="bg-[#0f172b] rounded-2xl p-8 text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-5xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Booking Confirmed!</h3>
            <p className="text-gray-400">
              {isNewUser ? "Please upload your license in the dashboard." : "We'll send you a confirmation email shortly."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]" onClick={onClose} />
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#0f172b] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
          {/* Header */}
          <div className="sticky top-0 bg-[#0f172b] border-b border-white/10 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-black text-white">Book Your Van</h2>
              <p className="text-gray-400 text-sm">Step {step} of 3</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FiX className="text-white text-xl" />
            </button>
          </div>

          <div className="p-6">
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">Select Van Category</h3>
                
                {/* Show rental details summary */}
                {formData.office && formData.startDate && formData.endDate && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                    <p className="text-gray-400 text-sm mb-2">Rental Details:</p>
                    <p className="text-white text-sm">📍 {offices.find(o => o._id === formData.office)?.name}</p>
                    <p className="text-white text-sm">📅 {formData.startDate} {formData.startTime} → {formData.endDate} {formData.endTime}</p>
                    <p className="text-white text-sm">👤 Driver Age: {formData.driverAge}</p>
                  </div>
                )}

                {categories.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                    {categories.map(cat => (
                      <div
                        key={cat._id}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat._id }))}
                        className={`group relative h-[320px] rounded-2xl overflow-hidden cursor-pointer transition-all ${
                          formData.category === cat._id ? "ring-2 ring-[#fe9a00]" : ""
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
                          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 group-hover:from-black/70 group-hover:to-black/95 transition-all duration-500"></div>
                        </div>
                        <div className="relative h-full flex flex-col p-4 justify-between">
                          <div>
                            <h4 className="text-base font-black text-white line-clamp-1">{cat.name}</h4>
                            <p className="text-gray-300 text-xs mb-2">or similar</p>
                            <div className="flex gap-1 flex-wrap">
                              <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1">
                                <FiUsers className="text-[#fe9a00] text-[10px]" />
                                <span className="text-white text-[10px] font-semibold">{cat.seats}</span>
                              </div>
                              <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1">
                                <BsFuelPump className="text-[#fe9a00] text-[10px]" />
                                <span className="text-white text-[10px] font-semibold">{cat.fuel}</span>
                              </div>
                              <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1">
                                <FiPackage className="text-[#fe9a00] text-[10px]" />
                                <span className="text-white text-[10px] font-semibold">{cat.cargo}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-white">£{cat.pricingTiers[0]?.pricePerHour}</span>
                              <span className="text-gray-300 text-[10px] font-semibold">/hour</span>
                            </div>
                            <p className="text-gray-400 text-[9px]">from</p>
                          </div>
                        </div>
                        {formData.category === cat._id && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#fe9a00] flex items-center justify-center">
                            <FiCheckCircle className="text-white text-sm" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Loading categories...</p>
                )}

                <button
                  onClick={() => {
                    if (!formData.category) {
                      setErrors({ category: "Please select a category" });
                      return;
                    }
                    
                    // Save category to sessionStorage
                    const stored = sessionStorage.getItem("rentalDetails");
                    if (stored) {
                      const details = JSON.parse(stored);
                      details.category = formData.category;
                      sessionStorage.setItem("rentalDetails", JSON.stringify(details));
                    }
                    
                    // If user exists, skip to step 3, otherwise go to step 2
                    setStep(user ? 3 : 2);
                  }}
                  className="w-full bg-[#fe9a00] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  {user ? "Continue to Add-ons" : "Continue to Login"}
                </button>
                {errors.category && <p className="text-red-400 text-sm text-center mt-2">{errors.category}</p>}
              </div>
            )}

            {/* Step 2: Authentication */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">Login or Sign Up</h3>
                
                {authStep === "phone" && (
                  <div>
                    <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                      <FiPhone className="text-[#fe9a00]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                      placeholder="+44 123 456 7890"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
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
                    <label className="text-white text-sm font-semibold mb-2 block text-center">Enter Verification Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#fe9a00]"
                      placeholder="000000"
                    />
                    {errors.code && <p className="text-red-400 text-xs mt-1 text-center">{errors.code}</p>}
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
                    <p className="text-white text-sm text-center mb-4">Complete your profile</p>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiUser className="text-[#fe9a00]" />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                        placeholder="John"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiUser className="text-[#fe9a00]" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <FiMail className="text-[#fe9a00]" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fe9a00]"
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <button
                      onClick={handleRegister}
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-[#fe9a00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating Account..." : "Complete Registration"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Add-ons & Submit */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">Review & Add-ons</h3>
                
                {selectedCategory && priceCalc && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex gap-3 mb-3">
                      <Image src={selectedCategory.image} alt={selectedCategory.name} width={80} height={80} className="rounded-lg object-cover" />
                      <div>
                        <h4 className="text-white font-bold">{selectedCategory.name}</h4>
                        <p className="text-gray-400 text-sm">{priceCalc.breakdown}</p>
                        <p className="text-[#fe9a00] font-bold">£{priceCalc.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                )}

                {addOns.length > 0 && priceCalc && (
                  <div>
                    <h4 className="text-white font-semibold mb-3">Available Add-ons</h4>
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                      {addOns.map(addon => {
                        const selected = selectedAddOns.find(s => s.addOn === addon._id);
                        const rentalDays = Math.ceil(priceCalc.totalHours / 24);
                        return (
                          <div key={addon._id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="text-white font-semibold text-sm">{addon.name}</h5>
                                {addon.description && <p className="text-gray-400 text-xs mt-1">{addon.description}</p>}
                                {addon.pricingType === "flat" ? (
                                  <p className="text-[#fe9a00] text-sm font-bold mt-1">£{addon.flatPrice}</p>
                                ) : (
                                  <div className="mt-2 space-y-1">
                                    {addon.tiers?.map((tier, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          const existing = selectedAddOns.find(s => s.addOn === addon._id);
                                          if (existing?.selectedTierIndex === idx) return;
                                          setSelectedAddOns(prev => {
                                            const filtered = prev.filter(s => s.addOn !== addon._id);
                                            return [...filtered, { addOn: addon._id, quantity: 1, selectedTierIndex: idx }];
                                          });
                                        }}
                                        className={`text-xs px-2 py-1 rounded border transition-all ${
                                          selected?.selectedTierIndex === idx
                                            ? "bg-[#fe9a00] border-[#fe9a00] text-white"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:border-[#fe9a00]/50"
                                        }`}
                                      >
                                        {tier.minDays}-{tier.maxDays} days: £{tier.price}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                <button
                                  onClick={() => {
                                    setSelectedAddOns(prev => {
                                      const existing = prev.find(s => s.addOn === addon._id);
                                      if (!existing || existing.quantity <= 1) {
                                        return prev.filter(s => s.addOn !== addon._id);
                                      }
                                      return prev.map(s => s.addOn === addon._id ? { ...s, quantity: s.quantity - 1 } : s);
                                    });
                                  }}
                                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                                >
                                  -
                                </button>
                                <span className="text-white font-semibold w-6 text-center">{selected?.quantity || 0}</span>
                                <button
                                  onClick={() => {
                                    setSelectedAddOns(prev => {
                                      const existing = prev.find(s => s.addOn === addon._id);
                                      if (existing) {
                                        return prev.map(s => s.addOn === addon._id ? { ...s, quantity: s.quantity + 1 } : s);
                                      }
                                      return [...prev, { addOn: addon._id, quantity: 1, selectedTierIndex: addon.pricingType === "tiered" ? 0 : undefined }];
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#fe9a00] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Reservation"}
                </button>

                {errors.submit && <p className="text-red-400 text-sm text-center">{errors.submit}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddOnsModal && priceCalc && (
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
