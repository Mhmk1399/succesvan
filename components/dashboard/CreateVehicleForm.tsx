"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiPlus, FiCalendar } from "react-icons/fi";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { showToast } from "@/lib/toast";
import { Category, Office, Reservation, Vehicle } from "@/types/type";
import DynamicTableView from "./DynamicTableView";
import CustomSelect from "@/components/ui/CustomSelect";

export default function VehiclesContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { _id?: string; name: string }[]
  >([]);
  const [offices, setOffices] = useState<{ _id?: string; name: string }[]>([]);
  const [reservations, setReservations] = useState<
    { _id: string; name: string }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [showServiceDatePicker, setShowServiceDatePicker] = useState<
    string | null
  >(null);
  const mutateRef = useRef<(() => Promise<any>) | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: "",
    number: "",
    category: "",
    office: "",
    reservation: "",
    properties: [{ name: "", value: "" }],
    needsService: false,
    serviceHistory: {
      tire: new Date(),
      oil: new Date(),
      battery: new Date(),
      air: new Date(),
      service: new Date(),
    },
    status: "active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, offRes, resRes] = await Promise.all([
          fetch("/api/categories?limit=100&status=active"),
          fetch("/api/offices?limit=100&status=active"),
          fetch("/api/reservations?limit=100"),
        ]);
        const catData = await catRes.json();
        const offData = await offRes.json();
        const resData = await resRes.json();

        const categoriesData = (catData.data || []).map((cat: Category) => ({
          _id: cat._id,
          name: cat.name,
        }));
        const officesData = (offData.data || []).map((off: Office) => ({
          _id: off._id,
          name: off.name,
        }));

        setCategories(categoriesData);
        setOffices(officesData);
        setReservations(
          (resData.data || []).map((res: Reservation) => ({
            _id: res._id,
            name: `Res #${res._id?.slice(-6)} - ${res.user?.name || "Unknown"}`,
          }))
        );
      } catch (error) {
        console.log("Failed to fetch data:", error);
      } finally {
        setLoadingCategories(false);
        setLoadingOffices(false);
        setLoadingReservations(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePropertyChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.properties];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, properties: updated };
    });
  };

  const addProperty = () => {
    setFormData((prev) => ({
      ...prev,
      properties: [...prev.properties, { name: "", value: "" }],
    }));
  };

  const removeProperty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index),
    }));
  };

  const handleServiceDateChange = (field: string, date: Date) => {
    setFormData((prev) => ({
      ...prev,
      serviceHistory: { ...prev.serviceHistory, [field]: date },
    }));
    setShowServiceDatePicker(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      images: "",
      number: "",
      category: "",
      office: "",
      reservation: "",
      properties: [{ name: "", value: "" }],
      needsService: false,
      serviceHistory: {
        tire: new Date(),
        oil: new Date(),
        battery: new Date(),
        air: new Date(),
        service: new Date(),
      },
      status: "active",
    });
    setEditingId(null);
  };

  const handleEdit = (item: Vehicle) => {
    const categoryId =
      typeof item.category === "string"
        ? item.category
        : (item.category as any)?._id || "";
    const officeId =
      typeof (item as any).office === "string"
        ? (item as any).office
        : (item as any).office?._id || "";
    const reservationId =
      (item as any).reservation?._id || (item as any).reservation || "";

    setFormData({
      title: item.title,
      description: item.description,
      images: Array.isArray(item.images) ? item.images.join(", ") : item.images,
      number: (item as any).number || "",
      category: categoryId,
      office: officeId,
      reservation: reservationId,
      properties: item.properties || [{ name: "", value: "" }],
      needsService: item.needsService,
      serviceHistory: item.serviceHistory || {
        tire: new Date(),
        oil: new Date(),
        battery: new Date(),
        air: new Date(),
        service: new Date(),
      },
      status: (item as any).status || "active",
    });
    setEditingId(item._id || null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/vehicles/${editingId}` : "/api/vehicles";

      const payload = {
        title: formData.title,
        description: formData.description,
        images: formData.images.split(",").map((img) => img.trim()),
        number: formData.number,
        category: formData.category,
        office: formData.office,
        ...(formData.reservation && { reservation: formData.reservation }),
        properties: formData.properties.filter((p) => p.name && p.value),
        needsService: formData.needsService,
        serviceHistory: {
          tire: formData.serviceHistory.tire,
          oil: formData.serviceHistory.oil,
          battery: formData.serviceHistory.battery,
          air: formData.serviceHistory.air,
          service: formData.serviceHistory.service,
        },
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
        `Vehicle ${editingId ? "updated" : "created"} successfully!`
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
        <FiPlus /> Add Vehicle
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Edit Vehicle" : "Create Vehicle"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <label className="text-gray-400 text-sm mb-2 block">
                Vehicle Name
              </label>
              <input
                type="text"
                name="title"
                placeholder="Vehicle Name"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
              <label className="text-gray-400 text-sm mb-2 block">
                Vehicle description
              </label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
              <label className="text-gray-400 text-sm mb-2 block">
                Vehicle Image
              </label>
              <input
                type="text"
                name="images"
                placeholder="Image URLs (comma-separated)"
                value={formData.images}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
              <label className="text-gray-400 text-sm mb-2 block">
                Vehicle number
              </label>
              <input
                type="text"
                name="number"
                placeholder="Vehicle Number"
                value={formData.number}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
              <label className="text-gray-400 text-sm mb-2 block">
                office  
              </label>
              <CustomSelect
                options={offices}
                value={formData.office}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, office: val }))
                }
                placeholder={
                  loadingOffices ? "Loading offices..." : "Select Office"
                }
              />
              <label className="text-gray-400 text-sm mb-2 block">
                category  
              </label>
              <CustomSelect
                options={categories}
                value={formData.category}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: val }))
                }
                placeholder={
                  loadingCategories
                    ? "Loading categories..."
                    : "Select Category"
                }
              />
              <label className="text-gray-400 text-sm mb-2 block">
                reservation  
              </label>
              <CustomSelect
                options={reservations}
                value={formData.reservation}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, reservation: val }))
                }
                placeholder={
                  loadingReservations
                    ? "Loading reservations..."
                    : "Select Reservation (Optional)"
                }
              />
              <label className="text-gray-400 text-sm mb-2 block">
                status
              </label>
              <CustomSelect
                options={[
                  { _id: "active", name: "Active" },
                  { _id: "inactive", name: "Inactive" },
                ]}
                value={formData.status}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
                placeholder="Select Status"
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Properties</h3>
                  <button
                    type="button"
                    onClick={addProperty}
                    className="px-3 py-1 bg-[#fe9a00]/20 hover:bg-[#fe9a00]/30 text-[#fe9a00] rounded text-sm font-semibold"
                  >
                    + Add
                  </button>
                </div>
                {formData.properties.map((prop, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Property Name"
                      value={prop.name}
                      onChange={(e) =>
                        handlePropertyChange(idx, "name", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Property Value"
                      value={prop.value}
                      onChange={(e) =>
                        handlePropertyChange(idx, "value", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] text-sm"
                    />
                    {formData.properties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProperty(idx)}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="needsService"
                  checked={formData.needsService}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-white text-sm">Needs Service</span>
              </label>

              <div className="space-y-3">
                <h3 className="text-white font-semibold">Service History</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["tire", "oil", "battery", "air", "service"].map((field) => (
                    <div key={field} className="relative">
                      <label className="text-xs text-gray-400 capitalize">
                        {field} Service
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setShowServiceDatePicker(
                            showServiceDatePicker === field ? null : field
                          )
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm text-left focus:outline-none focus:border-[#fe9a00] flex items-center gap-2"
                      >
                        <FiCalendar className="text-[#fe9a00]" />
                        {format(
                          formData.serviceHistory[
                            field as keyof typeof formData.serviceHistory
                          ],
                          "dd/MM/yyyy"
                        )}
                      </button>
                      {showServiceDatePicker === field && (
                        <div className="absolute top-full mt-2 z-50 bg-slate-800 backdrop-blur-xl border border-white/20 rounded-lg p-3">
                          <DateRange
                            ranges={[
                              {
                                startDate:
                                  formData.serviceHistory[
                                    field as keyof typeof formData.serviceHistory
                                  ],
                                endDate:
                                  formData.serviceHistory[
                                    field as keyof typeof formData.serviceHistory
                                  ],
                                key: "selection",
                              },
                            ]}
                            onChange={(item) => {
                              handleServiceDateChange(
                                field,
                                item.selection.startDate || new Date()
                              );
                            }}
                            maxDate={new Date()}
                            rangeColors={["#fe9a00"]}
                          />
                          <button
                            type="button"
                            onClick={() => setShowServiceDatePicker(null)}
                            className="w-full mt-2 px-3 py-1.5 bg-[#fe9a00] text-slate-900 font-semibold rounded text-xs hover:bg-[#e68a00]"
                          >
                            Done
                          </button>
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

      <DynamicTableView<Vehicle>
        apiEndpoint="/api/vehicles"
        filters={[
          { key: "title", label: "Title", type: "text" },
          { key: "number", label: "Number", type: "text" },
          {
            key: "office",
            label: "Office",
            type: "select",
            options: offices.filter((o) => o._id) as {
              _id: string;
              name: string;
            }[],
          },
        ]}
        title="Vehicle"
        columns={[
          { key: "title", label: "Title" },
          { key: "number", label: "Number" },
          {
            key: "office" as any,
            label: "Office",
            render: (value) => value?.name || "-",
          },
          {
            key: "needsService",
            label: "Needs Service",
            render: (value) => (value ? "Yes" : "No"),
          },
        ]}
        onEdit={handleEdit}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />

      <style jsx global>{`
        .rdrCalendarWrapper {
          background-color: transparent !important;
          border: none !important;
        }
        .rdrMonth {
          width: 100%;
        }
        .rdrDayNumber span {
          color: white !important;
        }
        .rdrDayPassive .rdrDayNumber span {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .rdrDayToday .rdrDayNumber span {
          color: #fe9a00 !important;
          font-weight: bold;
        }
        .rdrDayInRange {
          background-color: rgba(254, 154, 0, 0.2) !important;
        }
        .rdrDayStartOfMonth .rdrDayNumber span,
        .rdrDayEndOfMonth .rdrDayNumber span {
          color: white !important;
          font-weight: bold;
        }
        .rdrWeekDay {
          color: #fe9a00 !important;
        }
      `}</style>
    </div>
  );
}
