"use client";

import { useState, useEffect, useRef } from "react";
import {
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
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import CategoryReport from "./reports/CategoryReport";
import OfficeReport from "./reports/OfficeReport";
import VehicleReservationReport from "./reports/VehicleReservationReport";
import ReservationReport from "./reports/ReservationReport";
import CustomerReport from "./reports/CustomerReport";
import AddOnReport from "./reports/AddOnReport";

interface Report {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const reports: Report[] = [
  {
    id: "categories",
    name: "Categories  ",
    description: "Revenue and usage by vehicle category",
    icon: <FiBarChart2 className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "offices",
    name: "Offices  ",
    description: "Performance analysis across all branches",
    icon: <FiHome className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "reservations",
    name: "Reservations  ",
    description: "Detailed booking history and trends",
    icon: <FiClipboard className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "vehicles",
    name: "Vehicle  ",
    description: "Fleet utilization and revenue per vehicle",
    icon: <FiTruck className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "customers",
    name: "Customers  ",
    description: "Customer behavior and loyalty insights",
    icon: <FiUsers className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "addons",
    name: "Add-Ons  ",
    description: "Extra services usage and revenue",
    icon: <FiGift className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
  },
];

export default function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentReport = reports.find((r) => r.id === selectedReport);

  const { isRecording, toggleRecording } = useVoiceRecording({
    onTranscriptionComplete: async (result) => {
      setInputMessage(result.transcript);
      await handleSendMessage(result.transcript);
    },
    autoSubmit: false,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (showAIModal && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hello! I'm your AI Business Analyst. Ask me anything about sales, customers, vehicles, or trends — I'll analyze your data and give clear insights.",
        },
      ]);
    }
  }, [showAIModal, messages.length]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/business-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, conversationHistory }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.data.message },
        ]);
        setConversationHistory(data.data.conversationHistory);
        await playAudioResponse(data.data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
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

      if (audioRef.current) audioRef.current.pause();

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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-[#0f172b] to-slate-900">
      <div className="max-w-8xl mx-auto   py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Business Intelligence Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Real-time insights and analytics for smarter decisions
            </p>
          </div>
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-3 px-6 py-4 bg-linear-to-r from-[#fe9a00] to-[#ff8800] hover:from-[#ff8800] hover:to-[#fe9a00] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#fe9a00]/20 transition-all transform hover:scale-105"
          >
            <FiMessageCircle className="w-6 h-6" />
            Talk to AI Analyst
          </button>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-12">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`group relative overflow-hidden rounded-3xl p-3 text-left transition-all duration-500 transform hover:scale-105 ${
                selectedReport === report.id
                  ? "ring-2 ring-[#fe9a00] ring-offset-4 ring-offset-slate-900 shadow-2xl"
                  : "hover:shadow-2xl"
              }`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${report.color} opacity-10 group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative z-10">
                <div
                  className={`inline-flex p-2 rounded-2xl bg-linear-to-br ${report.color} text-white mb-6 shadow-lg`}
                >
                  {report.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {report.name}
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {report.description}
                </p>
                {selectedReport === report.id && (
                  <div className="mt-6 flex items-center gap-2 text-xs text-[#fe9a00] font-semibold">
                    <FiTrendingUp />
                    <span>Viewing Report</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#fe9a00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Selected Report Content */}
        {currentReport ? (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-6 mb-8">
              <div
                className={`p-5 rounded-3xl bg-linear-to-br ${currentReport.color} text-white shadow-xl`}
              >
                {currentReport.icon}
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">
                  {currentReport.name}
                </h2>
                <p className="text-gray-400 mt-1">
                  {currentReport.description}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-2xl p-2">
              {selectedReport === "categories" && <CategoryReport />}
              {selectedReport === "offices" && <OfficeReport />}
              {selectedReport === "vehicles" && <VehicleReservationReport />}
              {selectedReport === "reservations" && <ReservationReport />}
              {selectedReport === "customers" && <CustomerReport />}
              {selectedReport === "addons" && <AddOnReport />}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center">
            <div className="max-w-md mx-auto">
              <FiBarChart2 className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Welcome to Your Analytics Hub
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Select any report from the cards above to dive deep into your
                business performance. Use the AI Analyst for natural language
                questions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-linear-to-b from-slate-900 to-[#0f172b] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/20">
            <div className="bg-linear-to-r from-[#fe9a00] to-[#ff8800] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <FiDollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Business Analyst</h2>
                    <p className="text-orange-100">
                      Ask anything about your data
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAIModal(false);
                    stopAudio();
                  }}
                  className="p-3 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col h-[70vh]">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-lg rounded-3xl px-6 py-4 shadow-lg ${
                        msg.role === "user"
                          ? "bg-linear-to-r from-[#fe9a00] to-[#ff8800] text-white"
                          : "bg-white/10 text-white backdrop-blur-sm"
                      }`}
                    >
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-3xl px-6 py-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 border-t border-white/10">
                <div className="flex flex-wrap gap-3 mb-4">
                  {[
                    "Last month performance?",
                    "Top customers?",
                    "Most popular vehicle?",
                    "Revenue trend?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInputMessage(q)}
                      disabled={isLoading || isRecording}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={toggleRecording}
                    disabled={isLoading || isPlaying}
                    className={`p-4 rounded-2xl transition-all ${
                      isRecording
                        ? "bg-red-500 animate-pulse"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <FiMic className="w-6 h-6" />
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    placeholder="Ask about your business..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:ring-4 focus:ring-[#fe9a00]/20"
                    disabled={isLoading || isRecording}
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading || isRecording}
                    className="px-8 py-4 bg-linear-to-r from-[#fe9a00] to-[#ff8800] hover:from-[#ff8800] hover:to-[#fe9a00] rounded-2xl font-bold transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <FiLoader className="w-6 h-6 animate-spin" />
                    ) : (
                      <FiSend className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {(isRecording || isPlaying) && (
                  <p className="text-center text-sm text-gray-400 mt-3">
                    {isRecording && "🔴 Recording voice..."}
                    {isPlaying && "🔊 Playing response..."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
