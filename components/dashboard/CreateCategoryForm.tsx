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
  const [uploading, setUploading] = useState({ image: false, video: false });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expert: "",
    image: "",
    video: "",
    type: "",
    showPrice: "",
    properties: [{ key: "", value: "" }],
    requiredLicense: "",
    pricingTiers: [{ minDays: "", maxDays: "", pricePerDay: "" }],
    extrahoursRate: "",
    fuel: "",
    gear: {
      availableTypes: [] as string[],
      automaticExtraCost: "",
    },
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
        console.log("Failed to fetch types", error);
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

  const handleFileUpload = async (file: File, type: "image" | "video") => {
    setUploading({ ...uploading, [type]: true });
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFormData((prev) => ({ ...prev, [type]: data.url }));
      showToast.success(`${type} uploaded!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Upload failed");
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      expert: "",
      image: "",
      video: "",
      type: "",
      showPrice: "",
      properties: [{ key: "", value: "" }],
      requiredLicense: "",
      pricingTiers: [{ minDays: "", maxDays: "", pricePerDay: "" }],
      extrahoursRate: "",
      fuel: "",
      gear: {
        availableTypes: [] as string[],
        automaticExtraCost: "",
      },
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
      expert: (item as any).expert || "",
      image: item.image || "",
      video: (item as any).video || "",
      type: typeId,
      showPrice: String((item as any).showPrice || ""),
      properties: (item as any).properties?.map((p: any) => ({
        key: p.key || "",
        value: p.value || "",
      })) || [{ key: "", value: "" }],
      requiredLicense: (item as any).requiredLicense || "",
      pricingTiers: (item as any).pricingTiers?.map((t: any) => ({
        minDays: String(t.minDays || ""),
        maxDays: String(t.maxDays || ""),
        pricePerDay: String(t.pricePerDay || ""),
      })) || [{ minDays: "", maxDays: "", pricePerDay: "" }],
      extrahoursRate: String((item as any).extrahoursRate || ""),
      fuel: item.fuel || "",
      gear: {
        availableTypes: (item.gear as any)?.availableTypes || [],
        automaticExtraCost: String((item.gear as any)?.automaticExtraCost || ""),
      },
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

  const handleDuplicate = async (item: Category) => {
    try {
      const typeId =
        typeof item.type === "string" ? item.type : item.type._id || "";
      const payload = {
        name: `${item.name} (Copy)`,
        description: item.description,
        expert: (item as any).expert,
        image: item.image,
        video: (item as any).video,
        type: typeId,
        showPrice: (item as any).showPrice,
        properties: (item as any).properties || [],
        requiredLicense: (item as any).requiredLicense,
        pricingTiers: (item as any).pricingTiers || [],
        extrahoursRate: (item as any).extrahoursRate,
        fuel: item.fuel,
        gear: item.gear,
        seats: item.seats,
        doors: item.doors,
        servicesPeriod: item.servicesPeriod,
      };

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Duplicate failed");

      showToast.success("Category duplicated successfully!");
      if (mutateRef.current) mutateRef.current();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Duplicate failed");
    }
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
        expert: formData.expert,
        image: formData.image,
        video: formData.video,
        type: formData.type,
        showPrice: parseFloat(formData.showPrice),
        properties: formData.properties.map((p) => ({
          key: p.key,
          value: p.value,
        })),
        requiredLicense: formData.requiredLicense,
        pricingTiers: formData.pricingTiers.map((t) => ({
          minDays: parseFloat(t.minDays),
          maxDays: parseFloat(t.maxDays),
          pricePerDay: parseFloat(t.pricePerDay),
        })),
        extrahoursRate: parseFloat(formData.extrahoursRate),
        fuel: formData.fuel,
        gear: {
          availableTypes: formData.gear.availableTypes,
          automaticExtraCost: parseFloat(formData.gear.automaticExtraCost) || 0,
        },
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
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Image
                </label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Category"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <label className="absolute bottom-2 right-2 px-3 py-1 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg cursor-pointer text-sm font-semibold">
                      {uploading.image ? "Uploading..." : "Change"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileUpload(e.target.files[0], "image")
                        }
                        disabled={uploading.image}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#fe9a00] transition-colors">
                    <span className="text-gray-400 text-sm">
                      {uploading.image ? "Uploading..." : "+ Upload Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0], "image")
                      }
                      disabled={uploading.image}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Video
                </label>
                {formData.video ? (
                  <div className="relative">
                    <video
                      src={formData.video}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                    <label className="absolute bottom-2 right-2 px-3 py-1 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg cursor-pointer text-sm font-semibold">
                      {uploading.video ? "Uploading..." : "Change"}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileUpload(e.target.files[0], "video")
                        }
                        disabled={uploading.video}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#fe9a00] transition-colors">
                    <span className="text-gray-400 text-sm">
                      {uploading.video ? "Uploading..." : "+ Upload Video"}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0], "video")
                      }
                      disabled={uploading.video}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Expert
                </label>
                <input
                  type="text"
                  name="expert"
                  placeholder="Ford Transit Custom or Similar"
                  value={formData.expert}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Type</label>
                <CustomSelect
                  options={types}
                  value={formData.type}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, type: val }))
                  }
                  placeholder="Select Type"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Pricing Tiers</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        pricingTiers: [
                          ...prev.pricingTiers,
                          { minDays: "", maxDays: "", pricePerDay: "" },
                        ],
                      }))
                    }
                    className="text-[#fe9a00] hover:text-[#e68a00] text-sm font-semibold"
                  >
                    + Add Tier
                  </button>
                </div>
                {formData.pricingTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Min Days"
                      value={tier.minDays}
                      onChange={(e) => {
                        const newTiers = [...formData.pricingTiers];
                        newTiers[index].minDays = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          pricingTiers: newTiers,
                        }));
                      }}
                      required
                      min="1"
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max Days"
                      value={tier.maxDays}
                      onChange={(e) => {
                        const newTiers = [...formData.pricingTiers];
                        newTiers[index].maxDays = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          pricingTiers: newTiers,
                        }));
                      }}
                      required
                      min="1"
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Price/Day"
                        value={tier.pricePerDay}
                        onChange={(e) => {
                          const newTiers = [...formData.pricingTiers];
                          newTiers[index].pricePerDay = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            pricingTiers: newTiers,
                          }));
                        }}
                        required
                        step="0.01"
                        min="0"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                      />
                      {formData.pricingTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              pricingTiers: prev.pricingTiers.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                          className="px-2 text-red-400 hover:text-red-300"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Show Price
                </label>
                <input
                  type="number"
                  name="showPrice"
                  placeholder="Show Price"
                  value={formData.showPrice}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Properties</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        properties: [
                          ...prev.properties,
                          { key: "", value: "" },
                        ],
                      }))
                    }
                    className="text-[#fe9a00] hover:text-[#e68a00] text-sm font-semibold"
                  >
                    + Add Property
                  </button>
                </div>
                {formData.properties.map((prop, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Key (e.g. Carry Weight)"
                      value={prop.key}
                      onChange={(e) => {
                        const newProps = [...formData.properties];
                        newProps[index].key = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          properties: newProps,
                        }));
                      }}
                      required
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Value (e.g. 1000kg)"
                        value={prop.value}
                        onChange={(e) => {
                          const newProps = [...formData.properties];
                          newProps[index].value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            properties: newProps,
                          }));
                        }}
                        required
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                      />
                      {formData.properties.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              properties: prev.properties.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                          className="px-2 text-red-400 hover:text-red-300"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Required License
                </label>
                <input
                  type="text"
                  name="requiredLicense"
                  placeholder="Required License"
                  value={formData.requiredLicense}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Extra Hours Rate (GBP/hour)
                </label>
                <input
                  type="number"
                  name="extrahoursRate"
                  placeholder="Extra Hours Rate (GBP/hour)"
                  value={formData.extrahoursRate}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Fuel Type
                </label>
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-400 text-sm block">
                  Gear Types
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.gear.availableTypes.includes("manual")}
                      onChange={(e) => {
                        const types = e.target.checked
                          ? [...formData.gear.availableTypes, "manual"]
                          : formData.gear.availableTypes.filter((t) => t !== "manual");
                        setFormData((prev) => ({
                          ...prev,
                          gear: { ...prev.gear, availableTypes: types },
                        }));
                      }}
                      className="w-4 h-4 accent-[#fe9a00]"
                    />
                    Manual
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.gear.availableTypes.includes("automatic")}
                      onChange={(e) => {
                        const types = e.target.checked
                          ? [...formData.gear.availableTypes, "automatic"]
                          : formData.gear.availableTypes.filter((t) => t !== "automatic");
                        setFormData((prev) => ({
                          ...prev,
                          gear: { ...prev.gear, availableTypes: types },
                        }));
                      }}
                      className="w-4 h-4 accent-[#fe9a00]"
                    />
                    Automatic
                  </label>
                </div>
                {formData.gear.availableTypes.includes("automatic") &&
                  formData.gear.availableTypes.includes("manual") && (
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Automatic Extra Cost (per day)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={formData.gear.automaticExtraCost}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gear: { ...prev.gear, automaticExtraCost: e.target.value },
                          }))
                        }
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                      />
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Seats
                  </label>
                  <input
                    type="number"
                    name="seats"
                    placeholder="Seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Doors
                  </label>
                  <input
                    type="number"
                    name="doors"
                    placeholder="Doors"
                    value={formData.doors}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold">
                  Service Period{" "}
                  <span className="text-white text-sm font-normal">
                    (enter each service period in days)
                  </span>
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
        onDuplicate={handleDuplicate}
        columns={[
          { key: "name", label: "Name" },
          {
            key: "type",
            label: "Type",
            render: (value: string | Type) =>
              typeof value === "string" ? value : value?.name || "-",
          },
          { key: "expert", label: "Expert" },
          {
            key: "showPrice" as keyof Category,
            label: "Show Price",
            render: (value: any) => (value ? `£${value}` : "-"),
          },
          {
            key: "properties" as keyof Category,
            label: "Properties",
            render: (value: any) =>
              Array.isArray(value) && value.length > 0 ? (
                <table className="text-xs">
                  <tbody>
                    {value.map((p: any, i: number) => (
                      <tr key={i}>
                        <td className="pr-2 font-semibold">{p.key}:</td>
                        <td>{p.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                "-"
              ),
          },
          {
            key: "pricingTiers" as keyof Category,
            label: "Pricing Tiers",
            render: (value: any) =>
              Array.isArray(value) && value.length > 0 ? (
                <table className="text-xs">
                  <tbody>
                    {value.map((t: any, i: number) => (
                      <tr key={i}>
                        <td className="pr-2">
                          {t.minDays}-{t.maxDays} days:
                        </td>
                        <td className="font-semibold">£{t.pricePerDay}/day</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                "-"
              ),
          },
          {
            key: "extrahoursRate" as keyof Category,
            label: "Extra Hours Rate",
            render: (value: any) => (value ? `£${value}/hr` : "-"),
          },
          {
            key: "requiredLicense" as keyof Category,
            label: "License",
          },
          { key: "fuel", label: "Fuel" },
          {
            key: "gear",
            label: "Gear",
            render: (value: any) => {
              const types = value?.availableTypes?.join(", ") || "-";
              const extra = value?.automaticExtraCost > 0 ? ` (+£${value.automaticExtraCost}/day auto)` : "";
              return types + extra;
            },
          },
          { key: "seats", label: "Seats" },
          { key: "doors", label: "Doors" },
        ]}
        onEdit={handleEdit}
        onMutate={(mutate) => (mutateRef.current = mutate)}
        hiddenColumns={
          [
            "properties",
            "pricingTiers",
            "expert",
            "requiredLicense",
          ] as (keyof Category)[]
        }
      />
    </div>
  );
}
