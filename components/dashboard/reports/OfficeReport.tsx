"use client";

import { useState, useEffect } from "react";
import { FiDownload, FiFilter } from "react-icons/fi";
import { showToast } from "@/lib/toast";

interface OfficeReport {
  _id: string;
  officeName: string;
  count: number;
  totalPrice: number;
  avgPrice: number;
}

interface ReportSummary {
  mostUsed: OfficeReport | null;
  leastUsed: OfficeReport | null;
  totalRevenue: number;
  totalReservations: number;
  officesCount: number;
}

export default function OfficeReportComponent() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [data, setData] = useState<OfficeReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reports/offices");
      const result = await response.json();

      if (result.success) {
        setSummary(result.data.summary || result.summary);
        setData(result.data.data || []);
      } else {
        setError(result.message || "Failed to fetch data");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching report";
      console.error("Error:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Office", "Reservations", "Total Revenue", "Avg Price"];
    const rows = data.map((office) => [
      office.officeName,
      office.count,
      office.totalPrice,
      office.avgPrice,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `office-report-${new Date().toISOString().split("T")[0]}.csv`;
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
            <p className="text-gray-400 text-sm mb-2">Active Offices</p>
            <p className="text-2xl font-bold text-white">
              {summary.officesCount}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Avg per Office</p>
            <p className="text-2xl font-bold text-white">
              $
              {summary.officesCount > 0
                ? (
                    summary.totalRevenue / summary.officesCount
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : 0}
            </p>
          </div>
        </div>
      )}

      {/* Most/Least Used */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.mostUsed && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-3">
                Most Used Office
              </p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.mostUsed.officeName}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Reservations: {summary.mostUsed.count}</p>
                <p>Total Revenue: ${summary.mostUsed.totalPrice.toLocaleString()}</p>
                <p>Avg Price: ${summary.mostUsed.avgPrice.toLocaleString()}</p>
              </div>
            </div>
          )}
          {summary.leastUsed && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-3">
                Least Used Office
              </p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.leastUsed.officeName}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Reservations: {summary.leastUsed.count}</p>
                <p>Total Revenue: ${summary.leastUsed.totalPrice.toLocaleString()}</p>
                <p>Avg Price: ${summary.leastUsed.avgPrice.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table with Export */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Offices Details</h3>
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
                <th className="px-4 py-3 text-left text-white font-bold">Office</th>
                <th className="px-4 py-3 text-left text-white font-bold">Reservations</th>
                <th className="px-4 py-3 text-left text-white font-bold">Total Revenue</th>
                <th className="px-4 py-3 text-left text-white font-bold">Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((office, idx) => (
                <tr
                  key={office._id}
                  className="border-b border-white/10 hover:bg-white/10 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                  <td className="px-4 py-3 text-white font-semibold">{office.officeName}</td>
                  <td className="px-4 py-3 text-gray-300">{office.count}</td>
                  <td className="px-4 py-3 text-gray-300">${office.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-300">${office.avgPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
