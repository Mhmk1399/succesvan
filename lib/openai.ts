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

/**
 * Extract structured reservation data from text using GPT-4
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
  const systemPrompt = `You are a helpful assistant that extracts reservation details from natural language.
Available offices: ${offices.map((o) => `${o.name} (ID: ${o._id})`).join(", ")}
Available categories: ${categories.map((c) => `${c.name} (ID: ${c._id})`).join(", ")}

Extract the following information:
- office: ID of the office (match by name)
- category: ID of the category (match by name like "van", "car", "truck")
- pickupDate: ISO date string (if mentioned)
- returnDate: ISO date string (if mentioned)
- pickupTime: 24-hour format (HH:MM)
- returnTime: 24-hour format (HH:MM)
- driverAge: number between 25-70
- message: any additional notes

Parse relative dates like "tomorrow", "next Monday", "in 2 days" correctly.
Parse times like "10am", "5pm", "17:00" to 24-hour format.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Fast and cost-effective, upgrade to "gpt-4o" for better accuracy
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: transcript },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const result = completion.choices[0].message.content;
  return result ? JSON.parse(result) : {};
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

/**
 * Have a conversational interaction about the reservation
 * Analyzes the current data, asks for missing information, and reads back details
 * @param transcript - User's latest message
 * @param currentData - Current reservation data
 * @param offices - Available offices
 * @param categories - Available categories
 * @param conversationHistory - Previous conversation messages
 * @returns AI response and updated data
 */
export async function conversationalReservation(
  transcript: string,
  currentData: any,
  offices: Array<{ _id: string; name: string }>,
  categories: Array<{ _id: string; name: string }>,
  conversationHistory: Array<{ role: string; content: string }> = []
) {
  console.log("💬 [Conversation] Starting conversational turn");
  console.log("📝 [Conversation] User said:", transcript);
  console.log("📋 [Conversation] Current data:", currentData);

  const requiredFields = ["office", "category", "pickupDate", "returnDate", "driverAge"];
  const missingFields = requiredFields.filter((field) => !currentData[field]);

  const systemPrompt = `You are a friendly voice assistant helping users book van rentals. You have a warm, conversational tone.

Available offices: ${offices.map((o) => `${o.name} (ID: ${o._id})`).join(", ")}
Available categories: ${categories.map((c) => `${c.name} (ID: ${c._id})`).join(", ")}

IMPORTANT RULES:
1. ONLY extract information from what the user JUST said in their latest message
2. DO NOT assume or fill in information the user hasn't provided yet
3. Ask for EXACTLY ONE missing field at a time - never ask multiple questions
4. Follow this exact order: office → category → pickupDate → returnDate → driverAge → confirm
5. Keep responses VERY brief (1-2 sentences max) - this will be spoken aloud
6. NEVER skip ahead - complete each step before moving to the next

Required fields (in order): office, category, pickupDate, returnDate, driverAge
Optional fields: pickupTime, returnTime, message

Current reservation data: ${JSON.stringify(currentData, null, 2)}
Missing required fields: ${missingFields.length > 0 ? missingFields.join(", ") : "None - ready to confirm!"}

STEP-BY-STEP PROCESS:
- If office is missing: Ask ONLY for office, then STOP
- If office exists but category is missing: Ask ONLY for category, then STOP  
- If category exists but pickupDate is missing: Ask ONLY for pickup date, then STOP
- If pickupDate exists but returnDate is missing: Ask ONLY for return date, then STOP
- If returnDate exists but driverAge is missing: Ask ONLY for driver age, then STOP
- If ALL fields exist: Read back the complete booking and ask for confirmation

Response format (JSON):
{
  "message": "What you say to the user (friendly, SHORT - max 15 words)",
  "data": { /* ONLY update the field the user just provided, keep everything else unchanged */ },
  "missingFields": ["list", "of", "missing", "required", "fields"],
  "isComplete": boolean, /* ONLY true if user confirmed AND all fields are filled */
  "action": "ask" | "confirm" | "update"
}

EXAMPLE - DO THIS:
User: "Hendon office"
Response: {"message": "Great! What size van do you need?", "data": {"office": "hendon_id"}, "missingFields": ["category", "pickupDate", "returnDate", "driverAge"], "isComplete": false, "action": "ask"}

EXAMPLE - DON'T DO THIS:
User: "Hendon office" 
Response: {"message": "Great! What size van and when do you need it?", ...} ❌ WRONG - asking 2 questions

Guidelines:
- Parse dates: "tomorrow" = today+1, "next Monday", "December 15th"
- Parse times: "9am" = "09:00", "5pm" = "17:00"
- Match office/category by name (case-insensitive, fuzzy match ok)
- Default pickup/return time to "10:00" if not specified
- Be conversational but BRIEF: "Perfect! When do you need it?" not "Great! And what date would you like to pick up the van?"
- When confirming, read back ALL details in ONE sentence: "Large van from Hendon, December 14th 9 AM to December 17th 5 PM, age 28. Correct?"`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: transcript },
  ];

  console.log("🤖 [Conversation] Sending to GPT with", messages.length, "messages");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages as any,
    response_format: { type: "json_object" },
    temperature: 0.3, // Lower temperature for more predictable, focused responses
  });

  const result = completion.choices[0].message.content;
  const response = result ? JSON.parse(result) : {};

  console.log("✅ [Conversation] GPT response:", response);

  // Merge data carefully - only update fields that are new or changed
  const mergedData = { ...currentData };
  
  // Only update if GPT provided new data
  if (response.data) {
    // Check which field was likely just provided
    Object.keys(response.data).forEach((key) => {
      if (response.data[key] && response.data[key] !== currentData[key]) {
        mergedData[key] = response.data[key];
        console.log(`📝 [Conversation] Updated ${key}:`, response.data[key]);
      }
    });
  }

  // Recalculate missing fields based on merged data
  const actualMissingFields = requiredFields.filter((field) => !mergedData[field]);
  
  console.log("📊 [Conversation] Current state:");
  console.log("  - Filled fields:", Object.keys(mergedData).filter(k => mergedData[k]));
  console.log("  - Missing fields:", actualMissingFields);
  console.log("  - Is complete:", actualMissingFields.length === 0);

  // Determine if truly complete (all required fields filled)
  const isActuallyComplete = actualMissingFields.length === 0 && response.action === "confirm";

  return {
    message: response.message || "I didn't quite catch that. Could you repeat?",
    data: mergedData, // Use merged data instead of GPT's data directly
    missingFields: actualMissingFields, // Use actual missing fields
    isComplete: isActuallyComplete, // More strict completion check
    action: actualMissingFields.length === 0 ? "confirm" : "ask",
  };
}
