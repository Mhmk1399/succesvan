"use client";

import { useRef, useState, useEffect } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { Office, Category } from "@/types/type";
import DynamicTableView from "./DynamicTableView";

export default function OfficesContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const mutateRef = useRef<(() => Promise<any>) | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    categories: [] as string[],
    location: {
      latitude: "",
      longitude: "",
    },
    workingTime: [
      { day: "monday", isOpen: true, startTime: "", endTime: "" },
      { day: "tuesday", isOpen: true, startTime: "", endTime: "" },
      { day: "wednesday", isOpen: true, startTime: "", endTime: "" },
      { day: "thursday", isOpen: true, startTime: "", endTime: "" },
      { day: "friday", isOpen: true, startTime: "", endTime: "" },
      { day: "saturday", isOpen: false, startTime: "", endTime: "" },
      { day: "sunday", isOpen: false, startTime: "", endTime: "" },
    ],
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleWorkingTimeChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      const updated = [...prev.workingTime];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workingTime: updated };
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      categories: [],
      location: {
        latitude: "",
        longitude: "",
      },
      workingTime: [
        { day: "monday", isOpen: true, startTime: "", endTime: "" },
        { day: "tuesday", isOpen: true, startTime: "", endTime: "" },
        { day: "wednesday", isOpen: true, startTime: "", endTime: "" },
        { day: "thursday", isOpen: true, startTime: "", endTime: "" },
        { day: "friday", isOpen: true, startTime: "", endTime: "" },
        { day: "saturday", isOpen: false, startTime: "", endTime: "" },
        { day: "sunday", isOpen: false, startTime: "", endTime: "" },
      ],
    });
    setEditingId(null);
  };

  const handleEdit = (item: Office) => {
    setFormData({
      name: item.name,
      address: item.address,
      phone: item.phone,
      categories: item.categories || [],
      location: {
        latitude: String(item.location.latitude),
        longitude: String(item.location.longitude),
      },
      workingTime: item.workingTime.map((wt) => ({
        day: wt.day,
        isOpen: wt.isOpen,
        startTime: wt.startTime || "",
        endTime: wt.endTime || "",
      })),
    });
    setEditingId(item._id || null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/offices/${editingId}` : "/api/offices";

      const payload = {
        ...formData,
        location: {
          latitude: parseFloat(formData.location.latitude),
          longitude: parseFloat(formData.location.longitude),
        },
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Operation failed");

      showToast.success(
        `Office ${editingId ? "updated" : "created"} successfully!`
      );
      resetForm();
      setIsFormOpen(false);
      if (mutateRef.current) mutateRef.current();
    } catch {
      showToast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          resetForm();
          setIsFormOpen(true);
        }}
        className="flex items-center gap-2 px-6 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white font-bold rounded-lg transition-colors"
      >
        <FiPlus /> Add Office
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Edit Office" : "Create Office"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Office Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />

              <div className="space-y-2">
                <label className="text-white font-semibold">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(cat._id!)}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            categories: e.target.checked
                              ? [...prev.categories, cat._id!]
                              : prev.categories.filter((id) => id !== cat._id),
                          }));
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-300">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="location.latitude"
                  placeholder="Latitude"
                  value={formData.location.latitude}
                  onChange={handleInputChange}
                  required
                  step="0.000001"
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
                <input
                  type="number"
                  name="location.longitude"
                  placeholder="Longitude"
                  value={formData.location.longitude}
                  onChange={handleInputChange}
                  required
                  step="0.000001"
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold">Working Hours</h3>
                <div className="space-y-3">
                  {formData.workingTime.map((day, idx) => (
                    <div
                      key={day.day}
                      className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400">
                          {day.day.charAt(0).toUpperCase() + day.day.slice(1)}
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={day.isOpen}
                            onChange={(e) =>
                              handleWorkingTimeChange(
                                idx,
                                "isOpen",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-xs text-gray-400">Open</span>
                        </label>
                      </div>
                      {day.isOpen && (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) =>
                              handleWorkingTimeChange(
                                idx,
                                "startTime",
                                e.target.value
                              )
                            }
                            required
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-[#fe9a00] text-sm"
                          />
                          <input
                            type="time"
                            value={day.endTime}
                            onChange={(e) =>
                              handleWorkingTimeChange(
                                idx,
                                "endTime",
                                e.target.value
                              )
                            }
                            required
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-[#fe9a00] text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DynamicTableView<Office>
        apiEndpoint="/api/offices"
        title="Office"
        columns={[
          { key: "name", label: "Name" },
          { key: "address", label: "Address" },
          { key: "phone", label: "Phone" },
        ]}
        onEdit={handleEdit}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />
    </div>
  );
}
