/**
 * Fast AI Van Consultant Agent
 * 
 * A streamlined agent that completes the booking in ~1 minute:
 * 1. ASK ONCE - Get all needs in 1-2 questions max
 * 2. SHOW SUGGESTIONS - Display matching categories as cards
 * 3. COMPLETE BOOKING - Collect dates, verify phone, create reservation
 */

import OpenAI from "openai";
import connect from "@/lib/data";
import Category from "@/model/category";
import Office from "@/model/office";
import User from "@/model/user";
import Reservation from "@/model/reservation";
import jwt from "jsonwebtoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type FastPhase = 
  | "ask_needs"        // Quick question about needs
  | "show_suggestions" // Display category cards
  | "collect_booking"  // Get dates, office, age
  | "verify_phone"     // Phone verification
  | "complete";        // Done!

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
  matchScore: number;  // 1-100 how well it matches needs
  matchReason: string; // Why this was suggested
}

export interface FastAgentState {
  phase: FastPhase;
  
  // User needs (gathered in 1 question)
  needs?: {
    purpose: string;
    description: string;
    size: "small" | "medium" | "large";
  };
  
  // Suggestions (categories that match)
  suggestions?: CategorySuggestion[];
  selectedCategory?: CategorySuggestion;
  
  // Booking data
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
  
  // Auth
  userId?: string;
  userToken?: string;
  isNewUser?: boolean;
  verificationSent?: boolean;
  
  // Result
  reservationId?: string;
}

export interface FastAgentResponse {
  message: string;
  state: FastAgentState;
  showSuggestions: boolean;
  needsPhoneInput: boolean;
  needsCodeInput: boolean;
  needsBookingForm: boolean;
  isComplete: boolean;
  error?: string;
}

// ============================================================================
// MAIN AGENT FUNCTION
// ============================================================================

export async function processFastAgent(
  userMessage: string,
  currentState: FastAgentState,
  action?: string // "select_category" | "submit_booking" | "send_code" | "verify_code"
): Promise<FastAgentResponse> {
  console.log("⚡ [Fast Agent] Processing...");
  console.log("📍 Phase:", currentState.phase);
  console.log("💬 Message:", userMessage);
  console.log("🎯 Action:", action);
  
  await connect();
  
  try {
    switch (currentState.phase) {
      case "ask_needs":
        return await handleAskNeeds(userMessage, currentState);
        
      case "show_suggestions":
        if (action === "select_category") {
          return handleSelectCategory(userMessage, currentState);
        }
        return { 
          message: "Please select a van from the suggestions above.",
          state: currentState,
          showSuggestions: true,
          needsPhoneInput: false,
          needsCodeInput: false,
          needsBookingForm: false,
          isComplete: false,
        };
        
      case "collect_booking":
        if (action === "submit_booking") {
          return handleSubmitBooking(userMessage, currentState);
        }
        return {
          message: "Please fill in the booking details.",
          state: currentState,
          showSuggestions: false,
          needsPhoneInput: false,
          needsCodeInput: false,
          needsBookingForm: true,
          isComplete: false,
        };
        
      case "verify_phone":
        if (action === "send_code") {
          return await handleSendCode(userMessage, currentState);
        }
        if (action === "verify_code") {
          return await handleVerifyCode(userMessage, currentState);
        }
        return {
          message: "Please enter your phone number to confirm the booking.",
          state: currentState,
          showSuggestions: false,
          needsPhoneInput: !currentState.verificationSent,
          needsCodeInput: !!currentState.verificationSent,
          needsBookingForm: false,
          isComplete: false,
        };
        
      case "complete":
        return {
          message: "Your booking is complete! Redirecting to your dashboard...",
          state: currentState,
          showSuggestions: false,
          needsPhoneInput: false,
          needsCodeInput: false,
          needsBookingForm: false,
          isComplete: true,
        };
        
      default:
        return await handleAskNeeds(userMessage, currentState);
    }
  } catch (error: any) {
    console.error("❌ [Fast Agent] Error:", error);
    return {
      message: "Sorry, something went wrong. Please try again.",
      state: currentState,
      showSuggestions: false,
      needsPhoneInput: false,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
      error: error.message,
    };
  }
}

// ============================================================================
// PHASE HANDLERS
// ============================================================================

async function handleAskNeeds(
  userMessage: string,
  currentState: FastAgentState
): Promise<FastAgentResponse> {
  // If this is the initial "start" message, ask what they need
  if (userMessage === "start" || !userMessage.trim()) {
    return {
      message: "Hi! 👋 What do you need to move or transport? Tell me about your job - furniture, boxes, equipment, or something else?",
      state: { ...currentState, phase: "ask_needs" },
      showSuggestions: false,
      needsPhoneInput: false,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
    };
  }
  
  // User has described their needs - analyze and get suggestions
  const categories = await Category.find({}).lean();
  const offices = await Office.find({}).lean();
  
  // Use GPT to understand needs and match categories
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a van hire expert. Analyze what the customer needs and match them to the best van categories.

AVAILABLE CATEGORIES:
${categories.map((c: any) => `- ${c.name} (ID: ${c._id}): ${c.seats} seats, ${c.fuel}, ${c.gear}, ${c.doors} doors`).join("\n")}

AVAILABLE OFFICES:
${offices.map((o: any) => `- ${o.name} (ID: ${o._id}): ${o.address}`).join("\n")}

Respond with valid JSON:
{
  "understood": true/false,
  "needs": {
    "purpose": "what they're doing (moving, delivery, transport, etc.)",
    "description": "brief description of items",
    "size": "small|medium|large"
  },
  "suggestions": [
    {
      "categoryId": "the category _id",
      "matchScore": 1-100,
      "matchReason": "Why this van is perfect for them (1 sentence)"
    }
  ],
  "followUpQuestion": "Only if you truly can't understand, ask ONE clarifying question"
}`
      },
      { role: "user", content: userMessage }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  
  const result = JSON.parse(completion.choices[0].message.content || "{}");
  console.log("🧠 [Fast Agent] Analysis:", JSON.stringify(result, null, 2));
  
  // If not understood, ask follow-up
  if (!result.understood && result.followUpQuestion) {
    return {
      message: result.followUpQuestion,
      state: { ...currentState, phase: "ask_needs" },
      showSuggestions: false,
      needsPhoneInput: false,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
    };
  }
  
  // Build suggestions with full category data
  const suggestions: CategorySuggestion[] = (result.suggestions || [])
    .map((s: any) => {
      const cat = categories.find((c: any) => c._id.toString() === s.categoryId);
      if (!cat) return null;
      return {
        _id: (cat as any)._id.toString(),
        name: (cat as any).name,
        description: (cat as any).description,
        image: (cat as any).image,
        fuel: (cat as any).fuel,
        gear: (cat as any).gear,
        seats: (cat as any).seats,
        doors: (cat as any).doors,
        pricingTiers: (cat as any).pricingTiers || [],
        matchScore: s.matchScore,
        matchReason: s.matchReason,
      };
    })
    .filter(Boolean)
    .slice(0, 3); // Max 3 suggestions
  
  // If no matches, show all categories
  if (suggestions.length === 0) {
    categories.forEach((cat: any, i) => {
      suggestions.push({
        _id: cat._id.toString(),
        name: cat.name,
        description: cat.description,
        image: cat.image,
        fuel: cat.fuel,
        gear: cat.gear,
        seats: cat.seats,
        doors: cat.doors,
        pricingTiers: cat.pricingTiers || [],
        matchScore: 80 - i * 10,
        matchReason: "Great all-purpose van for your needs",
      });
    });
  }
  
  const newState: FastAgentState = {
    ...currentState,
    phase: "show_suggestions",
    needs: result.needs,
    suggestions,
  };
  
  const topMatch = suggestions[0];
  const message = `Perfect! Based on your needs, I recommend the **${topMatch?.name}** - ${topMatch?.matchReason}. Here are your best options:`;
  
  return {
    message,
    state: newState,
    showSuggestions: true,
    needsPhoneInput: false,
    needsCodeInput: false,
    needsBookingForm: false,
    isComplete: false,
  };
}

function handleSelectCategory(
  categoryId: string,
  currentState: FastAgentState
): FastAgentResponse {
  const selected = currentState.suggestions?.find(s => s._id === categoryId);
  
  if (!selected) {
    return {
      message: "Please select a valid van option.",
      state: currentState,
      showSuggestions: true,
      needsPhoneInput: false,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
    };
  }
  
  const newState: FastAgentState = {
    ...currentState,
    phase: "collect_booking",
    selectedCategory: selected,
    booking: {
      ...currentState.booking,
      categoryId: selected._id,
    },
  };
  
  return {
    message: `Great choice! The **${selected.name}** is perfect. Now let's get your booking details:`,
    state: newState,
    showSuggestions: false,
    needsPhoneInput: false,
    needsCodeInput: false,
    needsBookingForm: true,
    isComplete: false,
  };
}

function handleSubmitBooking(
  bookingJson: string,
  currentState: FastAgentState
): FastAgentResponse {
  try {
    const booking = JSON.parse(bookingJson);
    
    // Validate required fields
    if (!booking.officeId || !booking.startDate || !booking.endDate || !booking.driverAge) {
      return {
        message: "Please fill in all required fields: office, dates, and driver age.",
        state: currentState,
        showSuggestions: false,
        needsPhoneInput: false,
        needsCodeInput: false,
        needsBookingForm: true,
        isComplete: false,
      };
    }
    
    const newState: FastAgentState = {
      ...currentState,
      phase: "verify_phone",
      booking: {
        ...currentState.booking,
        ...booking,
      },
    };
    
    return {
      message: "Almost done! Enter your phone number to confirm the booking:",
      state: newState,
      showSuggestions: false,
      needsPhoneInput: true,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
    };
  } catch {
    return {
      message: "Invalid booking data. Please try again.",
      state: currentState,
      showSuggestions: false,
      needsPhoneInput: false,
      needsCodeInput: false,
      needsBookingForm: true,
      isComplete: false,
    };
  }
}

async function handleSendCode(
  phoneNumber: string,
  currentState: FastAgentState
): Promise<FastAgentResponse> {
  if (!phoneNumber || phoneNumber.length < 10) {
    return {
      message: "Please enter a valid phone number.",
      state: currentState,
      showSuggestions: false,
      needsPhoneInput: true,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
    };
  }
  
  try {
    // Call the auth API to send code
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send-code",
        phoneNumber,
      }),
    });
    
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    
    const newState: FastAgentState = {
      ...currentState,
      booking: {
        ...currentState.booking,
        phoneNumber,
      },
      verificationSent: true,
    };
    
    return {
      message: "Code sent! Enter the 6-digit code you received:",
      state: newState,
      showSuggestions: false,
      needsPhoneInput: false,
      needsCodeInput: true,
      needsBookingForm: false,
      isComplete: false,
    };
  } catch (error: any) {
    return {
      message: `Failed to send code: ${error.message}. Please try again.`,
      state: currentState,
      showSuggestions: false,
      needsPhoneInput: true,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
      error: error.message,
    };
  }
}

async function handleVerifyCode(
  code: string,
  currentState: FastAgentState
): Promise<FastAgentResponse> {
  if (!code || code.length !== 6) {
    return {
      message: "Please enter the 6-digit code.",
      state: currentState,
      showSuggestions: false,
      needsPhoneInput: false,
      needsCodeInput: true,
      needsBookingForm: false,
      isComplete: false,
    };
  }
  
  const phoneNumber = currentState.booking.phoneNumber;
  
  try {
    // Verify the code
    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        phoneNumber,
        code,
      }),
    });
    
    const verifyData = await verifyRes.json();
    if (!verifyData.success) throw new Error(verifyData.error);
    
    let userId: string;
    let userToken: string;
    let isNewUser = false;
    
    if (verifyData.data.userExists) {
      // Existing user
      userId = verifyData.data.user._id;
      userToken = verifyData.data.token;
    } else {
      // Create new user
      const cleanPhone = phoneNumber?.replace(/\D/g, "") || "unknown";
      const user = new User({
        name: "Van Customer",
        lastName: "Guest",
        emaildata: {
          emailAddress: `${cleanPhone}@guest.successvan.com`,
          isVerified: false,
        },
        phoneData: {
          phoneNumber,
          isVerified: true,
        },
        role: "user",
      });
      
      await user.save();
      
      userId = user._id.toString();
      userToken = jwt.sign(
        { userId, phoneNumber },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );
      isNewUser = true;
    }
    
    // Create the reservation
    const { booking, selectedCategory } = currentState;
    
    const startDate = new Date(booking.startDate!);
    const endDate = new Date(booking.endDate!);
    const hours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    
    // Calculate price from tiers
    let pricePerHour = 10;
    if (selectedCategory?.pricingTiers?.length) {
      const tier = selectedCategory.pricingTiers.find(
        t => hours >= t.minHours && hours <= t.maxHours
      ) || selectedCategory.pricingTiers[0];
      pricePerHour = tier?.pricePerHour || 10;
    }
    const totalPrice = hours * pricePerHour;
    
    const reservation = new Reservation({
      user: userId,
      office: booking.officeId,
      category: booking.categoryId,
      startDate,
      endDate,
      totalPrice,
      status: "pending",
      dirverAge: booking.driverAge || 25,
      messege: `Booked via AI Assistant. Phone: ${phoneNumber}`,
      addOns: [],
    });
    
    await reservation.save();
    
    const newState: FastAgentState = {
      ...currentState,
      phase: "complete",
      userId,
      userToken,
      isNewUser,
      reservationId: reservation._id.toString(),
    };
    
    const successMessage = isNewUser
      ? `🎉 Booking confirmed! We've created an account for you. Redirecting to upload your license...`
      : `🎉 Booking confirmed! Your ${selectedCategory?.name} is reserved. Redirecting to your dashboard...`;
    
    return {
      message: successMessage,
      state: newState,
      showSuggestions: false,
      needsPhoneInput: false,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: true,
    };
    
  } catch (error: any) {
    return {
      message: `Verification failed: ${error.message}. Please try again.`,
      state: { ...currentState, verificationSent: false },
      showSuggestions: false,
      needsPhoneInput: true,
      needsCodeInput: false,
      needsBookingForm: false,
      isComplete: false,
      error: error.message,
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function createInitialFastState(): FastAgentState {
  return {
    phase: "ask_needs",
    booking: {
      startTime: "10:00",
      endTime: "10:00",
    },
  };
}

export async function getOfficesList() {
  await connect();
  const offices = await Office.find({}).lean();
  return offices.map((o: any) => ({
    _id: o._id.toString(),
    name: o.name,
    address: o.address,
  }));
}
