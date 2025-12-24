"use client";

import { useState, useRef, useEffect } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import DynamicTableView from "./DynamicTableView";
import CustomSelect from "@/components/ui/CustomSelect";

interface Discount {
  _id?: string;
  code: string;
  percentage: number;
  categories: string[];
  validFrom: string;
  validTo: string;
  usageLimit: number | null;
  usageCount: number;
  status: "active" | "inactive" | "expired";
}

interface Category {
  _id: string;
  name: string;
}

export default function DiscountManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const mutateRef = useRef<(() => Promise<any>) | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    percentage: "",
    categories: [] as string[],
    validFrom: "",
    validTo: "",
    usageLimit: "",
    status: "inactive" as "active" | "inactive" | "expired",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.data || data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      percentage: "",
      categories: [],
      validFrom: "",
      validTo: "",
      usageLimit: "",
      status: "inactive",
    });
    setEditingId(null);
  };

  const handleEdit = (item: Discount) => {
    setFormData({
      code: item.code,
      percentage: String(item.percentage),
      categories: item.categories.map((c: any) => c._id || c),
      validFrom: item.validFrom.split("T")[0],
      validTo: item.validTo.split("T")[0],
      usageLimit: item.usageLimit ? String(item.usageLimit) : "",
      status: item.status,
    });
    setEditingId(item._id || null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/discounts?id=${editingId}` : "/api/discounts";

      const payload = {
        code: formData.code,
        percentage: parseFloat(formData.percentage),
        categories: formData.categories,
        validFrom: new Date(formData.validFrom),
        validTo: new Date(formData.validTo),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        status: formData.status,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Operation failed");

      showToast.success(
        `Discount ${editingId ? "updated" : "created"} successfully!`
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

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
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
        <FiPlus /> Add Discount
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Edit Discount" : "Create Discount"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Code</label>
                <input
                  type="text"
                  name="code"
                  placeholder="SUMMER2024"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage"
                  placeholder="10"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Categories
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 border border-white/10 rounded-lg">
                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-2 text-white cursor-pointer hover:bg-white/5 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(cat._id)}
                        onChange={() => toggleCategory(cat._id)}
                        className="w-4 h-4 accent-[#fe9a00]"
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Valid From
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fe9a00]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Valid To
                  </label>
                  <input
                    type="date"
                    name="validTo"
                    value={formData.validTo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fe9a00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Usage Limit (optional)
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  placeholder="Leave empty for unlimited"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Status</label>
                <CustomSelect
                  options={[
                    { _id: "active", name: "Active" },
                    { _id: "inactive", name: "Inactive" },
                    { _id: "expired", name: "Expired" },
                  ]}
                  value={formData.status}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: val as "active" | "inactive" | "expired",
                    }))
                  }
                  placeholder="Select Status"
                />
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

      <DynamicTableView<Discount>
        apiEndpoint="/api/discounts"
        filters={[
          { key: "code", label: "Code", type: "text" },
          { key: "status", label: "Status", type: "text" },
          { key: "createdAt", label: "Created Date", type: "date" },
        ]}
        title="Discount"
        columns={[
          { key: "code", label: "Code" },
          { key: "percentage", label: "Percentage", render: (val) => `${val}%` },
          {
            key: "categories" as keyof Discount,
            label: "Categories",
            render: (_, item) =>
              (item?.categories as any)
                ?.map((c: any) => c.name || c)
                .join(", ") || "-",
          },
          {
            key: "validFrom",
            label: "Valid From",
            render: (val) => new Date(val as string).toLocaleDateString(),
          },
          {
            key: "validTo",
            label: "Valid To",
            render: (val) => new Date(val as string).toLocaleDateString(),
          },
          {
            key: "usageCount",
            label: "Usage",
            render: (_, item) =>
              `${item?.usageCount || 0}${
                item?.usageLimit ? `/${item.usageLimit}` : ""
              }`,
          },
          { key: "status", label: "Status" },
        ]}
        onEdit={handleEdit}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />
    </div>
  );
}
