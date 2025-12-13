import { NextRequest, NextResponse } from "next/server";
import { conversationalReservation, textToSpeech } from "@/lib/openai";
import connect from "@/lib/data";
import Office from "@/model/office";
import Category from "@/model/category";

export async function POST(request: NextRequest) {
  console.log("💬 [Conversation API] Received conversation request");

  try {
    const body = await request.json();
    const { transcript, currentData = {}, conversationHistory = [] } = body;

    console.log("📝 [Conversation API] Transcript:", transcript);
    console.log("📋 [Conversation API] Current data:", currentData);

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: "Transcript is required" },
        { status: 400 }
      );
    }

    // Get offices and categories from database
    await connect();
    const offices = await Office.find({}).select("_id name").lean();
    const categories = await Category.find({}).select("_id name").lean();

    console.log(`📍 [Conversation API] Loaded ${offices.length} offices and ${categories.length} categories`);

    // Format data for the function
    const formattedOffices = offices.map((o: any) => ({
      _id: o._id.toString(),
      name: o.name,
    }));
    const formattedCategories = categories.map((c: any) => ({
      _id: c._id.toString(),
      name: c.name,
    }));

    // Get AI response
    const aiResponse = await conversationalReservation(
      transcript,
      currentData,
      formattedOffices,
      formattedCategories,
      conversationHistory
    );

    console.log("✅ [Conversation API] AI response:", aiResponse.message);
    console.log("📊 [Conversation API] Is complete:", aiResponse.isComplete);
    console.log("🔍 [Conversation API] Missing fields:", aiResponse.missingFields);

    // Convert AI message to speech
    console.log("🔊 [Conversation API] Generating speech...");
    const audioBuffer = await textToSpeech(aiResponse.message);
    const audioBase64 = audioBuffer.toString("base64");

    console.log("✅ [Conversation API] Speech generated, size:", audioBuffer.length, "bytes");

    return NextResponse.json({
      success: true,
      message: aiResponse.message,
      audio: audioBase64, // Base64 encoded audio
      data: aiResponse.data,
      missingFields: aiResponse.missingFields,
      isComplete: aiResponse.isComplete,
      action: aiResponse.action,
    });
  } catch (error: any) {
    console.error("❌ [Conversation API] Error:", error);
    console.error("❌ [Conversation API] Stack:", error.stack);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process conversation",
      },
      { status: 500 }
    );
  }
}
