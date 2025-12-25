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
      content:
        "Hi! I'm your Success Van Hire assistant. How can I help you today? I can answer questions about our vehicles, pricing, locations, or booking process!",
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
      color: "#fff",
      onClick: () => {
        setIsChatOpen(true);
        setIsOpen(false);
      },
      label: "AI Assistant",
    },
    {
      id: "call",
      icon: FiPhone,
      color: "#0891b2",
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // NEW: Lock background scroll when chat is open
  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isChatOpen]);

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
          content:
            "Sorry, I encountered an error. Please try again or contact us directly at 020 3011 1198.",
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
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end gap-4">
          {/* Menu Items */}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isVisible = isOpen;

            return (
              <div
                key={item.id}
                className={`relative flex items-center transition-all duration-500 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group relative w-12 h-12 bg-[#860a89] rounded-2xl flex items-center justify-center 
                               shadow-2xl transition-all duration-300 hover:scale-110 
                               hover:shadow-[0_0_30px_rgba(254,154,0,0.4)]`}
                  >
                    <Icon className="w-7 h-7 text-white drop-shadow-md" />
                    {/* Ripple effect */}
                    <span
                      className="absolute inset-0 rounded-2xl bg-white opacity-0 
                                     group-hover:opacity-20 group-hover:scale-150 
                                     transition-all duration-700"
                    />
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
                    className={`group relative w-12 h-12  ${
                      item.id === "whatsapp" ? "bg-[#25D366]" : "bg-[#0891b2]"
                    } rounded-2xl flex items-center justify-center 
                               shadow-2xl transition-all duration-300 hover:scale-110 
                               hover:shadow-[0_0_30px_rgba(254,154,0,0.4)]`}
                  >
                    <Icon className="w-7 h-7 text-white drop-shadow-md" />
                    <span
                      className="absolute inset-0 rounded-2xl bg-white opacity-0 
                                     group-hover:opacity-20 group-hover:scale-150 
                                     transition-all duration-700"
                    />
                  </a>
                )}

                {/* Tooltip */}
                {hoveredItem === item.id && (
                  <div
                    className="absolute right-full mr-4 px-4 py-2 bg-black/80 backdrop-blur-md 
                               text-white text-sm font-medium rounded-xl shadow-xl 
                               whitespace-nowrap pointer-events-none 
                               animate-in fade-in slide-in-from-right-2 duration-200"
                  >
                    {item.label}
                    <div
                      className="absolute left-full top-1/2 -translate-y-1/2 
                                    w-0 h-0 border-8 border-transparent 
                                    border-l-black/80"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Main Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative w-12 h-12 bg-[#fe9a00] rounded-2xl flex items-center justify-center 
                       shadow-2xl transition-all duration-500 hover:scale-110 
                       hover:shadow-[0_0_40px_rgba(254,154,0,0.6)]"
          >
            {/* Icons Crossfade */}
            <div
              className={`absolute transition-all duration-500 ${
                isOpen
                  ? "scale-0 rotate-180 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              }`}
            >
              <FiPhone className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <div
              className={`absolute transition-all duration-500 ${
                isOpen
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-0 -rotate-180 opacity-0"
              }`}
            >
              <FiX className="w-6 h-6 text-white drop-shadow-lg" />
            </div>

            {/* Glow Ring */}
            <span
              className="absolute inset-0 rounded-2xl bg-white opacity-0 
                             group-hover:opacity-30 group-hover:scale-150 
                             transition-all duration-700 blur-xl"
            />
          </button>
        </div>
      </div>

      {/* AI Chat Modal */}
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-9999 bg-black/70 backdrop-blur-md"
            onClick={() => setIsChatOpen(false)}
          />

          {/* Chat Window */}
          <div
            className="fixed bottom-24 right-6 z-9999 w-96 max-w-[calc(100vw-3rem)] 
                          h-145 max-h-[calc(100vh-10rem)] 
                          bg-linear-to-br from-slate-900/95 to-[#0f172b]/95 
                          rounded-3xl shadow-2xl border border-white/20 
                          backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div
              className="bg-linear-to-r from-[#fe9a00]/20 to-[#ff8800]/20 
                            border-b border-white/10 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-2xl bg-linear-to-br 
                                    from-[#fe9a00] to-[#ff8800] 
                                    flex items-center justify-center shadow-xl"
                    >
                      <BsRobot className="w-7 h-7 text-white" />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 
                                    bg-green-400 rounded-full border-4 
                                    border-slate-900 animate-pulse shadow-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      AI Assistant
                    </h3>
                    <p className="text-green-400 text-sm font-medium">
                      Online • Ready to help
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-3 rounded-xl hover:bg-white/10 transition-all 
                             text-gray-300 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-5 
                            scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-2xl  shrink-0 flex items-center justify-center
                                  ${
                                    message.role === "user"
                                      ? "bg-linear-to-br from-[#fe9a00] to-[#ff8800]"
                                      : "bg-linear-to-br from-slate-700 to-slate-800"
                                  }`}
                  >
                    {message.role === "user" ? (
                      <span className="text-white font-bold text-sm">You</span>
                    ) : (
                      <BsRobot className="w-6 h-6 text-orange-400" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-lg
                                ${
                                  message.role === "user"
                                    ? "bg-linear-to-r from-[#fe9a00] to-[#ff8800] text-white rounded-tr-none"
                                    : "bg-white/5 backdrop-blur-sm text-gray-100 border border-white/10 rounded-tl-none"
                                }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-700 to-slate-800 
                                  flex items-center justify-center"
                  >
                    <BsRobot className="w-6 h-6 text-orange-400" />
                  </div>
                  <div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 
                                  rounded-3xl rounded-tl-none px-5 py-4 shadow-lg"
                  >
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t border-white/10 bg-linear-to-t from-slate-900/50 to-transparent">
              <div
                className="flex items-center gap-3 bg-white/5 backdrop-blur-md 
                              border border-white/20 rounded-2xl px-4 py-3 
                              focus-within:border-[#fe9a00] focus-within:ring-4 
                              focus-within:ring-[#fe9a00]/20 transition-all duration-300"
              >
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
                  className="flex-1 bg-transparent text-white placeholder-gray-500 
                             outline-none text-sm font-medium"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 rounded-xl bg-linear-to-r from-[#fe9a00] to-[#ff8800] 
                             hover:from-[#ff8800] hover:to-[#fe9a00] 
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-all duration-300 shadow-lg hover:shadow-xl 
                             transform hover:scale-105"
                >
                  {isLoading ? (
                    <FiLoader className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <FiSend className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
