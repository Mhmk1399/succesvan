"use client";

import { useState, useRef } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import DynamicTableView from "./DynamicTableView";
import { AddOn } from "@/types/type";
import CustomSelect from "@/components/ui/CustomSelect";

export default function AddOnsContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const mutateRef = useRef<(() => Promise<any>) | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricingType: "flat" as "flat" | "tiered",
    flatPrice: "",
    tiers: [{ minDays: "", maxDays: "", price: "" }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTierChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.tiers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, tiers: updated };
    });
  };

  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, { minDays: "", maxDays: "", price: "" }],
    }));
  };

  const removeTier = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pricingType: "flat",
      flatPrice: "",
      tiers: [{ minDays: "", maxDays: "", price: "" }],
    });
    setEditingId(null);
  };

  const handleEdit = (item: AddOn) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      pricingType: item.pricingType,
      flatPrice: String(item.flatPrice || ""),
      tiers: (item.tiers || [{ minDays: "", maxDays: "", price: "" }]).map(
        (t: any) => ({
          minDays: String(t.minDays),
          maxDays: String(t.maxDays),
          price: String(t.price),
        })
      ),
    });
    setEditingId(item._id || null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/addons?id=${editingId}` : "/api/addons";

      const payload: any = {
        name: formData.name,
        description: formData.description,
        pricingType: formData.pricingType,
      };

      if (formData.pricingType === "flat") {
        payload.flatPrice = parseFloat(formData.flatPrice);
      } else {
        payload.tiers = formData.tiers.map((t) => ({
          minDays: parseInt(t.minDays),
          maxDays: parseInt(t.maxDays),
          price: parseFloat(t.price),
        }));
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Operation failed");

      showToast.success(
        `AddOn ${editingId ? "updated" : "created"} successfully!`
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
        <FiPlus /> Add AddOn
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Edit AddOn" : "Create AddOn"}
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
                placeholder="AddOn Name"
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

              <CustomSelect
                options={[
                  { _id: "flat", name: "Flat Price" },
                  { _id: "tiered", name: "Tiered Pricing" },
                ]}
                value={formData.pricingType}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    pricingType: val as "flat" | "tiered",
                  }))
                }
                placeholder="Select Pricing Type"
              />

              {formData.pricingType === "flat" ? (
                <input
                  type="number"
                  name="flatPrice"
                  placeholder="Price"
                  value={formData.flatPrice}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Pricing Tiers</h3>
                    <button
                      type="button"
                      onClick={addTier}
                      className="px-3 py-1 bg-[#fe9a00]/20 hover:bg-[#fe9a00]/30 text-[#fe9a00] rounded text-sm font-semibold"
                    >
                      + Add Tier
                    </button>
                  </div>
                  {formData.tiers.map((tier, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min Days"
                        value={tier.minDays}
                        onChange={(e) =>
                          handleTierChange(idx, "minDays", e.target.value)
                        }
                        required
                        min="1"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max Days"
                        value={tier.maxDays}
                        onChange={(e) =>
                          handleTierChange(idx, "maxDays", e.target.value)
                        }
                        required
                        min="1"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={tier.price}
                        onChange={(e) =>
                          handleTierChange(idx, "price", e.target.value)
                        }
                        required
                        step="0.01"
                        min="0"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                      />
                      {formData.tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(idx)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
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
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DynamicTableView<AddOn>
        apiEndpoint="/api/addons"
        title="AddOn"
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "pricingType", label: "Type" },
          {
            key: "flatPrice" as keyof AddOn,
            label: "Price",
            render: (_, item) => {
              if (item?.pricingType === "flat") {
                return `£${item?.flatPrice || 0}`;
              }
              return (
                item?.tiers
                  ?.map((t: any) => `${t.minDays}-${t.maxDays}d: £${t.price}`)
                  .join(" | ") || "-"
              );
            },
          },
        ]}
        onEdit={handleEdit}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />
    </div>
  );
}
