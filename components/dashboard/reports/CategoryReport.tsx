"use client";

import { useState, useEffect } from "react";
import DynamicTableView from "../DynamicTableView";

interface CategoryReport {
  _id: string;
  categoryName: string;
  count: number;
  totalPrice: number;
  avgPrice: number;
  id?: string;
}

interface ReportSummary {
  mostUsed: CategoryReport | null;
  leastUsed: CategoryReport | null;
  totalRevenue: number;
  totalReservations: number;
  categoriesCount: number;
}

export default function CategoryReport() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reports/categories");
      const result = await response.json();

      if (result.success) {
        setSummary(result.data.summary || result.summary);
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

  const columns = [
    {
      key: "categoryName",
      label: "Category",
    },
    {
      key: "count",
      label: "Reservations",
    },
    {
      key: "totalPrice",
      label: "Total Revenue",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "avgPrice",
      label: "Avg Price",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

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
            <p className="text-gray-400 text-sm mb-2">Active Categories</p>
            <p className="text-2xl font-bold text-white">
              {summary.categoriesCount}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Avg per Category</p>
            <p className="text-2xl font-bold text-white">
              $
              {summary.categoriesCount > 0
                ? (
                    summary.totalRevenue / summary.categoriesCount
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
                Most Used Category
              </p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.mostUsed.categoryName}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Reservations: {summary.mostUsed.count}</p>
                <p>
                  Total Revenue: ${summary.mostUsed.totalPrice.toLocaleString()}
                </p>
                <p>Avg Price: ${summary.mostUsed.avgPrice.toLocaleString()}</p>
              </div>
            </div>
          )}
          {summary.leastUsed && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-3">
                Least Used Category
              </p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.leastUsed.categoryName}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Reservations: {summary.leastUsed.count}</p>
                <p>
                  Total Revenue: $
                  {summary.leastUsed.totalPrice.toLocaleString()}
                </p>
                <p>Avg Price: ${summary.leastUsed.avgPrice.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories Table using DynamicTableView */}
      <DynamicTableView
        apiEndpoint="/api/reports/categories"
        title="Categories"
        columns={columns}
        itemsPerPage={10}
        hideDelete={true}
      />
    </div>
  );
}
