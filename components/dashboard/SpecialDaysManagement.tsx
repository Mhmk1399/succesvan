"use client";

import { useState } from "react";
import { FiX, FiPlus, FiTrash2, FiEdit2, FiCalendar } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import useSWR from "swr";
import { Office, SpecialDay } from "@/types/type";
import CustomSelect from "@/components/ui/CustomSelect";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SpecialDaysManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    month: 1,
    day: 1,
    isOpen: false,
    startTime: "09:00",
    endTime: "17:00",
    reason: "",
  });

  const { data: offices, mutate: mutateOffices } = useSWR<{ data: Office[] }>(
    "/api/offices",
    fetcher
  );

  const currentOffice = offices?.data?.find((o) => o._id === selectedOffice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffice) {
      showToast.error("Please select an office");
      return;
    }

    setIsSubmitting(true);
    try {
      const specialDays = currentOffice?.specialDays || [];
      let updatedSpecialDays: SpecialDay[];

      if (editingIndex !== null) {
        updatedSpecialDays = [...specialDays];
        updatedSpecialDays[editingIndex] = formData;
      } else {
        updatedSpecialDays = [...specialDays, formData];
      }

      const res = await fetch(`/api/offices/${selectedOffice}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialDays: updatedSpecialDays }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Operation failed");

      showToast.success(
        editingIndex !== null ? "Special day updated!" : "Special day created!"
      );
      setFormData({
        month: 1,
        day: 1,
        isOpen: false,
        startTime: "09:00",
        endTime: "17:00",
        reason: "",
      });
      setEditingIndex(null);
      setIsFormOpen(false);
      mutateOffices();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!selectedOffice) return;
    try {
      const specialDays = currentOffice?.specialDays || [];
      const updatedSpecialDays = specialDays.filter((_, i) => i !== index);

      const res = await fetch(`/api/offices/${selectedOffice}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialDays: updatedSpecialDays }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Delete failed");

      showToast.success("Special day deleted!");
      mutateOffices();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Delete failed");
    }
  };

  const handleEdit = (day: SpecialDay, index: number) => {
    setFormData({
      month: day.month,
      day: day.day,
      isOpen: day.isOpen,
      startTime: day.startTime || "09:00",
      endTime: day.endTime || "17:00",
      reason: day.reason || "",
    });
    setEditingIndex(index);
    setIsFormOpen(true);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Select Office
          </label>
          <CustomSelect
            options={offices?.data || []}
            value={selectedOffice}
            onChange={(val) => {
              setSelectedOffice(val);
              setEditingIndex(null);
            }}
            placeholder="Choose an office"
          />
        </div>
        <button
          onClick={() => {
            setFormData({
              month: 1,
              day: 1,
              isOpen: false,
              startTime: "09:00",
              endTime: "17:00",
              reason: "",
            });
            setEditingIndex(null);
            setIsFormOpen(true);
          }}
          disabled={!selectedOffice}
          className="px-6 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FiPlus /> Add Special Day
        </button>
      </div>

      {/* Special Days Grid or Empty State */}
      {selectedOffice ? (
        currentOffice?.specialDays && currentOffice.specialDays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentOffice.specialDays.map((day, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#fe9a00]/30 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <FiCalendar className="text-[#fe9a00] text-xl" />
                      <p className="text-xl font-bold text-white">
                        {monthNames[day.month - 1]} {day.day}
                      </p>
                    </div>
                    {day.reason && (
                      <p className="text-gray-300 text-sm mt-1 italic">
                        {day.reason}
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide ${
                      day.isOpen
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {day.isOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>

                {day.isOpen && (
                  <p className="text-gray-200 text-sm bg-white/5 rounded-lg px-4 py-2 mb-6">
                    ⏰ {day.startTime} - {day.endTime}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(day, index)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-semibold transition-all"
                  >
                    <FiEdit2 />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-semibold transition-all"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 rounded-2xl p-10 max-w-md mx-auto">
              <FiCalendar className="text-6xl text-gray-500 mx-auto mb-6" />
              <p className="text-xl font-semibold text-gray-300 mb-2">
                No special days yet
              </p>
              <p className="text-gray-500">
                Add holidays, closures, or custom opening hours for this office.
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <div className="bg-white/5 rounded-2xl p-10 max-w-md mx-auto">
            <div className="w-24 h-24 bg-[#fe9a00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCalendar className="text-5xl text-[#fe9a00]" />
            </div>
            <p className="text-2xl font-bold text-white mb-3">
              Manage Special Days
            </p>
            <p className="text-gray-400 text-lg">
              Select an office above to view and manage special opening/closing
              days.
            </p>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-black text-white">
                {editingIndex !== null ? "Edit Special Day" : "Add Special Day"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Month
                  </label>
                  <CustomSelect
                    options={monthNames.map((m, i) => ({
                      _id: String(i + 1),
                      name: m,
                    }))}
                    value={String(formData.month)}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        month: parseInt(val),
                      })
                    }
                    placeholder="Select Month"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        day: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fe9a00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="e.g., Christmas Holiday"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) =>
                    setFormData({ ...formData, isOpen: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label className="text-sm font-semibold text-gray-300">
                  Open on this day
                </label>
              </div>

              {formData.isOpen && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fe9a00]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fe9a00]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingIndex !== null
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
