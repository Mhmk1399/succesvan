import OpenAI from "openai";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribe audio using Whisper API
 * @param audioBlob - The audio file blob
 * @returns Transcribed text
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const file = new File([audioBlob], "audio.webm", { type: audioBlob.type });
  
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
    language: "en", // optional: specify language for better accuracy
  });

  return transcription.text;
}

// ============================================================================
// QUICK VOICE AGENT - One-shot extraction strategy
// ============================================================================
// Strategy: Extract ALL information from a single user utterance
// Use case: User says everything at once, wants fast form-fill
// Behavior: Aggressive extraction, tries to get as much data as possible
// Temperature: 0.3 (balanced extraction)

/**
 * Extract structured reservation data from text using GPT-4
 * ONE-SHOT EXTRACTION - gets all info at once from user's statement
 * @param transcript - The transcribed text
 * @param offices - Available offices
 * @param categories - Available categories
 * @returns Structured reservation data
 */
export async function extractReservationData(
  transcript: string,
  offices: Array<{ _id: string; name: string }>,
  categories: Array<{ _id: string; name: string }>
) {
  console.log("🚀 [Quick Voice Agent] Processing one-shot extraction");
  console.log("📝 [Quick Voice Agent] Transcript:", transcript);
  
  const systemPrompt = `You are a QUICK EXTRACTION assistant. Your job is to extract ALL reservation details from the user's statement in ONE GO.

STRATEGY: Extract everything possible from what the user said - be thorough and extract all mentioned details.

Available offices: ${offices.map((o) => `${o.name} (ID: ${o._id})`).join(", ")}
Available categories: ${categories.map((c) => `${c.name} (ID: ${c._id})`).join(", ")}

Extract the following information (matching the database schema):

REQUIRED FIELDS (match these EXACTLY to what user said):
- office: ID of the office (match by name, case-insensitive, fuzzy matching OK)
- category: ID of the category (match by name: "van", "car", "truck", "small", "medium", "large")
- startDate: ISO date string (this is the pickup date)
- endDate: ISO date string (this is the return date)
- driverAge: number between 18-99

OPTIONAL FIELDS (extract if mentioned):
- startTime: 24-hour format HH:MM (pickup time, default "10:00" if not specified)
- endTime: 24-hour format HH:MM (return time, default "10:00" if not specified)
- message: any additional notes or special requests

EXTRACTION RULES:
- Extract EVERYTHING the user mentioned - don't leave anything out
- Be aggressive with fuzzy matching (e.g., "Hendon" matches "Hendon office")
- Parse relative dates: "tomorrow" = today+1 day, "next Monday", "in 2 days", "December 15th"
- Parse times: "9am" = "09:00", "5pm" = "17:00", "noon" = "12:00", "midnight" = "00:00"
- If no time specified, use "10:00" for both startTime and endTime
- Today is ${new Date().toISOString().split('T')[0]}
- Return ONLY the fields the user actually mentioned
- If user says multiple things, extract ALL of them

EXAMPLES:
Input: "I need a large van from Hendon tomorrow at 9am returning Sunday at 5pm, I'm 28"
Output: {"office": "hendon_id", "category": "large_id", "startDate": "2025-12-14", "endDate": "2025-12-21", "startTime": "09:00", "endTime": "17:00", "driverAge": 28}

Input: "Medium van from Mill Hill"
Output: {"office": "millhill_id", "category": "medium_id"}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: transcript },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3, // Balanced for accurate extraction
  });

  const result = completion.choices[0].message.content;
  const extracted = result ? JSON.parse(result) : {};
  
  console.log("✅ [Quick Voice Agent] Extracted data:", extracted);
  return extracted;
}

/**
 * Process voice input and create reservation
 * @param audioBlob - The audio file
 * @param offices - Available offices
 * @param categories - Available categories
 * @param autoSubmit - Whether to automatically create the reservation
 * @returns Reservation data or booking confirmation
 */
export async function processVoiceReservation(
  audioBlob: Blob,
  offices: Array<{ _id: string; name: string }>,
  categories: Array<{ _id: string; name: string }>,
  autoSubmit: boolean = false
) {
  // Step 1: Transcribe audio
  const transcript = await transcribeAudio(audioBlob);

  // Step 2: Extract structured data
  const reservationData = await extractReservationData(
    transcript,
    offices,
    categories
  );

  // Step 3: If autoSubmit is enabled, use function calling to create reservation
  if (autoSubmit) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a reservation assistant. Based on the user's request, create a reservation by calling the createReservation function.`,
        },
        {
          role: "user",
          content: `Create a reservation based on this request: ${transcript}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "createReservation",
            description: "Create a new vehicle reservation",
            parameters: {
              type: "object",
              properties: {
                office: { type: "string", description: "Office ID" },
                category: { type: "string", description: "Category ID" },
                pickupDate: { type: "string", description: "ISO date string" },
                returnDate: { type: "string", description: "ISO date string" },
                pickupTime: { type: "string", description: "HH:MM format" },
                returnTime: { type: "string", description: "HH:MM format" },
                driverAge: { type: "number", description: "Driver age" },
                message: { type: "string", description: "Additional notes" },
              },
              required: ["office", "category", "pickupDate", "returnDate", "driverAge"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const toolCall = completion.choices[0].message.tool_calls?.[0];
    if (toolCall && "function" in toolCall && toolCall.function.name === "createReservation") {
      return {
        transcript,
        data: JSON.parse(toolCall.function.arguments),
        autoSubmit: true,
      };
    }
  }

  return {
    transcript,
    data: reservationData,
    autoSubmit: false,
  };
}

/**
 * Convert text to speech using OpenAI TTS API
 * @param text - The text to convert to speech
 * @returns Audio buffer
 */
export async function textToSpeech(text: string): Promise<Buffer> {
  console.log("🔊 [TTS] Converting text to speech:", text.substring(0, 100) + "...");
  
  const mp3 = await openai.audio.speech.create({
    model: "tts-1", // Use "tts-1-hd" for higher quality
    voice: "alloy", // Options: alloy, echo, fable, onyx, nova, shimmer
    input: text,
    speed: 1.0,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  console.log("✅ [TTS] Audio generated, size:", buffer.length, "bytes");
  
  return buffer;
}

// ============================================================================
// CONVERSATIONAL VOICE AGENT - Step-by-step guided strategy
// ============================================================================
// Strategy: Ask ONE question at a time, guide user through booking process
// Use case: User wants to talk naturally, needs help with booking
// Behavior: Patient, conversational, asks follow-up questions
// Temperature: 0.2 (very predictable, focused responses)

/**
 * Have a conversational interaction about the reservation
 * STEP-BY-STEP CONVERSATION - asks one question at a time, guides user
 * @param transcript - User's latest message
 * @param currentData - Current reservation data
 * @param offices - Available offices
 * @param categories - Available categories
 * @param conversationHistory - Previous conversation messages
 * @param ragContext - Rich context about offices, categories, and availability
 * @returns AI response and updated data
 */
export async function conversationalReservation(
  transcript: string,
  currentData: any,
  offices: Array<{ _id: string; name: string }>,
  categories: Array<{ _id: string; name: string }>,
  conversationHistory: Array<{ role: string; content: string }> = [],
  ragContext?: string
) {
  console.log("💬 [Conversational Agent] Starting conversation turn");
  console.log("📝 [Conversational Agent] User said:", transcript);
  console.log("📋 [Conversational Agent] Current data:", currentData);

  // Handle initial greeting when user opens modal
  if (transcript.toLowerCase() === "start" && conversationHistory.length === 0) {
    // Build greeting with actual office details from RAG if available
    let greetingMessage = "Hi my friend! I'm here to help you hire a van. ";
    
    if (ragContext && ragContext.includes("AVAILABLE OFFICES")) {
      // Extract office names and key details from RAG
      greetingMessage += "Tell me which office you want to pick up from:\n";
      for (const office of offices) {
        greetingMessage += `- ${office.name}\n`;
      }
      greetingMessage += "Which one would you like?";
    } else {
      // Fallback if RAG not available
      const officeList = offices.map(o => o.name).join(", ");
      greetingMessage += `Tell me which office you want to pick up from: ${officeList}.`;
    }
    
    console.log("👋 [Conversational Agent] Sending initial greeting with RAG context");
    
    return {
      message: greetingMessage,
      data: {},
      missingFields: ["office", "category", "startDate", "endDate", "driverAge"],
      isComplete: false,
      action: "ask",
    };
  }

  // Required fields matching the reservation model schema
  const requiredFields = [
    "office",      // Required: Office ObjectId
    "category",    // Required: Category ObjectId
    "startDate",   // Required: Pickup date (maps to startDate in DB)
    "endDate",     // Required: Return date (maps to endDate in DB)
    "driverAge"    // Required: Driver age (maps to dirverAge in DB - note the typo in model)
  ];
  
  // Normalize field names for backwards compatibility
  const normalizedData: any = {
    office: currentData.office,
    category: currentData.category,
    startDate: currentData.startDate || currentData.pickupDate,
    endDate: currentData.endDate || currentData.returnDate,
    startTime: currentData.startTime || currentData.pickupTime || "10:00",
    endTime: currentData.endTime || currentData.returnTime || "10:00",
    driverAge: currentData.driverAge,
    message: currentData.message || "",
  };
  
  const missingFields = requiredFields.filter((field) => !normalizedData[field]);

  // Build system prompt with RAG context
  let systemPrompt = "";
  
  // Add RAG context if available
  if (ragContext) {
    systemPrompt += ragContext + "\n\n";
    systemPrompt += "---\n\n";
  }
  
  systemPrompt += `You are a friendly CONVERSATIONAL voice assistant helping users book van rentals. You guide them step-by-step.

STRATEGY: Extract ALL information from user's message, then ask for ONLY what's missing. Be efficient and conversational.

Available offices: ${offices.map((o) => `${o.name} (ID: ${o._id})`).join(", ")}
Available categories: ${categories.map((c) => `${c.name} (ID: ${c._id})`).join(", ")}

IMPORTANT: When asking about offices or categories, ALWAYS list the available options.

CRITICAL RULES:
1. EXTRACT EVERYTHING the user mentioned in their message (office, category, dates, times, age)
2. If user says ANYTHING related to office, category, dates, or age - extract it!
3. Ask for missing fields in ONE question when possible: "What dates and how old are you?"
4. Keep responses brief (15-20 words max) - this will be spoken aloud
5. Be warm, conversational, and efficient
6. Priority order: office → category → dates → age → confirm

REQUIRED FIELDS (matching database schema):
1. office - Which office/location (ObjectId reference)
2. category - Van size/type (ObjectId reference)  
3. startDate - Pickup date (stored as startDate in DB)
4. endDate - Return date (stored as endDate in DB)
5. driverAge - Driver's age (stored as dirverAge in DB)

OPTIONAL FIELDS:
- startTime - Pickup time (default: 10:00)
- endTime - Return time (default: 10:00)
- message - Special requests or notes

Current reservation data: ${JSON.stringify(normalizedData, null, 2)}
Missing required fields: ${missingFields.length > 0 ? missingFields.join(", ") : "None - ready to confirm!"}

${ragContext ? "NOTE: Use the detailed information from the COMPREHENSIVE BOOKING INFORMATION section above to answer user questions about offices, categories, hours, pricing, and availability." : ""}

EFFICIENT EXTRACTION PROCESS:
- ALWAYS extract EVERYTHING mentioned: If user says "I need a van tomorrow", extract category AND startDate
- If office missing: List offices and ask which one
- If category missing: List categories with features and ask which one
- If dates/age missing: Ask "When do you need it and how old are you?" (ask both together)
- If only 1-2 fields missing: Ask for them together in one question
- If ALL 5 required fields exist: Read back booking and ask "Is this correct?"
- User must say YES/CORRECT/SOUNDS GOOD to confirm

Response format (JSON):
{
  "message": "What you say to the user (friendly, SHORT - max 15 words)",
  "data": { 
    /* ONLY update the ONE field the user just provided - don't fill in other fields */
    /* Use these exact field names: office, category, startDate, endDate, startTime, endTime, driverAge, message */
  },
  "missingFields": ["list", "of", "missing", "required", "fields"],
  "isComplete": boolean, /* ONLY true if user confirmed with yes/correct AND all 5 required fields are filled */
  "action": "ask" | "confirm" | "update"
}

EFFICIENT CONVERSATION EXAMPLES:

Turn 1:
User: "I need a van tomorrow, I'm 28"
Assistant: {"message": "Great! Which office: Compton or FEF? And when will you return it?", "data": {"category": "van_id", "startDate": "2025-12-14", "driverAge": 28}, "missingFields": ["office", "endDate"], "isComplete": false, "action": "ask"}

Turn 2:
User: "Compton, return Sunday"
Assistant: {"message": "Van from Compton, Dec 14-21, age 28. Correct?", "data": {"office": "compton_id", "endDate": "2025-12-21"}, "missingFields": [], "isComplete": false, "action": "confirm"}

Turn 3:
User: "Yes"
Assistant: {"message": "Perfect! Booking confirmed.", "data": {}, "missingFields": [], "isComplete": true, "action": "confirm"}

EXAMPLE 2:
Turn 1:
User: "I want to choose Compton"
Assistant: {"message": "Perfect! What vehicle and when do you need it? I'm 28 years old", "data": {"office": "compton_id"}, "missingFields": ["category", "startDate", "endDate", "driverAge"], "isComplete": false, "action": "ask"}

Turn 2:
User: "Car, tomorrow to Sunday, I'm 25"
Assistant: {"message": "Car from Compton, Dec 14-21, age 25. Correct?", "data": {"category": "car_id", "startDate": "2025-12-14", "endDate": "2025-12-21", "driverAge": 25}, "missingFields": [], "isComplete": false, "action": "confirm"}

BAD EXAMPLES (DON'T DO THIS):
❌ "Great! What size van and when do you need it?" - asking 2 questions
❌ "Which office, what size van, and when?" - asking 3 questions
❌ Filling in fields the user didn't mention
❌ Skipping from office to startDate (must ask category first)

Guidelines:
- REMEMBER: Current reservation data shows what's ALREADY filled - don't ask for it again!
- If office is already in currentData, DON'T ask for it - move to category
- If category is already filled, DON'T ask for it - move to dates
- Extract MULTIPLE fields from one user message when possible
- USE THE COMPREHENSIVE BOOKING INFORMATION to provide accurate answers
- When listing categories, mention key features like fuel type, seats, or price range
- Parse dates: "tomorrow" = ${new Date(Date.now() + 86400000).toISOString().split('T')[0]}, "next Monday", "December 15th"
- Parse times: "9am" = "09:00", "5pm" = "17:00", default "10:00"
- Match office/category by name (case-insensitive, fuzzy match ok)
- Use startDate/endDate (NOT pickupDate/returnDate)
- Be conversational but BRIEF: "Perfect! When do you need it?" not "Great! And what date would you like to pick up the van?"
- When confirming, read back ALL details in one SHORT sentence`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: transcript },
  ];

  console.log("🤖 [Conversational Agent] Sending to GPT with", messages.length, "messages");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages as any,
    response_format: { type: "json_object" },
    temperature: 0.2, // VERY low temperature for predictable, focused responses
  });

  const result = completion.choices[0].message.content;
  const response = result ? JSON.parse(result) : {};

  console.log("✅ [Conversational Agent] GPT response:", response);

  // Merge data carefully - only update fields that are new or changed
  const mergedData = { ...normalizedData };
  
  // Only update if GPT provided new data
  if (response.data) {
    // Check which field was likely just provided
    Object.keys(response.data).forEach((key) => {
      if (response.data[key] && response.data[key] !== currentData[key]) {
        mergedData[key] = response.data[key];
        console.log(`📝 [Conversational Agent] Updated ${key}:`, response.data[key]);
      }
    });
  }

  // Recalculate missing fields based on merged data
  const actualMissingFields = requiredFields.filter((field) => !mergedData[field]);
  
  console.log("📊 [Conversational Agent] Current state:");
  console.log("  - Current data:", mergedData);
  console.log("  - Filled required fields:", requiredFields.filter(f => mergedData[f]));
  console.log("  - Missing required fields:", actualMissingFields);
  console.log("  - All required fields filled:", actualMissingFields.length === 0);

  // Determine if truly complete (all required fields filled AND user confirmed)
  const isActuallyComplete = actualMissingFields.length === 0 && response.isComplete === true;

  return {
    message: response.message || "I didn't quite catch that. Could you repeat?",
    data: mergedData,
    missingFields: actualMissingFields,
    isComplete: isActuallyComplete,
    action: actualMissingFields.length === 0 ? "confirm" : "ask",
  };
}
