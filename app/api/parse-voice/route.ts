import { NextRequest, NextResponse } from "next/server";
import { openai, extractReservationData } from "@/lib/openai";
import connect from "@/lib/data";
import Office from "@/model/office";
import Category from "@/model/category";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log("🎙️ [API] Voice parse request received");

  try {
    // Parse request - support both JSON (old) and FormData (new with audio)
    const contentType = request.headers.get("content-type");
    console.log("📝 [API] Content-Type:", contentType);

    let transcript = "";
    let autoSubmit = false;

    if (contentType?.includes("multipart/form-data")) {
      // New: Audio upload
      console.log("🎧 [API] Processing audio file...");
      const formData = await request.formData();
      const audioFile = formData.get("audio") as File;
      autoSubmit = formData.get("autoSubmit") === "true";

      if (!audioFile) {
        console.error("❌ [API] No audio file provided");
        return NextResponse.json(
          { success: false, error: "No audio file provided" },
          { status: 400 }
        );
      }

      console.log(`📊 [API] Audio file size: ${audioFile.size} bytes`);
      console.log("🎙️ [API] Transcribing with Whisper...");

      // Transcribe audio using Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: "en",
      });

      transcript = transcription.text;
      console.log(`✅ [API] Transcription complete: "${transcript}"`);
    } else {
      // Old: Direct transcript
      const body = await request.json();
      transcript = body.transcript;
      autoSubmit = body.autoSubmit || false;
    }

    // Connect to DB and fetch available offices and categories
    console.log("📊 [API] Fetching offices and categories from DB...");
    await connect();
    const [offices, categories] = await Promise.all([
      Office.find({}).select("_id name").lean(),
      Category.find({}).select("_id name").lean(),
    ]);
    console.log(
      `✅ [API] Found ${offices.length} offices and ${categories.length} categories`
    );

    // Extract structured data using GPT-4
    const systemPrompt = `You are a helpful assistant that extracts reservation details from natural language.

Available offices: ${offices
      .map((o: any) => `${o.name} (ID: ${o._id})`)
      .join(", ")}
Available categories: ${categories
      .map((c: any) => `${c.name} (ID: ${c._id})`)
      .join(", ")}

Extract the following information and return ONLY valid JSON:
{
  "office": "office_id_here",
  "category": "category_id_here", 
  "pickupDate": "YYYY-MM-DD",
  "returnDate": "YYYY-MM-DD",
  "pickupTime": "HH:MM",
  "returnTime": "HH:MM",
  "driverAge": 25,
  "message": "any additional notes"
}

Rules:
- Match office by name (e.g., "London" → find London office ID)
- Match category by keywords (e.g., "van", "small van", "large van" → find matching category)
- Parse relative dates: "tomorrow" = next day, "next Monday" = following Monday
- Parse times: "10am" → "10:00", "5pm" → "17:00"
- Default pickup time: "10:00", return time: "10:00"
- Only include fields that are mentioned. Use null for missing fields.`;

    console.log("🤖 [API] Sending to GPT-4o-mini for extraction...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use "gpt-4o" for better accuracy
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content;
    const parsedData = result ? JSON.parse(result) : {};

    console.log("✅ [API] GPT extraction complete:", parsedData);

    // Detect missing required fields (matching reservation model)
    const requiredFields: (keyof typeof normalizedData)[] = [
      "office", // Required in model
      "category", // Required in model
      "startDate", // Required in model (pickup date)
      "endDate", // Required in model (return date)
      "driverAge", // Required in model
    ];

    // Map old field names to new ones for backwards compatibility
    const normalizedData: {
      office: any;
      category: any;
      startDate: any;
      endDate: any;
      startTime: any;
      endTime: any;
      driverAge: any;
      message: any;
    } = {
      office: parsedData.office,
      category: parsedData.category,
      startDate: parsedData.startDate || parsedData.pickupDate,
      endDate: parsedData.endDate || parsedData.returnDate,
      startTime: parsedData.startTime || parsedData.pickupTime || "10:00",
      endTime: parsedData.endTime || parsedData.returnTime || "10:00",
      driverAge: parsedData.driverAge,
      message: parsedData.message || "",
    };

    const missingFields = requiredFields.filter(
      (field) => !normalizedData[field]
    );

    if (missingFields.length > 0) {
      console.warn("⚠️ [API] Missing required fields:", missingFields);
    }

    console.log("📋 [API] Normalized data:", normalizedData);

    const processingTime = Date.now() - startTime;
    console.log(`⏱️ [API] Total processing time: ${processingTime}ms`);

    // If autoSubmit is enabled and we have enough data, create reservation
    if (
      autoSubmit &&
      parsedData.office &&
      parsedData.category &&
      parsedData.pickupDate &&
      parsedData.returnDate
    ) {
      console.log(
        "🚀 [API] Auto-submit enabled and all required fields present"
      );
      // Here you would call your reservation API
      // For now, just return the data with autoSubmit flag
      return NextResponse.json({
        success: true,
        transcript,
        data: parsedData,
        missingFields: [],
        autoSubmit: true,
        message: "Ready to create reservation",
      });
    }

    console.log("✅ [API] Returning extracted data for form filling");

    // Return extracted data for form filling
    return NextResponse.json({
      success: true,
      transcript,
      data: normalizedData,
      missingFields,
      autoSubmit: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const processingTime = Date.now() - startTime;
    console.error("❌ [API] Error parsing voice:", error);
    console.error(`⏱️ [API] Failed after ${processingTime}ms`);
    return NextResponse.json(
      {
        success: false,
        error: message || "Failed to process voice input",
      },
      { status: 500 }
    );
  }
}
