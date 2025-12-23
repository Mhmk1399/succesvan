"use client";

import { useState, useRef, useEffect } from "react";
import { FiPhone, FiX, FiSend, FiLoader } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Success Van Hire assistant. How can I help you today? I can answer questions about our vehicles, pricing, locations, or booking process!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const menuItems = [
    {
      id: "ai-chat",
      icon: BsRobot,
      color: "#fe9a00",
      onClick: () => {
        setIsChatOpen(true);
        setIsOpen(false);
      },
      label: "AI Assistant",
    },
    {
      id: "call",
      icon: FiPhone,
      color: "#0496ff",
      href: "tel:+442030111198",
      label: "Call Us",
    },
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      color: "#25D366",
      href: "https://wa.me/442030111198",
      label: "WhatsApp",
    },
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: userMessage,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      
      if (data.success && data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again or contact us directly at 020 3011 1198.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (pathname === "/dashboard" || pathname === "/customerDashboard") {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            isOpen && (
              <div key={item.id} className="relative flex items-center">
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    style={{
                      background: `linear-linear(135deg, ${item.color})`,
                      boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <Icon size={20} className="text-white text-xl" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    target={item.id === "whatsapp" ? "_blank" : undefined}
                    rel={
                      item.id === "whatsapp" ? "noopener noreferrer" : undefined
                    }
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    style={{
                      background: `linear-linear(135deg, ${item.color})`,
                      boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <Icon size={20} className="text-white text-xl" />
                  </a>
                )}
                {hoveredItem === item.id && (
                  <div
                    style={{
                      background: `linear-linear(135deg, ${item.color})`,
                      boxShadow: "0 8px 30px rgba(254, 154, 0, 0.3)",
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                    className="absolute right-full mr-3 px-3 py-2   text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fadeIn"
                  >
                    {item.label}
                  </div>
                )}
              </div>
            )
          );
        })}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
          style={{
            background: "linear-linear(135deg, #fe9a00, #d97900)",
            boxShadow: "0 10px 40px rgba(254, 154, 0, 0.4)",
          }}
        >
          <div
            className={`absolute transition-all duration-300 ${
              isOpen
                ? "scale-0 opacity-0 rotate-180"
                : "scale-100 opacity-100 rotate-0"
            }`}
          >
            <FiPhone className="text-white text-2xl" />
          </div>

          <div
            className={`absolute transition-all duration-300 ${
              isOpen
                ? "scale-100 opacity-100 rotate-0"
                : "scale-0 opacity-0 rotate-180"
            }`}
          >
            <FiX className="text-white text-2xl" />
          </div>

          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>

      {/* AI Chat Modal */}
      {isChatOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9998"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="fixed bottom-4 right-4 z-9999 w-400px max-w-[calc(100vw-2rem)] h-600px max-h-[calc(100vh-2rem)] bg-linear-to-br from-[#0f172b] to-[#1e293b] rounded-2xl shadow-2xl border border-white/10 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-linear-to-r from-orange-500/10 to-orange-600/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <BsRobot className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">AI Assistant</h3>
                  <p className="text-gray-400 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-linear-to-br from-orange-500 to-orange-600 text-white"
                        : "bg-white/5 text-gray-200 border border-white/10"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FiLoader className="text-orange-400 animate-spin" />
                      <span className="text-gray-400 text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-orange-500 transition-colors">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about vans, pricing, locations..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiSend className="text-white" />
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2 text-center">
                Press Enter to send
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
