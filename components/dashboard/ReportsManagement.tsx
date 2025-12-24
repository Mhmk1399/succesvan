"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiChevronDown,
  FiBarChart2,
  FiHome,
  FiClipboard,
  FiTruck,
  FiUsers,
  FiGift,
  FiMessageCircle,
  FiX,
  FiMic,
  FiSend,
  FiLoader,
  FiVolume2,
} from "react-icons/fi";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import CategoryReport from "./reports/CategoryReport";
import OfficeReport from "./reports/OfficeReport";
import DefaultReport from "./reports/DefaultReport";
import VehicleReservationReport from "./reports/VehicleReservationReport";
import ReservationReport from "./reports/ReservationReport";
import CustomerReport from "./reports/CustomerReport";
import AddOnReport from "./reports/AddOnReport";

interface Report {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const reports: Report[] = [
  {
    id: "categories",
    name: "Categories Report",
    description: "Most/least used categories with revenue analysis",
    icon: <FiBarChart2 />,
  },
  {
    id: "offices",
    name: "Offices Report",
    description: "Most/least used offices with revenue analysis",
    icon: <FiHome />,
  },
  {
    id: "reservations",
    name: "Reservations Report",
    description: "Top price reservations with customer and category details",
    icon: <FiClipboard />,
  },
  {
    id: "vehicles",
    name: "Vehicle Reservations Report",
    description: "Vehicles with reservation counts and details",
    icon: <FiTruck />,
  },
  {
    id: "customers",
    name: "Customers Report",
    description: "Most/least reserved users, revenue, and monthly stats",
    icon: <FiUsers />,
  },
  {
    id: "addons",
    name: "Add-Ons Report",
    description:
      "Most used add-ons, customer preferences, and revenue analysis",
    icon: <FiGift />,
  },
];

export default function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleViewReport = (reportId: string) => {
    setSelectedReport(reportId);
    setIsDropdownOpen(false);
  };

  const currentReport = reports.find((r) => r.id === selectedReport);

  // Voice recording hook
  const { isRecording, toggleRecording } = useVoiceRecording({
    onTranscriptionComplete: async (result) => {
      console.log("🎤 Transcribed:", result.transcript);
      setInputMessage(result.transcript);
      // Auto-send the transcribed message
      await handleSendMessage(result.transcript);
    },
    autoSubmit: false,
  });

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show initial greeting when modal opens
  useEffect(() => {
    if (showAIModal && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hi! I'm your AI Business Analyst. I can help you understand your business data, analyze trends, and provide insights. What would you like to know?",
        },
      ]);
    }
  }, [showAIModal, messages.length]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isLoading) return;

    // Add user message
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call the business analyst API
      const response = await fetch("/api/business-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant response
        setMessages([...newMessages, { role: "assistant", content: data.data.message }]);
        setConversationHistory(data.data.conversationHistory);

        // Play audio response
        await playAudioResponse(data.data.message);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudioResponse = async (text: string) => {
    try {
      setIsPlaying(true);
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Business Reports</h1>
        <button
          onClick={() => setShowAIModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#fe9a00] hover:bg-[#ff8800] text-white rounded-xl font-semibold transition-all"
        >
          <FiMessageCircle className="w-5 h-5" />
          Ask AI Analyst
        </button>
      </div>

      {/* AI Business Analyst Modal (top-level) */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f172b] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/10">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#fe9a00] to-[#ff8800] text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FiBarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">AI Business Analyst</h2>
                    <p className="text-orange-100 text-sm">Ask me anything about your business data</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAIModal(false);
                    stopAudio();
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="max-h-[calc(90vh-250px)] overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-[#fe9a00] text-white rounded-br-none"
                        : "bg-white/10 text-white rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-2.5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#0f172b]">
              {/* Status Indicator */}
              <div className="mb-2 text-center text-sm text-gray-400">
                {isRecording ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Recording...
                  </span>
                ) : isPlaying ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiVolume2 className="w-4 h-4" />
                    Playing response...
                    <button onClick={stopAudio} className="text-[#fe9a00] hover:underline">
                      Stop
                    </button>
                  </span>
                ) : (
                  "Type or use voice input"
                )}
              </div>

              {/* Quick Actions */}
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInputMessage("What happened last week?")}
                  disabled={isLoading || isRecording}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-lg transition-all disabled:opacity-50"
                >
                  Last week
                </button>
                <button
                  onClick={() => setInputMessage("Who are my best customers?")}
                  disabled={isLoading || isRecording}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-lg transition-all disabled:opacity-50"
                >
                  Best customers
                </button>
                <button
                  onClick={() => setInputMessage("Which vehicles are most used?")}
                  disabled={isLoading || isRecording}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-lg transition-all disabled:opacity-50"
                >
                  Vehicle usage
                </button>
                <button
                  onClick={() => setInputMessage("Compare this month to last month")}
                  disabled={isLoading || isRecording}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-lg transition-all disabled:opacity-50"
                >
                  Compare months
                </button>
              </div>

              {/* Input */}
              <div className="flex gap-3">
                {/* Mic Button */}
                <button
                  onClick={toggleRecording}
                  disabled={isLoading || isPlaying}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRecording
                      ? "bg-red-500 animate-pulse"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <FiMic className="w-5 h-5 text-white" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about your business..."
                  disabled={isLoading || isRecording}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#fe9a00] disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim() || isRecording}
                  className="px-6 py-3 bg-[#fe9a00] hover:bg-[#ff8800] text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiSend className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Selector Dropdown */}
      <div className="relative w-full md:w-80">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <span className="font-semibold">
            {currentReport ? currentReport.name : "Select a Report"}
          </span>
          <FiChevronDown
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2847] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => handleViewReport(report.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  selectedReport === report.id
                    ? "bg-[#fe9a00]/20 text-[#fe9a00]"
                    : "text-white hover:bg-white/5"
                }`}
              >
                <span className="text-xl">{report.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{report.name}</p>
                  <p className="text-xs text-gray-400">{report.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Report Content */}
      {currentReport ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{currentReport.icon}</span>
              <div>
                <h2 className="text-2xl font-black text-white">
                  {currentReport.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {currentReport.description}
                </p>
              </div>
            </div>
          </div>

          {selectedReport === "categories" ? (
            <CategoryReport />
          ) : selectedReport === "offices" ? (
            <OfficeReport />
          ) : selectedReport === "vehicles" ? (
            <VehicleReservationReport />
          ) : selectedReport === "reservations" ? (
            <ReservationReport />
          ) : selectedReport === "customers" ? (
            <CustomerReport />
          ) : selectedReport === "addons" ? (

      
            <AddOnReport />
          ) : (
            <DefaultReport reportName={currentReport.name} />
          )}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">
            Select a report from the dropdown to view details
          </p>
        </div>
      )}
    </div>
  );
}
