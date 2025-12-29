"use client";

import { useState, useEffect } from "react";
import { FiMessageSquare, FiX } from "react-icons/fi";
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

  useEffect(() => {
    fetchTickets();
  }, []);

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
      console.error("Error fetching tickets:", error);
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
        fetchTickets(); // Refresh the list
        showToast.success("Reply sent successfully");
      } else {
        showToast.error("Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
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
      console.error("Error updating status:", error);
      showToast.error("Error updating status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) => filterStatus === "all" || ticket.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe9a00]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start gap-20  ">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiMessageSquare className="text-[#fe9a00]" />
          Ticket Management
        </h2>
        <div className="flex items-center gap-4">
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

      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {ticket.subject}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {ticket.userId.name} {ticket.userId.lastName} •{" "}
                  {ticket.userId.email}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {ticket.messages.length > 0
                    ? ticket.messages[ticket.messages.length - 1].content
                    : "No messages yet"}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                  </span>
                  <span>{ticket.messages.length} messages</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewTicket(ticket)}
                  className="px-3 py-1 bg-[#fe9a00] text-black rounded-md hover:bg-[#e8890b] transition-colors text-sm font-medium"
                >
                  View
                </button>
                <CustomSelect
                  value={ticket.status}
                  onChange={(value) => handleStatusChange(ticket._id, value)}
                  options={[
                    { _id: "open", name: "Open" },
                    { _id: "in-progress", name: "In Progress" },
                    { _id: "resolved", name: "Resolved" },
                    { _id: "closed", name: "Closed" },
                  ]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <FiMessageSquare className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No tickets found</p>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {isDetailOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md  flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {selectedTicket.subject}
                </h3>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedTicket.status
                  )}`}
                >
                  {selectedTicket.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    selectedTicket.priority
                  )}`}
                >
                  {selectedTicket.priority}
                </span>
                <span className="text-gray-400 text-sm">
                  {selectedTicket.userId.name} {selectedTicket.userId.lastName}
                </span>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {selectedTicket.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === selectedTicket.userId._id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === selectedTicket.userId._id
                          ? "bg-gray-700 text-white"
                          : "bg-[#fe9a00] text-black"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#fe9a00]"
                  onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() || isSubmitting}
                  className="px-6 py-2 bg-[#fe9a00] text-black rounded-lg hover:bg-[#e8890b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
