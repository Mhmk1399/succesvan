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
} from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import Image from "next/image";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFastAgent, CategorySuggestion, FastPhase } from "@/hooks/useFastAgent";

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
    driverAge: 25,
  });
  
  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  
  const {
    isLoading,
    isPlaying,
    messages,
    agentState,
    offices,
    sendMessage,
    selectCategory,
    submitBooking,
    sendCode,
    verifyCode,
    reset,
    stopAudio,
  } = useFastAgent();
  
  const { isRecording, toggleRecording } = useVoiceRecording({
    onTranscriptionComplete: async (result) => {
      console.log("🎤 User said:", result.transcript);
      const response = await sendMessage(result.transcript);
      
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
    if (!verificationCode || verificationCode.length !== 6) return;
    await verifyCode(verificationCode);
  };
  
  const today = new Date().toISOString().split("T")[0];
  
  const getPhaseProgress = (phase: FastPhase): number => {
    switch (phase) {
      case "ask_needs": return 20;
      case "show_suggestions": return 40;
      case "collect_booking": return 60;
      case "verify_phone": return 80;
      case "complete": return 100;
    }
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
                  Continue to Verification
                </button>
              </form>
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
        
        {/* Bottom Controls - only show for voice input phases */}
        {(agentState.phase === "ask_needs") && (
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
                ) : (
                  <span>Tap to speak</span>
                )}
              </div>
              
              <button
                onClick={toggleRecording}
                disabled={isPlaying || isLoading}
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
              £{category.pricingTiers?.[0]?.pricePerHour || 0}
            </span>
            <span className="text-gray-400 text-xs">/hour</span>
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
