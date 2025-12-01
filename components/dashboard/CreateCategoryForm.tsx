"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { Category, Type } from "@/types/type";
import DynamicTableView from "./DynamicTableView";
import CustomSelect from "@/components/ui/CustomSelect";

export default function CategoriesContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const mutateRef = useRef<(() => Promise<any>) | null>(null);
  const [types, setTypes] = useState<Type[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    type: "",
    pricePerHour: "",
    fuel: "",
    gear: "",
    seats: "",
    doors: "",
    servicesPeriod: {
      tire: "",
      oil: "",
      battery: "",
      air: "",
      service: "",
    },
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/types");
        const data = await res.json();
        if (data.success) setTypes(data.data);
      } catch (error) {
        console.error("Failed to fetch types", error);
      }
    };
    fetchTypes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name !== "type") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesPeriod: { ...prev.servicesPeriod, [field]: value },
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      type: "",
      pricePerHour: "",
      fuel: "",
      gear: "",
      seats: "",
      doors: "",
      servicesPeriod: {
        tire: "",
        oil: "",
        battery: "",
        air: "",
        service: "",
      },
    });
    setEditingId(null);
  };

  const handleEdit = (item: Category) => {
    const typeId =
      typeof item.type === "string" ? item.type : item.type._id || "";
    setFormData({
      name: item.name,
      description: item.description || "",
      image: item.image || "",
      type: typeId,
      pricePerHour: String(item.pricePerHour || ""),
      fuel: item.fuel || "",
      gear: item.gear || "",
      seats: String(item.seats || ""),
      doors: String(item.doors || ""),
      servicesPeriod: {
        tire: String(item.servicesPeriod?.tire || ""),
        oil: String(item.servicesPeriod?.oil || ""),
        battery: String(item.servicesPeriod?.battery || ""),
        air: String(item.servicesPeriod?.air || ""),
        service: String(item.servicesPeriod?.service || ""),
      },
    });
    setEditingId(item._id || null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";

      const payload = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        type: formData.type,
        pricePerHour: parseFloat(formData.pricePerHour),
        fuel: formData.fuel,
        gear: formData.gear,
        seats: parseInt(formData.seats),
        doors: parseInt(formData.doors),
        servicesPeriod: {
          tire: parseInt(formData.servicesPeriod.tire),
          oil: parseInt(formData.servicesPeriod.oil),
          battery: parseInt(formData.servicesPeriod.battery),
          air: parseInt(formData.servicesPeriod.air),
          service: parseInt(formData.servicesPeriod.service),
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
        `Category ${editingId ? "updated" : "created"} successfully!`
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
        <FiPlus /> Add Category
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Edit Category" : "Create Category"}
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
                placeholder="Category Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />

              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />

              <CustomSelect
                options={types}
                value={formData.type}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, type: val }))
                }
                placeholder="Select Type"
              />

              <input
                type="number"
                name="pricePerHour"
                placeholder="Price Per Hour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />

              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  options={[
                    { _id: "gas", name: "Gas" },
                    { _id: "diesel", name: "Diesel" },
                    { _id: "electric", name: "Electric" },
                    { _id: "hybrid", name: "Hybrid" },
                  ]}
                  value={formData.fuel}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, fuel: val }))
                  }
                  placeholder="Select Fuel"
                />

                <CustomSelect
                  options={[
                    { _id: "automatic", name: "Automatic" },
                    { _id: "manual", name: "Manual" },
                    { _id: "manual,automatic", name: "Manual & Automatic" },
                  ]}
                  value={formData.gear}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, gear: val }))
                  }
                  placeholder="Select Gear"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="seats"
                  placeholder="Seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
                <input
                  type="number"
                  name="doors"
                  placeholder="Doors"
                  value={formData.doors}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold">
                  Service Period (Days)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Tire"
                    value={formData.servicesPeriod.tire}
                    onChange={(e) =>
                      handleServiceChange("tire", e.target.value)
                    }
                    required
                    min="1"
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                  />
                  <input
                    type="number"
                    placeholder="Oil"
                    value={formData.servicesPeriod.oil}
                    onChange={(e) => handleServiceChange("oil", e.target.value)}
                    required
                    min="1"
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                  />
                  <input
                    type="number"
                    placeholder="Battery"
                    value={formData.servicesPeriod.battery}
                    onChange={(e) =>
                      handleServiceChange("battery", e.target.value)
                    }
                    required
                    min="1"
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                  />
                  <input
                    type="number"
                    placeholder="Air"
                    value={formData.servicesPeriod.air}
                    onChange={(e) => handleServiceChange("air", e.target.value)}
                    required
                    min="1"
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                  />
                  <input
                    type="number"
                    placeholder="Service"
                    value={formData.servicesPeriod.service}
                    onChange={(e) =>
                      handleServiceChange("service", e.target.value)
                    }
                    required
                    min="1"
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                  />
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

      <DynamicTableView<Category>
        apiEndpoint="/api/categories"
        title="Category"
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          {
            key: "type",
            label: "Type",
            render: (value: string | Type) =>
              typeof value === "string" ? value : value?.name || "-",
          },
          { key: "pricePerHour", label: "Price/Hour" },
          { key: "fuel", label: "Fuel" },
          { key: "gear", label: "Gear" },
          { key: "seats", label: "Seats" },
          { key: "doors", label: "Doors" },
        ]}
        onEdit={handleEdit}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />
    </div>
  );
}
