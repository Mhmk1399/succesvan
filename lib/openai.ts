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
