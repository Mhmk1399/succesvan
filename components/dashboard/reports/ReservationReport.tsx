"use client";

import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";

interface ReservationData {
  _id: string;
  customerName: string;
  categoryName: string;
  totalPrice: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface ReportSummary {
  totalRevenue: number;
  totalReservations: number;
  avgPrice: number;
  topReservation: ReservationData | null;
  customerStats: { [key: string]: { count: number; totalPrice: number } };
}

export default function ReservationReport() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [data, setData] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reports/reservations");
      const result = await response.json();

      if (result.success) {
        setSummary(result.data.summary);
        setData(result.data.data || []);
      } else {
        setError(result.message || "Failed to fetch data");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error fetching report";
      console.error("Error:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Customer",
      "Category",
      "Price",
      "Start Date",
      "End Date",
      "Status",
    ];
    const rows = data.map((res) => [
      res.customerName,
      res.categoryName,
      res.totalPrice,
      new Date(res.startDate).toLocaleDateString(),
      new Date(res.endDate).toLocaleDateString(),
      res.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservation-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading report data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-[#fe9a00]">
              ${summary.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Total Reservations</p>
            <p className="text-2xl font-bold text-white">
              {summary.totalReservations}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Average Price</p>
            <p className="text-2xl font-bold text-white">
              ${summary.avgPrice.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Top Reservation</p>
            <p className="text-2xl font-bold text-[#fe9a00]">
              ${summary.topReservation?.totalPrice.toLocaleString() || 0}
            </p>
          </div>
        </div>
      )}

      {/* Top Reservation */}
      {summary?.topReservation && (
        <div className="bg-linear-to-r from-[#fe9a00]/20 to-[#fe9a00]/10 border border-[#fe9a00]/30 rounded-lg p-4">
          <p className="text-[#fe9a00] font-semibold mb-3">Top Reservation</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Customer</p>
              <p className="text-white font-semibold">
                {summary.topReservation.customerName}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Category</p>
              <p className="text-white font-semibold">
                {summary.topReservation.categoryName}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Price</p>
              <p className="text-[#fe9a00] font-bold">
                ${summary.topReservation.totalPrice}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Status</p>
              <p
                className={`font-semibold ${
                  summary.topReservation.status === "completed"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {summary.topReservation.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Stats */}
      {summary?.customerStats &&
        Object.keys(summary.customerStats).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Customer Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summary.customerStats).map(
                ([customer, stats]) => (
                  <div
                    key={customer}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <p className="text-white font-semibold mb-2">{customer}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">
                        Reservations:{" "}
                        <span className="text-[#fe9a00] font-semibold">
                          {stats.count}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        Total Price:{" "}
                        <span className="text-[#fe9a00] font-semibold">
                          ${stats.totalPrice}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Table with Export */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">All Reservations</h3>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/70">
              <tr>
                <th className="px-4 py-3 text-left text-white font-bold">#</th>
                <th className="px-4 py-3 text-left text-white font-bold">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-white font-bold">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-white font-bold">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-white font-bold">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-white font-bold">
                  End Date
                </th>
                <th className="px-4 py-3 text-left text-white font-bold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((res, idx) => (
                <tr
                  key={res._id}
                  className="border-b border-white/10 hover:bg-white/10 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                  <td className="px-4 py-3 text-white font-semibold">
                    {res.customerName}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {res.categoryName}
                  </td>
                  <td className="px-4 py-3 text-[#fe9a00] font-semibold">
                    ${res.totalPrice}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(res.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(res.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        res.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : res.status === "confirmed"
                          ? "bg-blue-500/20 text-blue-400"
                          : res.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
