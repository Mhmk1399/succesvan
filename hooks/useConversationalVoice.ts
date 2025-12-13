"use client";

import { useState, useRef, useCallback } from "react";
import { showToast } from "@/lib/toast";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface ConversationResponse {
  message: string;
  audio: string; // Base64 encoded
  data: any;
  missingFields: string[];
  isComplete: boolean;
  action: "ask" | "confirm" | "update";
}

export function useConversationalVoice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [currentData, setCurrentData] = useState<any>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudioFromBase64 = useCallback((base64Audio: string) => {
    return new Promise<void>((resolve, reject) => {
      console.log("🔊 [Audio] Playing AI response");
      setIsPlaying(true);

      try {
        // Convert base64 to blob
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);

        // Create or reuse audio element
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        const audio = audioRef.current;
        audio.src = url;

        audio.onended = () => {
          console.log("✅ [Audio] Playback finished");
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          resolve();
        };

        audio.onerror = (error) => {
          console.error("❌ [Audio] Playback error:", error);
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          reject(error);
        };

        audio.play().catch((error) => {
          console.error("❌ [Audio] Failed to play:", error);
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          reject(error);
        });
      } catch (error) {
        console.error("❌ [Audio] Error creating audio:", error);
        setIsPlaying(false);
        reject(error);
      }
    });
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      console.log("⏹️ [Audio] Stopped");
    }
  }, []);

  const sendMessage = useCallback(
    async (transcript: string): Promise<ConversationResponse | null> => {
      console.log("💬 [Conversation Hook] Sending message:", transcript);

      try {
        // Add user message to history
        const newHistory: ConversationMessage[] = [
          ...conversationHistory,
          { role: "user", content: transcript },
        ];

        // Send to conversation API
        const response = await fetch("/api/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript,
            currentData,
            conversationHistory,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to process conversation");
        }

        console.log("✅ [Conversation Hook] Received response:", data.message);
        console.log("📊 [Conversation Hook] Data:", data.data);
        console.log("🎯 [Conversation Hook] Is complete:", data.isComplete);
        console.log("🔍 [Conversation Hook] Missing fields:", data.missingFields);
        console.log("🎬 [Conversation Hook] Action:", data.action);

        // Update conversation history with assistant response
        const updatedHistory: ConversationMessage[] = [
          ...newHistory,
          { role: "assistant", content: data.message },
        ];
        setConversationHistory(updatedHistory);

        // Update current data - merge carefully
        setCurrentData((prev: any) => {
          const merged = { ...prev, ...data.data };
          console.log("🔄 [Conversation Hook] Merged data:", merged);
          return merged;
        });

        // Play the audio response
        if (data.audio) {
          await playAudioFromBase64(data.audio);
        }

        return {
          message: data.message,
          audio: data.audio,
          data: data.data,
          missingFields: data.missingFields,
          isComplete: data.isComplete,
          action: data.action,
        };
      } catch (error: any) {
        console.error("❌ [Conversation Hook] Error:", error);
        showToast.error(error.message || "Failed to process conversation");
        return null;
      }
    },
    [conversationHistory, currentData, playAudioFromBase64]
  );

  const resetConversation = useCallback(() => {
    console.log("🔄 [Conversation Hook] Resetting conversation");
    setConversationHistory([]);
    setCurrentData({});
    stopAudio();
  }, [stopAudio]);

  return {
    isPlaying,
    conversationHistory,
    currentData,
    sendMessage,
    resetConversation,
    stopAudio,
  };
}
