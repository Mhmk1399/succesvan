/**
 * Fast AI Agent API Route
 *
 * Streamlined booking flow that completes in ~1 minute
 */



import { NextRequest, NextResponse } from "next/server";
import {
  processFastAgent,
  createInitialFastState,
  getOfficesList,
  FastAgentState,
} from "@/lib/fast-agent";
import { textToSpeech } from "@/lib/openai";

export async function POST(request: NextRequest) {
  console.log("⚡ [Fast Agent API] Received request");

  try {
    const body = await request.json();
    const { message, state: clientState, action, includeAudio = true } = body;

    console.log("📝 Message:", message);
    console.log("🎯 Action:", action);
    console.log("📍 Phase:", clientState?.phase);

    // Use provided state or create initial
    const currentState: FastAgentState =
      clientState || createInitialFastState();

    // Process the agent turn
    const response = await processFastAgent(message, currentState, action);

    console.log("✅ [Fast Agent API] Response phase:", response.state.phase);
    console.log("📢 Message:", response.message);

    // Generate audio for the message (if requested and not too long)
    let audioBase64: string | undefined;
    if (includeAudio && response.message && response.message.length < 500) {
      try {
        const audioBuffer = await textToSpeech(response.message);
        audioBase64 = audioBuffer.toString("base64");
        console.log("🔊 Audio generated, base64 length:", audioBase64.length);
      } catch (audioError) {
        console.warn("⚠️ Audio generation failed:", audioError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...response,
        audio: audioBase64,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log("❌ [Fast Agent API] Error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch offices for the booking form
export async function GET() {
  try {
    const offices = await getOfficesList();
    return NextResponse.json({ success: true, data: { offices } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log("❌ [Fast Agent API] GET Error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
