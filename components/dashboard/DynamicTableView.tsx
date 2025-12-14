"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import {
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiX,
  FiEdit2,
  FiCopy,
  FiInbox,
} from "react-icons/fi";
import { format } from "date-fns";
import { showToast } from "@/lib/toast";
import "./tooltip.css";
import { DynamicTableViewProps } from "@/types/type";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DynamicTableView<
  T extends { _id?: string; id?: string }
>({
  apiEndpoint,
  title,
  columns,
  onEdit,
  onDuplicate,
  onMutate,
  itemsPerPage = 10,
  hideDelete = false,
}: DynamicTableViewProps<T>) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading, mutate } = useSWR(apiEndpoint, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  useEffect(() => {
    if (onMutate && mutate) {
      onMutate(mutate);
    }
  }, [mutate, onMutate]);

  const items = data?.data || [];
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

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
    } catch (error: any) {
      showToast.error(error.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return <div className="text-white text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">Failed to load data</div>
    );
  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FiInbox className="text-gray-400 text-6xl mb-4" />
        <p className="text-gray-400 text-lg">No data available yet</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/50">
            <tr>
              {columns.map((col, colIdx) => (
                <th
                  key={`${colIdx}-${String(col.key)}`}
                  className="px-3 py-4 text-left text-white font-semibold"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-4 text-left text-white font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item: T, idx: number) => (
              <tr
                key={idx}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={`${colIdx}-${String(col.key)}`}
                    className="px-3 py-2 text-gray-300"
                  >
                    {col.render
                      ? col.render(item[col.key], item)
                      : String(item[col.key] || "-")}
                  </td>
                ))}
                <td className="px-3 py-2 flex gap-2">
                  <button
                    onClick={() => {
                      setViewingItem(item);
                      setIsViewOpen(true);
                    }}
                    className="p-2 hover:bg-green-500/20 cursor-pointer rounded transition-colors tooltip"
                    data-tooltip="View"
                  >
                    <FiEye className="text-green-400" />
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 hover:bg-blue-500/20 rounded cursor-pointer transition-colors tooltip"
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
                  {!hideDelete && (
                    <button
                      onClick={() => handleDeleteClick(item._id || item.id || "")}
                      className="p-2 hover:bg-red-500/20 rounded cursor-pointer transition-colors tooltip"
                      data-tooltip="Delete"
                    >
                      <FiTrash2 className="text-red-400" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isViewOpen && viewingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
              {columns.map((col, colIdx) => (
                <div key={`${colIdx}-${String(col.key)}`}>
                  <label className="text-sm font-semibold text-gray-400">
                    {col.label}
                  </label>
                  <div className="text-white mt-1">
                    {col.render
                      ? col.render(viewingItem[col.key], viewingItem)
                      : String(viewingItem[col.key] || "-")}
                  </div>
                </div>
              ))}

              {(viewingItem as any).category && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Category
                  </label>
                  <div className="text-white mt-1">
                    <p className="mb-2">{(viewingItem as any).category.name}</p>
                    {(viewingItem as any).category?.image && (
                      <div className="mt-2">
                        <Image
                          src={(viewingItem as any).category.image}
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

              {(viewingItem as any).office && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Office
                  </label>
                  <p className="text-white mt-1">
                    {(viewingItem as any).office.name}
                  </p>
                </div>
              )}

              {(viewingItem as any).categories &&
                (viewingItem as any).categories.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-400">
                      Categories
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(viewingItem as any).categories.map(
                        (cat: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#fe9a00]/20 text-[#fe9a00] rounded-full text-sm"
                          >
                            {cat.name || cat}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {(viewingItem as any).workingTime &&
                (viewingItem as any).workingTime.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-400">
                      Working Hours
                    </label>
                    <div className="mt-2 space-y-2">
                      {(viewingItem as any).workingTime.map(
                        (wt: any, idx: number) => (
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
                        )
                      )}
                    </div>
                  </div>
                )}



              {(viewingItem as any).addOns &&
                (viewingItem as any).addOns.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-400">
                      Add-ons
                    </label>
                    <div className="mt-2 space-y-2">
                      {(viewingItem as any).addOns.map(
                        (item: any, idx: number) => {
                          const addon = item.addOn;
                          let price = 0;
                          let tierInfo = "";
                          
                          if (addon?.pricingType === "flat") {
                            price = addon.flatPrice || 0;
                          } else if (addon?.pricingType === "tiered") {
                            const tierIndex = item.selectedTierIndex ?? 0;
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
                                  Qty: {item.quantity}
                                </span>
                                <span className="font-semibold">
                                  £{price}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {(viewingItem as any).servicesPeriod && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Service Period (Days)
                  </label>
                  <div className="mt-2 space-y-2">
                    {Object.entries((viewingItem as any).servicesPeriod).map(
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

              {(viewingItem as any).serviceHistory && (
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Service History
                  </label>
                  <div className="mt-2 space-y-2">
                    {Object.entries((viewingItem as any).serviceHistory).map(
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

              {(viewingItem as any).images &&
                (viewingItem as any).images.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-400">
                      Images
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(viewingItem as any).images.map(
                        (img: string, idx: number) => (
                          <Image
                            key={idx}
                            src={img}
                            alt={`Image ${idx + 1}`}
                            width={150}
                            height={120}
                            className="rounded-lg object-cover"
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-sm w-full border border-white/10">
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
                  className="flex-1 px-4 py-3   hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-semibold disabled:opacity-50"
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
          <span className="text-white">
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
