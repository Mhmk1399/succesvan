"use client";

import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";

interface CustomerData {
  _id: string;
  name: string;
  reservationCount: number;
  totalPrice: number;
  createdAt: string;
}

interface ReportSummary {
  totalCustomers: number;
  totalRevenue: number;
  avgReservationsPerCustomer: number;
  newUsersThisMonth: number;
  usersThisMonth: number;
  mostReserved: CustomerData | null;
  leastReserved: CustomerData | null;
}

export default function CustomerReport() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [data, setData] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reports/customers");
      const result = await response.json();

      if (result.success) {
        setSummary(result.data.summary);
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
    const headers = ["Customer Name", "Reservations", "Total Price", "Joined Date"];
    const rows = data.map((customer) => [
      customer.name,
      customer.reservationCount,
      customer.totalPrice,
      new Date(customer.createdAt).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-report-${new Date().toISOString().split("T")[0]}.csv`;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Total Customers</p>
            <p className="text-2xl font-bold text-[#fe9a00]">
              {summary.totalCustomers}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-white">
              ${summary.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Avg Reservations</p>
            <p className="text-2xl font-bold text-white">
              {summary.avgReservationsPerCustomer.toFixed(1)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">New Users (This Month)</p>
            <p className="text-2xl font-bold text-green-400">
              {summary.newUsersThisMonth}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Active (This Month)</p>
            <p className="text-2xl font-bold text-blue-400">
              {summary.usersThisMonth}
            </p>
          </div>
        </div>
      )}

      {/* Most/Least Reserved */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.mostReserved && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-3">Most Reserved User</p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.mostReserved.name}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Reservations: {summary.mostReserved.reservationCount}</p>
                <p>Total Price: ${summary.mostReserved.totalPrice.toLocaleString()}</p>
                <p>Joined: {new Date(summary.mostReserved.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          {summary.leastReserved && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-3">Least Reserved User</p>
              <p className="text-white text-lg font-bold mb-2">
                {summary.leastReserved.name}
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Reservations: {summary.leastReserved.reservationCount}</p>
                <p>Total Price: ${summary.leastReserved.totalPrice.toLocaleString()}</p>
                <p>Joined: {new Date(summary.leastReserved.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table with Export */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">All Customers</h3>
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
                <th className="px-4 py-3 text-left text-white font-bold">Customer Name</th>
                <th className="px-4 py-3 text-left text-white font-bold">Reservations</th>
                <th className="px-4 py-3 text-left text-white font-bold">Total Price</th>
                <th className="px-4 py-3 text-left text-white font-bold">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((customer, idx) => (
                <tr
                  key={customer._id}
                  className="border-b border-white/10 hover:bg-white/10 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                  <td className="px-4 py-3 text-white font-semibold">{customer.name}</td>
                  <td className="px-4 py-3 text-gray-300">{customer.reservationCount}</td>
                  <td className="px-4 py-3 text-[#fe9a00] font-semibold">${customer.totalPrice}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(customer.createdAt).toLocaleDateString()}
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
