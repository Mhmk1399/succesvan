"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiX,
  FiEdit2,
  FiCopy,
  FiInbox,
  FiAlertCircle,
  FiFilter,
  FiPower,
} from "react-icons/fi";
import { format } from "date-fns";
import { showToast } from "@/lib/toast";
import "./tooltip.css";
import "./datepicker.css";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  AddOn,
  Category,
  DynamicTableViewProps,
  WorkingTime,
} from "@/types/type";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DynamicTableView<
  T extends { _id?: string; id?: string }
>({
  apiEndpoint,
  title,
  columns,
  onEdit,
  editButtonClass = "",
  onDuplicate,
  onStatusToggle,
  onMutate,
  itemsPerPage = 15,
  hideDelete = false,
  hideViewBtn = false,
  hiddenColumns = [],
  filters = [],
}: DynamicTableViewProps<T>) {
  console.log("DynamicTableView props:", { onStatusToggle: !!onStatusToggle });
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [togglingIds, setTogglingIds] = useState<string[]>([]);
  const startToggling = (id: string) =>
    setTogglingIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const stopToggling = (id: string) =>
    setTogglingIds((prev) => prev.filter((x) => x !== id));
  const isTogglingId = (id: string) => togglingIds.includes(id);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [dateRanges, setDateRanges] = useState<
    Record<string, [Date | null, Date | null]>
  >({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  const item = viewingItem as Record<string, any>;

  const buildUrl = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", itemsPerPage.toString());
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value) {
        // Handle range filters (Min/Max)
        if (key.endsWith("Min")) {
          const baseKey = key.slice(0, -3); // Remove 'Min'
          params.append(`${baseKey}Min`, value);
        } else if (key.endsWith("Max")) {
          const baseKey = key.slice(0, -3); // Remove 'Max'
          params.append(`${baseKey}Max`, value);
        } else {
          params.append(key, value);
        }
      }
    });
    Object.entries(dateRanges).forEach(([key, [start, end]]) => {
      if (start)
        params.append(`${key}Start`, start.toISOString().split("T")[0]);
      if (end) params.append(`${key}End`, end.toISOString().split("T")[0]);
    });
    const separator = apiEndpoint.includes("?") ? "&" : "?";
    return `${apiEndpoint}${separator}${params.toString()}`;
  };

  const { data, error, isLoading, mutate } = useSWR(buildUrl(), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  useEffect(() => {
    if (onMutate && mutate) {
      onMutate(mutate);
    }
  }, [mutate, onMutate]);

  const handleFilterApply = () => {
    setAppliedFilters(filterValues);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setFilterValues({});
    setDateRanges({});
    setAppliedFilters({});
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const items = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.pagination?.pages || 1;
  const hasFilters =
    Object.values(appliedFilters).some((v) => v) ||
    Object.values(dateRanges).some(([start, end]) => start || end);
  const isEmptyAfterFilter =
    !isLoading && !error && items.length === 0 && hasFilters;

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.key)
  );

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${apiEndpoint}/${deletingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Delete failed");

      showToast.success("Deleted successfully!");
      setIsDeleteOpen(false);
      setDeletingId(null);
      if (typeof mutate === "function") mutate(undefined, { revalidate: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed";
      showToast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-[#fe9a00]/30 border-t-[#fe9a00] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-300 text-lg font-semibold">
          Loading {title}...
        </p>
        <p className="text-gray-500 text-sm mt-2">Please wait</p>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <FiAlertCircle className="text-red-400 text-3xl" />
        </div>
        <p className="text-red-400 text-lg font-semibold">
          Failed to load data
        </p>
        <p className="text-gray-400 text-sm mt-2">Please try again later</p>
      </div>
    );
  if (isEmptyAfterFilter)
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                isFilterOpen
                  ? "bg-[#fe9a00] text-slate-900 shadow-lg shadow-[#fe9a00]/30"
                  : "bg-[#fe9a00]/20 hover:bg-[#fe9a00]/30 text-[#fe9a00]"
              }`}
            >
              <FiFilter className="text-lg" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={handleFilterReset}
              className="px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              // Handle range filters
              if (filter.type === "range") {
                const minValue = appliedFilters[`${filter.key}Min`];
                const maxValue = appliedFilters[`${filter.key}Max`];
                if (minValue || maxValue) {
                  return (
                    <div
                      key={filter.key}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      <span>
                        {filter.label}: {minValue || "0"} - {maxValue || "∞"}
                      </span>
                      <button
                        onClick={() => {
                          setAppliedFilters((prev) => ({
                            ...prev,
                            [`${filter.key}Min`]: "",
                            [`${filter.key}Max`]: "",
                          }));
                          setFilterValues((prev) => ({
                            ...prev,
                            [`${filter.key}Min`]: "",
                            [`${filter.key}Max`]: "",
                          }));
                        }}
                        className="hover:text-blue-200"
                      >
                        ✕
                      </button>
                    </div>
                  );
                }
                return null;
              }

              // Handle regular filters
              if (appliedFilters[filter.key]) {
                return (
                  <div
                    key={filter.key}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    <span>
                      {filter.label}: {appliedFilters[filter.key]}
                    </span>
                    <button
                      onClick={() => {
                        setAppliedFilters((prev) => ({
                          ...prev,
                          [filter.key]: "",
                        }));
                        setFilterValues((prev) => ({
                          ...prev,
                          [filter.key]: "",
                        }));
                      }}
                      className="hover:text-blue-200"
                    >
                      ✕
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-[#fe9a00]/20 rounded-full flex items-center justify-center mb-4">
            <FiInbox className="text-[#fe9a00] text-3xl" />
          </div>
          <p className="text-gray-300 text-lg font-semibold">
            No {title.toLowerCase()} found
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your filters
          </p>
          <button
            onClick={handleFilterReset}
            className="mt-4 px-4 py-2 bg-[#fe9a00]/20 hover:bg-[#fe9a00]/30 text-[#fe9a00] rounded-lg transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-[#fe9a00]/20 rounded-full flex items-center justify-center mb-4">
          <FiInbox className="text-[#fe9a00] text-3xl" />
        </div>
        <p className="text-gray-300 text-lg font-semibold">
          No {title.toLowerCase()} yet
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Start by creating your first {title.toLowerCase()}
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              isFilterOpen
                ? "bg-[#fe9a00] text-slate-900 shadow-lg shadow-[#fe9a00]/30"
                : "bg-[#fe9a00]/20 hover:bg-[#fe9a00]/30 text-[#fe9a00]"
            }`}
          >
            <FiFilter className="text-lg" />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
          {hasFilters && (
            <button
              onClick={handleFilterReset}
              className="px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {isFilterOpen && filters.length > 0 && (
        <div className="bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-xl p-6 space-y-4 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filters.map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 block">
                  {f.label}
                </label>
                {f.type === "text" && (
                  <input
                    type="text"
                    placeholder={`Enter ${f.label.toLowerCase()}...`}
                    value={filterValues[f.key] || ""}
                    onChange={(e) =>
                      setFilterValues((p) => ({
                        ...p,
                        [f.key]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleFilterApply()}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:bg-white/15 transition-all"
                  />
                )}
                {f.type === "date" && (
                  <div className="flex gap-2">
                    <DatePicker
                      selected={dateRanges[f.key]?.[0] || null}
                      onChange={(date) => {
                        const [start, end] = dateRanges[f.key] || [null, null];
                        setDateRanges((p) => ({
                          ...p,
                          [f.key]: [date, end],
                        }));
                        setCurrentPage(1);
                      }}
                      placeholderText="Start date"
                      dateFormat="yyyy-MM-dd"
                      className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#fe9a00] focus:bg-white/15 transition-all"
                    />
                    <DatePicker
                      selected={dateRanges[f.key]?.[1] || null}
                      onChange={(date) => {
                        const [start, end] = dateRanges[f.key] || [null, null];
                        setDateRanges((p) => ({
                          ...p,
                          [f.key]: [start, date],
                        }));
                        setCurrentPage(1);
                      }}
                      placeholderText="End date"
                      dateFormat="yyyy-MM-dd"
                      className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#fe9a00] focus:bg-white/15 transition-all"
                    />
                  </div>
                )}
                {f.type === "select" && (
                  <CustomSelect
                    options={f.options || []}
                    value={filterValues[f.key] || ""}
                    onChange={(val) =>
                      setFilterValues((p) => ({
                        ...p,
                        [f.key]: val,
                      }))
                    }
                    placeholder={`Select ${f.label}`}
                  />
                )}
                {f.type === "range" && (
                  <div className="flex  gap-2">
                    <input
                      type={f.rangeType === "number" ? "number" : "text"}
                      placeholder={`Min ${f.label.toLowerCase()}`}
                      value={filterValues[`${f.key}Min`] || ""}
                      onChange={(e) =>
                        setFilterValues((p) => ({
                          ...p,
                          [`${f.key}Min`]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleFilterApply()
                      }
                      className="md:w-49 w-35 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:bg-white/15 transition-all"
                      min={f.rangeType === "number" ? "0" : undefined}
                      step={f.rangeType === "number" ? "0.01" : undefined}
                    />
                    <input
                      type={f.rangeType === "number" ? "number" : "text"}
                      placeholder={`Max ${f.label.toLowerCase()}`}
                      value={filterValues[`${f.key}Max`] || ""}
                      onChange={(e) =>
                        setFilterValues((p) => ({
                          ...p,
                          [`${f.key}Max`]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleFilterApply()
                      }
                      className="md:w-49 w-37 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] focus:bg-white/15 transition-all"
                      min={f.rangeType === "number" ? "0" : undefined}
                      step={f.rangeType === "number" ? "0.01" : undefined}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={handleFilterReset}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleFilterApply}
              className="px-6 py-2.5 bg-[#fe9a00] hover:bg-[#fe9a00]/90 text-slate-900 font-bold rounded-lg transition-all shadow-lg shadow-[#fe9a00]/30 hover:shadow-[#fe9a00]/50"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/70">
            <tr>
              <th className="px-3 py-4 text-left text-white font-bold w-12">
                #
              </th>
              {visibleColumns.map((col, colIdx) => (
                <th
                  key={`${colIdx}-${String(col.key)}`}
                  className="px-3 py-4 text-sm text-left text-white font-extrabold"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-4 text-left text-white font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: T, idx: number) => {
              const itemId =
                (item as any)._id || (item as any).id || String(idx);
              return (
                <tr
                  key={idx}
                  className="border-b border-white/10 hover:bg-white/10 transition-colors"
                >
                  <td className="px-3 py-2 text-gray-300 font-semibold">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  {visibleColumns.map((col, colIdx) => {
                    const cellValue = item[col.key];
                    let displayContent;

                    if (col.render) {
                      displayContent = col.render(cellValue, item);
                    } else if (
                      typeof cellValue === "object" &&
                      cellValue !== null
                    ) {
                      displayContent = JSON.stringify(cellValue);
                    } else {
                      displayContent = String(cellValue || "-");
                    }

                    return (
                      <td
                        key={`${colIdx}-${String(col.key)}`}
                        className="px-3 py-2 text-gray-300"
                      >
                        {displayContent}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 justify-center items-center flex gap-2">
                    {!hideViewBtn && (
                      <button
                        onClick={() => {
                          setViewingItem(item);
                          setIsViewOpen(true);
                        }}
                        className="p-2 hover:bg-green-500/20 cursor-pointer rounded transition-colors tooltip"
                       >
                        <FiEye className="text-yellow-400" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className={`p-2 hover:bg-blue-500/20 rounded cursor-pointer transition-colors tooltip ${editButtonClass}`}
                        data-tooltip="Edit"
                      >
                        <FiEdit2 className="text-blue-400" />
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        onClick={() => onDuplicate(item)}
                        className="p-2 hover:bg-purple-500/20 rounded cursor-pointer transition-colors tooltip"
                        data-tooltip="Duplicate"
                      >
                        <FiCopy className="text-purple-400" />
                      </button>
                    )}
                    {onStatusToggle && (
                      <button
                        onClick={async () => {
                          if (isTogglingId(itemId)) return;
                          startToggling(itemId);
                          try {
                            await Promise.resolve(onStatusToggle(item));
                          } catch (err) {
                            console.log("Status toggle failed:", err);
                          } finally {
                            stopToggling(itemId);
                          }
                        }}
                        className={`p-2 rounded cursor-pointer transition-colors tooltip ${
                          isTogglingId(itemId)
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-orange-500/20"
                        }`}
                        data-tooltip="Toggle Status"
                        disabled={isTogglingId(itemId)}
                      >
                        {isTogglingId(itemId) ? (
                          <span className="w-4 h-4 inline-block border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiPower
                            className={
                              (item as Record<string, unknown>).status ===
                              "active"
                                ? "text-green-400"
                                : "text-orange-400"
                            }
                          />
                        )}
                      </button>
                    )}
                    {!hideDelete && (
                      <button
                        onClick={() =>
                          handleDeleteClick(item._id || item.id || "")
                        }
                        className="p-2 hover:bg-red-500/20 rounded cursor-pointer transition-colors tooltip"
                        data-tooltip="Delete"
                      >
                        <FiTrash2 className="text-red-400" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isViewOpen && viewingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm min-h-screen z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">View {title}</h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {item.image && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Image
                  </label>
                  <div className="mt-2 w-1/2 h-1/2">
                    <Image
                      src={item.image}
                      alt={title}
                      width={300}
                      height={200}
                      className="rounded-lg object-contain w-full"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              {columns.map((col, colIdx) => {
                const isHidden = hiddenColumns.includes(col.key);
                const value = item[col.key as string];
                let displayValue;

                if (col.render) {
                  displayValue = col.render(value, viewingItem);
                } else if (typeof value === "object" && value !== null) {
                  displayValue = JSON.stringify(value);
                } else {
                  displayValue = String(value || "-");
                }

                return (
                  <div key={`${colIdx}-${String(col.key)}`}>
                    <label className="text-sm font-semibold text-gray-400">
                      {col.label}
                      {isHidden && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Hidden in table)
                        </span>
                      )}
                    </label>
                    <div className="text-white mt-1">{displayValue}</div>
                  </div>
                );
              })}

              {item.category && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Category
                  </label>
                  <div className="text-white mt-1">
                    <p className="mb-2">{item.category.name}</p>
                    {item.category?.image && (
                      <div className="mt-2">
                        <Image
                          src={item.category.image}
                          alt="Category"
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.office && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Office
                  </label>
                  <p className="text-white mt-1">{item.office.name}</p>
                </div>
              )}

              {item.categories && item.categories.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Categories
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.categories.map((cat: Category, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#fe9a00]/20 text-[#fe9a00] rounded-full text-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.workingTime && item.workingTime.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Working Hours
                  </label>
                  <div className="mt-2 space-y-2">
                    {item.workingTime.map((wt: WorkingTime, idx: number) => (
                      <div
                        key={idx}
                        className="text-white text-sm bg-white/5 p-2 rounded"
                      >
                        <span className="font-semibold capitalize">
                          {wt.day}:
                        </span>{" "}
                        {wt.isOpen
                          ? `${wt.startTime} - ${wt.endTime}`
                          : "Closed"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.addOns && item.addOns.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Add-ons
                  </label>
                  <div className="mt-2 space-y-2">
                    {item.addOns.map(
                      (
                        addOnItem: {
                          addOn?: AddOn;
                          quantity: number;
                          selectedTierIndex?: number;
                        },
                        idx: number
                      ) => {
                        const addon = addOnItem.addOn;
                        let price = 0;
                        let tierInfo = "";

                        if (addon?.pricingType === "flat") {
                          // Handle both old format (number) and new format (object)
                          if (
                            typeof addon.flatPrice === "object" &&
                            addon.flatPrice !== null
                          ) {
                            price = (addon.flatPrice as any).amount || 0;
                          } else {
                            price = addon.flatPrice || 0;
                          }
                        } else if (addon?.pricingType === "tiered") {
                          const tierIndex = addOnItem.selectedTierIndex ?? 0;
                          const tier = addon.tiers?.[tierIndex];
                          if (tier) {
                            price = tier.price;
                            tierInfo = ` (${tier.minDays}-${tier.maxDays} days)`;
                          }
                        }

                        return (
                          <div
                            key={idx}
                            className="text-white text-sm bg-white/5 p-3 rounded flex justify-between items-center"
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {addon?.name || "Unknown"}
                              </span>
                              {addon?.description && (
                                <span className="text-gray-400 text-xs mt-1">
                                  {addon.description}
                                </span>
                              )}
                              {tierInfo && (
                                <span className="text-[#fe9a00] text-xs mt-1">
                                  {tierInfo}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">
                                Qty: {addOnItem.quantity}
                              </span>
                              <span className="font-semibold">£{price}</span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {item.servicesPeriod && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Service Period (Days)
                  </label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(item.servicesPeriod).map(
                      ([key, value]: [string, any]) => (
                        <div
                          key={key}
                          className="text-white text-sm bg-white/5 p-2 rounded"
                        >
                          <span className="font-semibold capitalize">
                            {key}:
                          </span>{" "}
                          {value}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {item.serviceHistory && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Service History
                  </label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(item.serviceHistory).map(
                      ([key, value]: [string, any]) => (
                        <div
                          key={key}
                          className="text-white text-sm bg-white/5 p-2 rounded"
                        >
                          <span className="font-semibold capitalize">
                            {key}:
                          </span>{" "}
                          {format(new Date(value), "dd/MM/yyyy")}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {item.images && item.images.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Images
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {item.images
                      .filter((img: string) => img && img.trim())
                      .map((img: string, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => window.open(img, "_blank")}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <Image
                            src={img}
                            alt={`Image ${idx + 1}`}
                            width={150}
                            height={120}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {item.licenceAttached &&
                (item.licenceAttached.front || item.licenceAttached.back) && (
                  <div>
                    <label className="text-sm font-semibold text-gray-400">
                      License
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      {item.licenceAttached.front && (
                        <div
                          onClick={() =>
                            window.open(item.licenceAttached.front, "_blank")
                          }
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <p className="text-xs text-gray-400 mb-2">Front</p>
                          <Image
                            src={item.licenceAttached.front}
                            alt="licences Front"
                            width={150}
                            height={100}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      {item.licenceAttached.back && (
                        <div
                          onClick={() =>
                            window.open(item.licenceAttached.back, "_blank")
                          }
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <p className="text-xs text-gray-400 mb-2">Back</p>
                          <Image
                            src={item.licenceAttached.back}
                            alt="licences Back"
                            width={150}
                            height={100}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm min-h-screen z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847]/50 rounded-2xl max-w-sm w-full border border-white/10">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-black text-white">Delete {title}?</h2>
              <p className="text-gray-400">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-white/10 rounded disabled:opacity-50"
          >
            <FiChevronLeft className="text-white" />
          </button>
          <span className="text-[#fe9a00] border-b">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-white/10 rounded disabled:opacity-50"
          >
            <FiChevronRight className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}