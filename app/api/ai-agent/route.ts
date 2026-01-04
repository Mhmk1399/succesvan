import { NextRequest, NextResponse } from "next/server";
import {
  processAgentTurn,
  createInitialState,
  getInitialGreeting,
  ConversationState,
  ConversationMessage,
} from "@/lib/ai-agent";
import { textToSpeech } from "@/lib/openai";
import connect from "@/lib/data";

export async function POST(request: NextRequest) {
  console.log("🤖 [AI Agent API] Received request");

  try {
    const body = await request.json();
    const { transcript, currentState, conversationHistory = [] } = body;

    console.log("📝 [AI Agent API] Transcript:", transcript);
    console.log(
      "📍 [AI Agent API] Current phase:",
      currentState?.phase || "new"
    );
    console.log(
      "💬 [AI Agent API] History length:",
      conversationHistory.length
    );

    // Connect to database
    await connect();

    // Handle initial greeting
    if (
      transcript.toLowerCase() === "start" &&
      (!currentState || currentState.phase === "discovery")
    ) {
      console.log("👋 [AI Agent API] Sending initial greeting");

      const greeting = await getInitialGreeting();
      const audioBuffer = await textToSpeech(greeting);

      return NextResponse.json({
        success: true,
        message: greeting,
        audio: audioBuffer.toString("base64"),
        state: createInitialState(),
        action: "ask",
        isComplete: false,
      });
    }

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: "Transcript is required" },
        { status: 400 }
      );
    }

    // Use existing state or create new one
    const state: ConversationState = currentState || createInitialState();

    // Process the conversation turn
    const response = await processAgentTurn(
      transcript,
      state,
      conversationHistory as ConversationMessage[]
    );

    console.log("✅ [AI Agent API] Response:", response.message);
    console.log("📍 [AI Agent API] New phase:", response.state.phase);
    console.log("🎯 [AI Agent API] Complete:", response.isComplete);

    // Generate speech
    console.log("🔊 [AI Agent API] Generating speech...");
    const audioBuffer = await textToSpeech(response.message);

    console.log(
      "✅ [AI Agent API] Speech generated:",
      audioBuffer.length,
      "bytes"
    );

    return NextResponse.json({
      success: true,
      message: response.message,
      audio: audioBuffer.toString("base64"),
      state: response.state,
      action: response.action,
      isComplete: response.isComplete,
      reservationId: response.reservationId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log("❌ [AI Agent API] Stack:", message);

    return NextResponse.json(
      {
        success: false,
        error: message || "Failed to process request",
      },
      { status: 500 }
    );
  }
}
