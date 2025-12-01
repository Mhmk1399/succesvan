"use client";

import { useState, useRef } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import DynamicTableView from "./DynamicTableView";
import { Type } from "@/types/type";

export default function TypesManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [formData, setFormData] = useState<Type>({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mutateRef = useRef<(() => Promise<any>) | null>(null);

  const handleOpenForm = (type?: Type) => {
    if (type) {
      setEditingType(type);
      setFormData(type);
    } else {
      setEditingType(null);
      setFormData({ name: "", description: "" });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingType(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingType ? `/api/types/${editingType._id}` : "/api/types";
      const method = editingType ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Operation failed");

      showToast.success(
        editingType
          ? "Type updated successfully!"
          : "Type created successfully!"
      );
      handleCloseForm();
      if (mutateRef.current) mutateRef.current();
    } catch (error: any) {
      showToast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-6 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white font-bold rounded-lg transition-colors"
        >
          <FiPlus /> Add Type
        </button>
      </div>

      <DynamicTableView<Type>
        apiEndpoint="/api/types"
        title="Type"
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          {
            key: "createdAt",
            label: "Created",
            render: (value) =>
              value ? new Date(value).toLocaleDateString() : "-",
          },
        ]}
        onEdit={handleOpenForm}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-black text-white">
                {editingType ? "Edit Type" : "Add Type"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter type name"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-[#fe9a00] hover:bg-[#fe9a00]/80 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingType
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
