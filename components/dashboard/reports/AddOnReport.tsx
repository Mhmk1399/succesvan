"use client";

import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";

interface AddOnData {
  _id: string;
  name: string;
  usageCount: number;
  totalRevenue: number;
  avgUsagePerReservation: number;
  topCustomer: string;
  topCustomerUsage: number;
}

interface CustomerAddOnUsage {
  customerName: string;
  addOnName: string;
  usageCount: number;
  totalSpent: number;
}

interface ReportSummary {
  totalAddOns: number;
  totalAddOnRevenue: number;
  mostUsedAddOn: AddOnData | null;
  leastUsedAddOn: AddOnData | null;
  avgAddOnsPerReservation: number;
}

export default function AddOnReport() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [addOns, setAddOns] = useState<AddOnData[]>([]);
  const [customerUsage, setCustomerUsage] = useState<CustomerAddOnUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reports/addons");
      const result = await response.json();

      if (result.success) {
        setSummary(result.data.summary);
        setAddOns(result.data.addOns || []);
        setCustomerUsage(result.data.customerUsage || []);
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
    const headers = ["Add-On Name", "Usage Count" , "Avg Usage", "Top Customer"];
    const rows = addOns.map((addon) => [
      addon.name,
      addon.usageCount,
      addon.totalRevenue,
      addon.avgUsagePerReservation.toFixed(2),
      addon.topCustomer,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `addon-report-${new Date().toISOString().split("T")[0]}.csv`;
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
            <p className="text-gray-400 text-sm mb-2">Total Add-Ons</p>
            <p className="text-2xl font-bold text-[#fe9a00]">
              {summary.totalAddOns}
            </p>
          </div>
         
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Avg Add-Ons/Reservation</p>
            <p className="text-2xl font-bold text-white">
              {(summary?.avgAddOnsPerReservation || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Most Used Add-On</p>
            <p className="text-2xl font-bold text-green-400">
              {summary?.mostUsedAddOn?.usageCount || 0}x
            </p>
          </div>
        </div>
      )}

      {/* Most/Least Used Add-Ons */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary?.mostUsedAddOn && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-3">Most Used Add-On</p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.mostUsedAddOn.name}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Usage Count: {summary.mostUsedAddOn.usageCount}</p>
                 <p>Top Customer: {summary.mostUsedAddOn.topCustomer}</p>
              </div>
            </div>
          )}
          {summary?.leastUsedAddOn && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-3">Least Used Add-On</p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.leastUsedAddOn.name}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Usage Count: {summary.leastUsedAddOn.usageCount}</p>
                 <p>Top Customer: {summary.leastUsedAddOn.topCustomer}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add-Ons Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Add-Ons Performance</h3>
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
                <th className="px-4 py-3 text-left text-white font-bold">Add-On Name</th>
                <th className="px-4 py-3 text-left text-white font-bold">Usage Count</th>
                 <th className="px-4 py-3 text-left text-white font-bold">Top Customer</th>
              </tr>
            </thead>
            <tbody>
              {addOns.map((addon, idx) => (
                <tr
                  key={addon._id}
                  className="border-b border-white/10 hover:bg-white/10 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                  <td className="px-4 py-3 text-white font-semibold">{addon.name}</td>
                  <td className="px-4 py-3 text-gray-300">{addon.usageCount}</td>
                   <td className="px-4 py-3 text-gray-300">{addon.topCustomer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Add-On Usage */}
      {customerUsage.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Customer Add-On Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerUsage.slice(0, 9).map((usage, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">{usage.customerName}</p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-400">Add-On: <span className="text-[#fe9a00]">{usage.addOnName}</span></p>
                  <p className="text-gray-400">Usage: <span className="text-white font-semibold">{usage.usageCount}x</span></p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
