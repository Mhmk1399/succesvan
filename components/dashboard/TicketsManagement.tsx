"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiClock,
  FiUser,
  FiMail,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiInbox,
  FiFilter,
  FiChevronRight,
} from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi";
import { IoSparkles } from "react-icons/io5";
import CustomSelect from "@/components/ui/CustomSelect";
import { showToast } from "@/lib/toast";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface Ticket {
  _id: string;
  userId: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
  };
  subject: string;
  status: string;
  priority: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function TicketsManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (isDetailOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDetailOpen]);

  useEffect(() => {
    if (isDetailOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isDetailOpen, selectedTicket?.messages]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.data);
      } else {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        showToast.error(errorData.error || "Failed to fetch tickets");
      }
    } catch (error) {
      console.log("Error fetching tickets:", error);
      showToast.error("Error fetching tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tickets/${selectedTicket._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedTicket(data.data);
        setReplyMessage("");
        fetchTickets();
        showToast.success("Reply sent successfully");
      } else {
        showToast.error("Failed to send reply");
      }
    } catch (error) {
      console.log("Error sending reply:", error);
      showToast.error("Error sending reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTickets();
        showToast.success("Status updated successfully");
      } else {
        showToast.error("Failed to update status");
      }
    } catch (error) {
      console.log("Error updating status:", error);
      showToast.error("Error updating status");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          text: "text-red-400",
          icon: <FiAlertCircle className="w-3 h-3" />,
          glow: "shadow-red-500/20",
        };
      case "in-progress":
        return {
          bg: "bg-amber-500/20",
          border: "border-amber-500/30",
          text: "text-amber-400",
          icon: <FiLoader className="w-3 h-3 animate-spin" />,
          glow: "shadow-amber-500/20",
        };
      case "resolved":
        return {
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          icon: <FiCheckCircle className="w-3 h-3" />,
          glow: "shadow-emerald-500/20",
        };
      case "closed":
        return {
          bg: "bg-slate-500/20",
          border: "border-slate-500/30",
          text: "text-slate-400",
          icon: <FiX className="w-3 h-3" />,
          glow: "shadow-slate-500/20",
        };
      default:
        return {
          bg: "bg-slate-500/20",
          border: "border-slate-500/30",
          text: "text-slate-400",
          icon: null,
          glow: "",
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          bg: "bg-linear-to-r from-red-500/30 to-orange-500/30",
          border: "border-red-500/40",
          text: "text-red-300",
          pulse: true,
        };
      case "high":
        return {
          bg: "bg-linear-to-r from-orange-500/30 to-amber-500/30",
          border: "border-orange-500/40",
          text: "text-orange-300",
          pulse: false,
        };
      case "medium":
        return {
          bg: "bg-linear-to-r from-yellow-500/30 to-lime-500/30",
          border: "border-yellow-500/40",
          text: "text-yellow-300",
          pulse: false,
        };
      case "low":
        return {
          bg: "bg-linear-to-r from-green-500/30 to-emerald-500/30",
          border: "border-green-500/40",
          text: "text-green-300",
          pulse: false,
        };
      default:
        return {
          bg: "bg-slate-500/20",
          border: "border-slate-500/30",
          text: "text-slate-400",
          pulse: false,
        };
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) => filterStatus === "all" || ticket.status === filterStatus,
  );

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-[#fe9a00]/30 border-t-[#fe9a00] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-300 text-lg font-semibold">
          Loading tickets...
        </p>
        <p className="text-gray-500 text-sm mt-2">Please wait</p>
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-6 lg:pb-20 shadow-2xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#fe9a00]/20 to-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-99999">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title & Icon */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-[#fe9a00] to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-linear-to-br from-[#fe9a00] to-orange-600 flex items-center justify-center shadow-lg shadow-[#fe9a00]/30">
                  <HiOutlineTicket className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                  Ticket Management
                  <IoSparkles className="w-5 h-5 text-[#fe9a00]" />
                </h2>
                <p className="text-white/50 text-sm lg:text-base mt-1">
                  Manage and respond to customer support tickets
                </p>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <FiFilter className="w-4 h-4 text-[#fe9a00]" />
                <span className="text-white/60 text-sm hidden sm:inline">
                  Filter:
                </span>
              </div>
              <div className="relative z-20">
                <CustomSelect
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={[
                    { _id: "all", name: "All Status" },
                    { _id: "open", name: "Open" },
                    { _id: "in-progress", name: "In Progress" },
                    { _id: "resolved", name: "Resolved" },
                    { _id: "closed", name: "Closed" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-12">
            {[
              {
                label: "Total",
                value: ticketStats.total,
                color: "from-blue-500 to-cyan-500",
                bg: "bg-blue-500/10",
              },
              {
                label: "Open",
                value: ticketStats.open,
                color: "from-red-500 to-orange-500",
                bg: "bg-red-500/10",
              },
              {
                label: "In Progress",
                value: ticketStats.inProgress,
                color: "from-amber-500 to-yellow-500",
                bg: "bg-amber-500/10",
              },
              {
                label: "Resolved",
                value: ticketStats.resolved,
                color: "from-emerald-500 to-green-500",
                bg: "bg-emerald-500/10",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl ${stat.bg} backdrop-blur-sm border border-white/10 p-4 group hover:border-white/20 transition-all duration-300`}
              >
                <div
                  className={`absolute top-0 right-0 w-20 h-20 bg-linear-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <p className="text-white/50 text-xs lg:text-sm font-medium">
                  {stat.label}
                </p>
                <p
                  className={`text-2xl lg:text-3xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent mt-1`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket, index) => {
          const statusConfig = getStatusConfig(ticket.status);
          const priorityConfig = getPriorityConfig(ticket.priority);

          return (
            <div
              key={ticket._id}
              className="group relative overflow-y-auto rounded-2xl bg-linear-to-br from-white/8 via-white/5 to-transparent backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-xl hover:shadow-black/20"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-[#fe9a00]/0 via-[#fe9a00]/5 to-[#fe9a00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Priority indicator line */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${priorityConfig.bg} ${
                  priorityConfig.pulse ? "animate-pulse" : ""
                }`}
              ></div>

              <div className="relative p-5 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-start gap-2">
                      <h3 className="text-lg lg:text-xl font-semibold text-white group-hover:text-[#fe9a00] transition-colors duration-300 flex-1 min-w-0">
                        {ticket.subject}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border shadow-lg ${statusConfig.glow}`}
                        >
                          {statusConfig.icon}
                          <span className="capitalize">{ticket.status}</span>
                        </span>
                        {/* Priority Badge */}
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.border} ${priorityConfig.text} border capitalize`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                        <FiUser className="w-3.5 h-3.5 text-[#fe9a00]" />
                        <span className="text-white/70">
                          {ticket?.userId?.name} {ticket?.userId?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                        <FiMail className="w-3.5 h-3.5 text-[#fe9a00]" />
                        <span className="text-white/60 truncate max-w-50">
                          {ticket?.userId?.email}
                        </span>
                      </div>
                    </div>

                    {/* Last Message Preview */}
                    <div className="relative p-4 rounded-xl bg-white/3 border border-white/5">
                      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#fe9a00]/50"></div>
                      <p className="text-white/60 text-sm pl-4 line-clamp-2 leading-relaxed">
                        {ticket.messages.length > 0
                          ? ticket.messages[ticket.messages.length - 1].content
                          : "No messages yet"}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                      <div className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        <span>
                          Created:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        <span>
                          Updated:{" "}
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiMessageSquare className="w-3.5 h-3.5" />
                        <span>{ticket.messages.length} messages</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col items-stretch gap-3 lg:min-w-45">
                    <div className="relative z-20">
                      <CustomSelect
                        value={ticket.status}
                        onChange={(value) =>
                          handleStatusChange(ticket._id, value)
                        }
                        options={[
                          { _id: "open", name: "Open" },
                          { _id: "in-progress", name: "In Progress" },
                          { _id: "resolved", name: "Resolved" },
                          { _id: "closed", name: "Closed" },
                        ]}
                        placeholder="Update status"
                      />
                    </div>
                    <button
                      onClick={() => handleViewTicket(ticket)}
                      className="flex-1 lg:flex-none group/btn relative overflow-hidden px-5 py-3 rounded-xl bg-linear-to-r from-[#fe9a00] to-orange-600 text-white font-semibold text-sm shadow-lg shadow-[#fe9a00]/20 hover:shadow-[#fe9a00]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View Ticket
                        <FiChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-[#fe9a00] opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/8 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-12 lg:p-16">
          <div className="absolute inset-0 bg-linear-to-br from-[#fe9a00]/5 to-purple-500/5"></div>
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 mb-6">
              <FiInbox className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No tickets found
            </h3>
            <p className="text-white/50 max-w-sm mx-auto">
              {filterStatus === "all"
                ? "There are no support tickets at the moment."
                : `No tickets with "${filterStatus}" status.`}
            </p>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {isDetailOpen && selectedTicket && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-9999"
            onClick={() => setIsDetailOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 lg:inset-4 lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-3xl lg:w-full lg:min-h-[85vh] z-10000 flex flex-col lg:rounded-3xl overflow-hidden">
            <div className="relative flex flex-col h-full overflow-hidden lg:rounded-3xl bg-linear-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
              {/* Modal Header */}
              <div className="relative shrink-0 p-6 border-b border-white/10">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-[#fe9a00]/20 to-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#fe9a00] to-orange-600 flex items-center justify-center shadow-lg shadow-[#fe9a00]/30">
                          <HiOutlineTicket className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white truncate">
                          {selectedTicket.subject}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Status */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            getStatusConfig(selectedTicket.status).bg
                          } ${getStatusConfig(selectedTicket.status).border} ${
                            getStatusConfig(selectedTicket.status).text
                          } border`}
                        >
                          {getStatusConfig(selectedTicket.status).icon}
                          <span className="capitalize">
                            {selectedTicket.status}
                          </span>
                        </span>
                        {/* Priority */}
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                            getPriorityConfig(selectedTicket.priority).bg
                          } ${
                            getPriorityConfig(selectedTicket.priority).border
                          } ${
                            getPriorityConfig(selectedTicket.priority).text
                          } border capitalize`}
                        >
                          {selectedTicket.priority}
                        </span>
                        {/* User */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <FiUser className="w-3.5 h-3.5 text-[#fe9a00]" />
                          <span className="text-white/70 text-sm">
                            {selectedTicket?.userId?.name}{" "}
                            {selectedTicket?.userId?.lastName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsDetailOpen(false)}
                      className="shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 hover:rotate-90"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {selectedTicket.messages.map((message, index) => {
                  const isUser = message.sender === selectedTicket?.userId?._id;

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isUser ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`group relative max-w-[85%] lg:max-w-[70%] ${
                          isUser ? "order-1" : "order-2"
                        }`}
                      >
                        {/* Message bubble */}
                        <div
                          className={`relative p-4 rounded-2xl ${
                            isUser
                              ? "bg-white/8 border border-white/10 rounded-tl-sm"
                              : "bg-linear-to-br from-[#fe9a00] to-orange-600 rounded-tr-sm shadow-lg shadow-[#fe9a00]/20"
                          }`}
                        >
                          {/* Sender label */}
                          <div
                            className={`text-xs font-medium mb-2 ${
                              isUser ? "text-[#fe9a00]" : "text-white/80"
                            }`}
                          >
                            {isUser ? "Customer" : "Support Team"}
                          </div>

                          {/* Message content */}
                          <p
                            className={`text-sm leading-relaxed ${
                              isUser ? "text-white/80" : "text-white"
                            }`}
                          >
                            {message.content}
                          </p>

                          {/* Timestamp */}
                          <div
                            className={`flex items-center gap-1 mt-2 text-xs ${
                              isUser ? "text-white/40" : "text-white/60"
                            }`}
                          >
                            <FiClock className="w-3 h-3" />
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                        </div>

                        {/* Avatar indicator */}
                        <div
                          className={`absolute -bottom-2 ${
                            isUser ? "-left-2" : "-right-2"
                          } w-6 h-6 rounded-full ${
                            isUser
                              ? "bg-white/10 border border-white/20"
                              : "bg-linear-to-br from-[#fe9a00] to-orange-600"
                          } flex items-center justify-center`}
                        >
                          {isUser ? (
                            <FiUser className="w-3 h-3 text-white/60" />
                          ) : (
                            <HiOutlineTicket className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              <div className="shrink-0 p-6 border-t border-white/10 bg-linear-to-t from-black/20 to-transparent">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={1}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-[#fe9a00]/50 focus:ring-2 focus:ring-[#fe9a00]/20 resize-none transition-all duration-300 scrollbar-thin scrollbar-thumb-white/10"
                      style={{ minHeight: "56px", maxHeight: "120px" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "56px";
                        target.style.height = `${Math.min(
                          target.scrollHeight,
                          120,
                        )}px`;
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim() || isSubmitting}
                    className="shrink-0 group relative w-14 h-14 rounded-2xl bg-linear-to-r from-[#fe9a00] to-orange-600 text-white shadow-lg shadow-[#fe9a00]/30 hover:shadow-[#fe9a00]/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiSend className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      )}
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-orange-600 to-[#fe9a00] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>

               
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
