"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiMic,
  FiVolume2,
  FiCheck,
  FiTruck,
  FiCalendar,
  FiPhone,
  FiUsers,
  FiPackage,
  FiSend,
  FiLoader,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import Image from "next/image";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFastAgent, CategorySuggestion, FastPhase, AddOnOption, SelectedAddOn } from "@/hooks/useFastAgent";

interface FastAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reservationId: string, userToken: string, isNewUser: boolean) => void;
}

export default function FastAgentModal({
  isOpen,
  onClose,
  onComplete,
}: FastAgentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    officeId: "",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "10:00",
    driverAge: 25,
  });
  
  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  
  // Add-ons selection state
  const [addOnQuantities, setAddOnQuantities] = useState<Record<string, number>>({});
  
  // Gear type selection state
  const [selectedGearType, setSelectedGearType] = useState<"manual" | "automatic">("manual");
  
  const {
    isLoading,
    isPlaying,
    messages,
    agentState,
    offices,
    sendMessage,
    selectCategory,
    submitBooking,
    voiceBooking,
    voicePhone,
    confirmAddOns,
    skipAddOns,
    selectGear,
    confirmReceipt,
    sendCode,
    verifyCode,
    reset,
    stopAudio,
  } = useFastAgent();
  
  // Use ref to track current phase for voice callback (avoids stale closure)
  const phaseRef = useRef(agentState.phase);
  useEffect(() => {
    phaseRef.current = agentState.phase;
    console.log("📍 [FastAgentModal] Phase updated to:", agentState.phase);
  }, [agentState.phase]);
  
  // Initialize gear type when category is selected
  useEffect(() => {
    if (agentState.selectedCategory) {
      const gear = agentState.selectedCategory.gear;
      if (typeof gear !== "string" && gear.availableTypes?.length > 0) {
        setSelectedGearType(gear.availableTypes[0] as "manual" | "automatic");
      }
    }
  }, [agentState.selectedCategory]);
  
  const { isRecording, toggleRecording } = useVoiceRecording({
    onTranscriptionComplete: async (result) => {
      console.log("🎤 User said:", result.transcript);
      console.log("📍 Current phase (from ref):", phaseRef.current);
      
      // Use different handler based on current phase
      let response;
      if (phaseRef.current === "collect_booking") {
        console.log("🎯 Calling voiceBooking...");
        response = await voiceBooking(result.transcript);
      } else if (phaseRef.current === "verify_phone") {
        console.log("🎯 Calling voicePhone...");
        response = await voicePhone(result.transcript);
      } else {
        console.log("🎯 Calling sendMessage...");
        response = await sendMessage(result.transcript);
      }
      
      if (response?.isComplete && response.state.reservationId) {
        setTimeout(() => {
          onComplete(
            response.state.reservationId!,
            response.state.userToken || "",
            response.state.isNewUser || false
          );
        }, 2000);
      }
    },
    autoSubmit: false,
  });
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Sync booking form with agent state (for voice-filled values)
  useEffect(() => {
    if (agentState.booking) {
      setBookingForm(prev => ({
        officeId: agentState.booking.officeId || prev.officeId,
        startDate: agentState.booking.startDate || prev.startDate,
        endDate: agentState.booking.endDate || prev.endDate,
        startTime: agentState.booking.startTime || prev.startTime,
        endTime: agentState.booking.endTime || prev.endTime,
        driverAge: agentState.booking.driverAge || prev.driverAge,
      }));
    }
  }, [agentState.booking]);
  
  // Start conversation when modal opens
  useEffect(() => {
    if (isOpen && !hasStarted && mounted) {
      setHasStarted(true);
      sendMessage("start");
    }
  }, [isOpen, hasStarted, mounted, sendMessage]);
  
  // Handle complete
  useEffect(() => {
    if (agentState.phase === "complete" && agentState.reservationId) {
      setTimeout(() => {
        onComplete(
          agentState.reservationId!,
          agentState.userToken || "",
          agentState.isNewUser || false
        );
      }, 2500);
    }
  }, [agentState, onComplete]);
  
  if (!isOpen || !mounted) return null;
  
  const handleClose = () => {
    stopAudio();
    reset();
    setHasStarted(false);
    onClose();
  };
  
  const handleSelectCategory = async (category: CategorySuggestion) => {
    await selectCategory(category._id);
  };
  
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.officeId || !bookingForm.startDate || !bookingForm.endDate) {
      return;
    }
    await submitBooking(bookingForm);
  };
  
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    await sendCode(phoneNumber);
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔐 [FastAgentModal] Attempting to verify code:", verificationCode);
    if (!verificationCode || verificationCode.length !== 6) {
      console.log("⚠️ [FastAgentModal] Invalid code length:", verificationCode.length);
      return;
    }
    console.log("📤 [FastAgentModal] Calling verifyCode...");
    await verifyCode(verificationCode);
  };
  
  const today = new Date().toISOString().split("T")[0];
  
  const getPhaseProgress = (phase: FastPhase): number => {
    switch (phase) {
      case "ask_needs": return 10;
      case "show_suggestions": return 25;
      case "collect_booking": return 40;
      case "select_addons": return 55;
      case "show_receipt": return 70;
      case "verify_phone": return 85;
      case "complete": return 100;
    }
  };
  
  // Calculate add-on price based on rental days
  const getAddOnPrice = (addOn: AddOnOption): number => {
    const totalDays = agentState.booking.totalDays || 1;
    
    if (addOn.pricingType === "flat") {
      const amount = addOn.flatPrice?.amount || 0;
      // If flat price is per day, multiply by total days
      return addOn.flatPrice?.isPerDay ? amount * totalDays : amount;
    }
    
    // Find matching tier for tiered pricing
    if (addOn.tieredPrice?.tiers && addOn.tieredPrice.tiers.length > 0) {
      const tier = addOn.tieredPrice.tiers.find(t => totalDays >= t.minDays && totalDays <= t.maxDays);
      const tierPrice = tier?.price || addOn.tieredPrice.tiers[0].price || 0;
      // If tiered price is per day, multiply by total days
      return addOn.tieredPrice.isPerDay ? tierPrice * totalDays : tierPrice;
    }
    
    return 0;
  };
  
  // Handle add-on quantity change
  const handleAddOnQuantityChange = (addOnId: string, delta: number) => {
    setAddOnQuantities(prev => {
      const current = prev[addOnId] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [addOnId]: newVal };
    });
  };
  
  // Handle gear type selection
  const handleGearSelection = () => {
    const extraCost = getGearExtraCost();
    selectGear(selectedGearType, extraCost);
  };
  
  // Get gear extra cost
  const getGearExtraCost = (): number => {
    if (!agentState.selectedCategory) return 0;
    const gear = agentState.selectedCategory.gear;
    if (typeof gear === "string") return 0;
    if (selectedGearType === "automatic" && gear.availableTypes?.includes("automatic") && gear.availableTypes?.includes("manual")) {
      const totalDays = agentState.booking.totalDays || 1;
      return (gear.automaticExtraCost || 0) * totalDays;
    }
    return 0;
  };
  
  // Handle confirm add-ons
  const handleConfirmAddOns = async () => {
    const selectedAddOns: SelectedAddOn[] = [];
    
    for (const addOn of agentState.availableAddOns || []) {
      const quantity = addOnQuantities[addOn._id] || 0;
      if (quantity > 0) {
        const pricePerUnit = getAddOnPrice(addOn);
        selectedAddOns.push({
          addOnId: addOn._id,
          name: addOn.name,
          quantity,
          pricePerUnit,
          totalPrice: pricePerUnit * quantity,
        });
      }
    }
    
    // Include gear selection in the booking
    await confirmAddOns(selectedAddOns);
  };
  
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f172b] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FiTruck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">AI Van Consultant</h2>
                <p className="text-orange-100 text-sm">Quick Booking in 1 Minute</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${getPhaseProgress(agentState.phase)}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Chat Messages */}
          <div className="p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-white/10 text-white rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Category Suggestions Cards */}
          {agentState.phase === "show_suggestions" && agentState.suggestions && (
            <div className="px-4 pb-4">
              <p className="text-gray-400 text-sm mb-3">Select your preferred van:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agentState.suggestions.map((category) => (
                  <SuggestionCard
                    key={category._id}
                    category={category}
                    onSelect={() => handleSelectCategory(category)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Booking Form */}
          {agentState.phase === "collect_booking" && (
            <div className="px-4 pb-4">
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                {/* Selected Category Summary */}
                {agentState.selectedCategory && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex items-center gap-3">
                    <FiTruck className="text-orange-500 text-xl" />
                    <div>
                      <p className="text-white font-medium">{agentState.selectedCategory.name}</p>
                      <p className="text-gray-400 text-xs">{agentState.selectedCategory.matchReason}</p>
                    </div>
                  </div>
                )}
                
                {/* Office Select */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">Pickup Location *</label>
                  <select
                    value={bookingForm.officeId}
                    onChange={(e) => setBookingForm(p => ({ ...p, officeId: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Select office</option>
                    {offices.map((office) => (
                      <option key={office._id} value={office._id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1.5">Pickup Date *</label>
                    <input
                      type="date"
                      value={bookingForm.startDate}
                      onChange={(e) => setBookingForm(p => ({ ...p, startDate: e.target.value }))}
                      min={today}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1.5">Return Date *</label>
                    <input
                      type="date"
                      value={bookingForm.endDate}
                      onChange={(e) => setBookingForm(p => ({ ...p, endDate: e.target.value }))}
                      min={bookingForm.startDate || today}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1.5">Pickup Time *</label>
                    <input
                      type="time"
                      value={bookingForm.startTime}
                      onChange={(e) => setBookingForm(p => ({ ...p, startTime: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1.5">Return Time *</label>
                    <input
                      type="time"
                      value={bookingForm.endTime}
                      onChange={(e) => setBookingForm(p => ({ ...p, endTime: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Driver Age */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">Driver Age *</label>
                  <input
                    type="number"
                    value={bookingForm.driverAge}
                    onChange={(e) => setBookingForm(p => ({ ...p, driverAge: parseInt(e.target.value) || 25 }))}
                    min={21}
                    max={99}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !bookingForm.officeId || !bookingForm.startDate || !bookingForm.endDate}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <FiLoader className="animate-spin" /> : <FiCalendar />}
                  Continue to Add-ons
                </button>
              </form>
            </div>
          )}
          
          {/* Gear Type Selection */}
          {agentState.phase === "select_gear" && agentState.selectedCategory && (() => {
            const gear = agentState.selectedCategory.gear;
            const hasGearOptions = typeof gear !== "string" && gear.availableTypes?.length > 1;
            
            // If no gear options, auto-advance to add-ons with default gear
            if (!hasGearOptions) {
              const defaultGear = typeof gear === "string" ? "manual" : (gear.availableTypes?.[0] as "manual" | "automatic" || "manual");
              selectGear(defaultGear, 0);
              return null;
            }
            
            return (
              <div className="px-4 pb-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  {/* Header */}
                  <div className="text-center border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">⚙️ Select Gear Type</h3>
                    <p className="text-gray-400 text-sm">Choose your preferred transmission</p>
                  </div>
                  
                  {/* Vehicle Info */}
                  <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <FiTruck className="text-orange-500 text-xl shrink-0" />
                    <div>
                      <p className="text-white font-medium">{agentState.selectedCategory.name}</p>
                      <p className="text-gray-400 text-xs">
                        {agentState.booking.totalDays} day(s) rental
                      </p>
                    </div>
                  </div>
                  
                  {/* Gear Options */}
                  <div className="space-y-3">
                    {typeof gear !== "string" && gear.availableTypes?.map((type) => {
                      const isSelected = selectedGearType === type;
                      const extraCost = type === "automatic" && gear.automaticExtraCost ? gear.automaticExtraCost : 0;
                      const totalDays = agentState.booking.totalDays || 1;
                      const totalExtraCost = extraCost * totalDays;
                      
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedGearType(type as "manual" | "automatic")}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium capitalize">{type}</p>
                              {extraCost > 0 && (
                                <p className="text-orange-400 text-sm mt-1">
                                  +£{extraCost}/day (£{totalExtraCost} total)
                                </p>
                              )}
                              {extraCost === 0 && (
                                <p className="text-green-400 text-sm mt-1">Included</p>
                              )}
                            </div>
                            {isSelected && (
                              <FiCheck className="text-orange-500 text-xl" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Continue Button */}
                  <button
                    onClick={handleGearSelection}
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    Continue to Add-ons
                  </button>
                </div>
              </div>
            );
          })()}
          
          {/* Add-ons Selection */}
          {agentState.phase === "select_addons" && agentState.availableAddOns && (
            <div className="px-4 pb-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                {/* Header */}
                <div className="text-center border-b border-white/10 pb-3">
                  <h3 className="text-xl font-bold text-white">📦 Optional Add-ons</h3>
                  <p className="text-gray-400 text-sm">Enhance your rental experience</p>
                </div>
                
                {/* Add-ons List */}
                <div className="space-y-3">
                  {agentState.availableAddOns.map((addOn) => {
                    const price = getAddOnPrice(addOn);
                    const quantity = addOnQuantities[addOn._id] || 0;
                    
                    return (
                      <div 
                        key={addOn._id}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{addOn.name}</p>
                          {addOn.description && (
                            <p className="text-gray-400 text-xs">{addOn.description}</p>
                          )}
                          <p className="text-orange-400 text-sm font-medium">
                            £{price.toFixed(2)} {addOn.pricingType === "flat" ? "" : "/ rental"}
                          </p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddOnQuantityChange(addOn._id, -1)}
                            disabled={quantity === 0}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-white font-medium">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleAddOnQuantityChange(addOn._id, 1)}
                            className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Total for selected add-ons */}
                {Object.values(addOnQuantities).some(q => q > 0) && (
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Add-ons Total:</span>
                      <span className="text-orange-400 font-medium">
                        £{(agentState.availableAddOns || []).reduce((sum, addOn) => {
                          const qty = addOnQuantities[addOn._id] || 0;
                          return sum + (getAddOnPrice(addOn) * qty);
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={skipAddOns}
                    disabled={isLoading}
                    className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleConfirmAddOns}
                    disabled={isLoading}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Booking Receipt */}
          {agentState.phase === "show_receipt" && agentState.booking && (
            <div className="px-4 pb-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                {/* Header */}
                <div className="text-center border-b border-white/10 pb-3">
                  <h3 className="text-xl font-bold text-white">📋 Booking Summary</h3>
                  <p className="text-gray-400 text-sm">Please review your booking details</p>
                </div>
                
                {/* Vehicle */}
                {agentState.selectedCategory && (
                  <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <FiTruck className="text-orange-500 text-xl shrink-0" />
                    <div>
                      <p className="text-white font-medium">{agentState.selectedCategory.name}</p>
                      <p className="text-gray-400 text-xs">{agentState.selectedCategory.matchReason}</p>
                    </div>
                  </div>
                )}
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {/* Pickup Location */}
                  <div className="col-span-2 bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Pickup Location</p>
                    <p className="text-white font-medium">
                      {offices.find(o => o._id === agentState.booking.officeId)?.name || "—"}
                    </p>
                  </div>
                  
                  {/* Pickup Date & Time */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Pickup</p>
                    <p className="text-white font-medium">{agentState.booking.startDate || "—"}</p>
                    <p className="text-orange-400 text-sm">{agentState.booking.startTime || "—"}</p>
                  </div>
                  
                  {/* Return Date & Time */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Return</p>
                    <p className="text-white font-medium">{agentState.booking.endDate || "—"}</p>
                    <p className="text-orange-400 text-sm">{agentState.booking.endTime || "—"}</p>
                  </div>
                  
                  {/* Driver Age */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Driver Age</p>
                    <p className="text-white font-medium">{agentState.booking.driverAge || 25} years</p>
                  </div>
                  
                  {/* Duration */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Duration</p>
                    <p className="text-white font-medium">
                      {agentState.booking.totalDays || 0} day(s)
                      {agentState.booking.extraHours ? ` + ${agentState.booking.extraHours}h` : ""}
                    </p>
                  </div>
                  
                  {/* Gear Type */}
                  {agentState.booking.gearType && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Transmission</p>
                      <p className="text-white font-medium capitalize">{agentState.booking.gearType}</p>
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Price Breakdown</p>
                  
                  {agentState.booking.totalDays && agentState.booking.pricePerDay && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {agentState.booking.totalDays} day(s) × £{agentState.booking.pricePerDay}
                      </span>
                      <span className="text-white">
                        £{(agentState.booking.totalDays * agentState.booking.pricePerDay).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {agentState.booking.extraHours && agentState.booking.extraHoursRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {agentState.booking.extraHours} extra hour(s) × £{agentState.booking.extraHoursRate}
                      </span>
                      <span className="text-white">
                        £{(agentState.booking.extraHours * agentState.booking.extraHoursRate).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {/* Automatic Gear Extra Cost */}
                  {agentState.booking.gearType === "automatic" && agentState.selectedCategory && (() => {
                    const gear = agentState.selectedCategory.gear;
                    if (typeof gear !== "string" && gear.automaticExtraCost && gear.availableTypes?.includes("manual")) {
                      const totalDays = agentState.booking.totalDays || 1;
                      const totalCost = gear.automaticExtraCost * totalDays;
                      return (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            Automatic transmission × {totalDays} day(s)
                          </span>
                          <span className="text-white">
                            £{totalCost.toFixed(2)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Add-ons */}
                  {agentState.booking.selectedAddOns && agentState.booking.selectedAddOns.length > 0 && (
                    <>
                      <p className="text-gray-400 text-xs uppercase tracking-wider pt-2">Add-ons</p>
                      {agentState.booking.selectedAddOns.map((addon, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            {addon.name} × {addon.quantity}
                          </span>
                          <span className="text-white">
                            £{addon.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-2xl font-bold text-green-400">
                      £{(agentState.booking.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Confirm Button */}
                <button
                  onClick={confirmReceipt}
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                  Confirm & Continue to Verification
                </button>
              </div>
            </div>
          )}
          
          {/* Phone Verification */}
          {agentState.phase === "verify_phone" && (
            <div className="px-4 pb-4">
              {!agentState.verificationSent ? (
                // Phone input
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+44 123 456 7890"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">We&apos;ll send a verification code</p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !phoneNumber}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiPhone />}
                    Send Code
                  </button>
                </form>
              ) : (
                // Code input
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1.5">Verification Code *</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-orange-500"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">Enter the 6-digit code sent to {agentState.booking.phoneNumber}</p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    Confirm Booking
                  </button>
                </form>
              )}
            </div>
          )}
          
          {/* Complete State */}
          {agentState.phase === "complete" && (
            <div className="px-4 pb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-5xl text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed! 🎉</h3>
              <p className="text-gray-400">
                {agentState.isNewUser 
                  ? "Account created! Redirecting to upload your license..."
                  : "Redirecting to your dashboard..."}
              </p>
            </div>
          )}
        </div>
        
        {/* Bottom Controls - show for voice input phases */}
        {(agentState.phase === "ask_needs" || agentState.phase === "collect_booking" || agentState.phase === "verify_phone") && (
          <div className="p-4 border-t border-white/10 bg-[#0f172b]">
            <div className="flex items-center justify-center gap-4">
              <div className="text-sm text-gray-400">
                {isRecording ? (
                  <span className="text-red-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Recording...
                  </span>
                ) : isPlaying ? (
                  <span className="flex items-center gap-1">
                    <FiVolume2 className="animate-pulse" />
                    Speaking...
                  </span>
                ) : agentState.phase === "collect_booking" ? (
                  <span>Or speak: &quot;Tomorrow at 10am, return Friday 5pm&quot;</span>
                ) : agentState.phase === "verify_phone" && !agentState.verificationSent ? (
                  <span>Or speak: &quot;My number is 07123456789&quot;</span>
                ) : (
                  <span>Tap to speak</span>
                )}
              </div>
              
              <button
                onClick={toggleRecording}
                disabled={isPlaying || isLoading || agentState.verificationSent}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiMic className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// SUGGESTION CARD COMPONENT (VanListing Style)
// ============================================================================

function SuggestionCard({
  category,
  onSelect,
  isLoading,
}: {
  category: CategorySuggestion;
  onSelect: () => void;
  isLoading: boolean;
}) {
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 transition-all"
      onClick={!isLoading ? onSelect : undefined}
    >
      {/* Image/Background */}
      <div className="relative h-40">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-orange-500/20 to-orange-500/5" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Match Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 rounded-full text-xs font-bold text-white">
          {category.matchScore}% Match
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
        <p className="text-gray-300 text-xs mb-2 line-clamp-2">{category.matchReason}</p>
        
        {/* Specs */}
        <div className="flex gap-2 flex-wrap mb-2">
          <div className="px-2 py-0.5 rounded-full bg-white/20 flex items-center gap-1">
            <FiUsers className="text-orange-400 text-xs" />
            <span className="text-white text-xs">{category.seats}</span>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-white/20 flex items-center gap-1">
            <BsFuelPump className="text-orange-400 text-xs" />
            <span className="text-white text-xs">{category.fuel}</span>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-white/20 flex items-center gap-1">
            <FiPackage className="text-orange-400 text-xs" />
            <span className="text-white text-xs">{category.doors} doors</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-white">
              £{category.pricingTiers?.[0]?.pricePerDay || 0}
            </span>
            <span className="text-gray-400 text-xs">/day</span>
          </div>
          <button
            disabled={isLoading}
            className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
