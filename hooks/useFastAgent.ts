"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { showToast } from "@/lib/toast";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type FastPhase = 
  | "ask_needs"
  | "show_suggestions"
  | "collect_booking"
  | "verify_phone"
  | "complete";

export interface CategorySuggestion {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  fuel: string;
  gear: string;
  seats: number;
  doors: number;
  pricingTiers: Array<{
    minHours: number;
    maxHours: number;
    pricePerHour: number;
  }>;
  matchScore: number;
  matchReason: string;
}

export interface FastAgentState {
  phase: FastPhase;
  needs?: {
    purpose: string;
    description: string;
    size: "small" | "medium" | "large";
  };
  suggestions?: CategorySuggestion[];
  selectedCategory?: CategorySuggestion;
  booking: {
    officeId?: string;
    officeName?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    driverAge?: number;
    phoneNumber?: string;
  };
  userId?: string;
  userToken?: string;
  isNewUser?: boolean;
  verificationSent?: boolean;
  reservationId?: string;
}

export interface Office {
  _id: string;
  name: string;
  address: string;
}

export interface FastAgentResponse {
  message: string;
  audio?: string;
  state: FastAgentState;
  showSuggestions: boolean;
  needsPhoneInput: boolean;
  needsCodeInput: boolean;
  needsBookingForm: boolean;
  isComplete: boolean;
  error?: string;
}

// ============================================================================
// HOOK
// ============================================================================

export function useFastAgent() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [agentState, setAgentState] = useState<FastAgentState>({
    phase: "ask_needs",
    booking: { startTime: "10:00", endTime: "10:00" },
  });
  const [offices, setOffices] = useState<Office[]>([]);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stateRef = useRef<FastAgentState>(agentState);
  
  // Keep ref in sync
  useEffect(() => {
    stateRef.current = agentState;
  }, [agentState]);
  
  // Fetch offices on mount
  useEffect(() => {
    fetchOffices();
  }, []);
  
  const fetchOffices = async () => {
    try {
      const res = await fetch("/api/fast-agent");
      const data = await res.json();
      if (data.success) {
        setOffices(data.data.offices);
      }
    } catch (error) {
      console.error("Failed to fetch offices:", error);
    }
  };
  
  // Play audio
  const playAudio = useCallback((base64Audio: string) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audioRef.current = audio;
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      
      audio.play().catch(() => setIsPlaying(false));
    } catch (error) {
      setIsPlaying(false);
    }
  }, []);
  
  // Stop audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);
  
  // Send message to agent
  const sendMessage = useCallback(async (
    message: string,
    action?: string
  ): Promise<FastAgentResponse | null> => {
    setIsLoading(true);
    stopAudio();
    
    // Add user message (except for start)
    if (message !== "start") {
      setMessages(prev => [...prev, { role: "user", content: message }]);
    }
    
    try {
      const res = await fetch("/api/fast-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          state: stateRef.current,
          action,
          includeAudio: true,
        }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || "Agent failed");
      }
      
      const response: FastAgentResponse = data.data;
      
      // Update state
      setAgentState(response.state);
      
      // Add assistant message
      if (response.message) {
        setMessages(prev => [...prev, { role: "assistant", content: response.message }]);
      }
      
      // Play audio
      if (response.audio) {
        playAudio(response.audio);
      }
      
      return response;
      
    } catch (error: any) {
      console.error("Agent error:", error);
      showToast.error(error.message || "Something went wrong");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [playAudio, stopAudio]);
  
  // Select a category
  const selectCategory = useCallback(async (categoryId: string) => {
    return sendMessage(categoryId, "select_category");
  }, [sendMessage]);
  
  // Submit booking form
  const submitBooking = useCallback(async (booking: {
    officeId: string;
    startDate: string;
    endDate: string;
    driverAge: number;
  }) => {
    return sendMessage(JSON.stringify(booking), "submit_booking");
  }, [sendMessage]);
  
  // Send phone verification code
  const sendCode = useCallback(async (phoneNumber: string) => {
    return sendMessage(phoneNumber, "send_code");
  }, [sendMessage]);
  
  // Verify code
  const verifyCode = useCallback(async (code: string) => {
    return sendMessage(code, "verify_code");
  }, [sendMessage]);
  
  // Reset
  const reset = useCallback(() => {
    stopAudio();
    setMessages([]);
    setAgentState({
      phase: "ask_needs",
      booking: { startTime: "10:00", endTime: "10:00" },
    });
  }, [stopAudio]);
  
  return {
    // State
    isLoading,
    isPlaying,
    messages,
    agentState,
    offices,
    
    // Actions
    sendMessage,
    selectCategory,
    submitBooking,
    sendCode,
    verifyCode,
    reset,
    stopAudio,
  };
}
