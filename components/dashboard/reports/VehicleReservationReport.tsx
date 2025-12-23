"use client";

import { useState, useEffect } from "react";
import { FiDownload, FiFilter } from "react-icons/fi";
import { showToast } from "@/lib/toast";

interface VehicleReport {
  _id: string;
  title: string;
  number: string;
  description: string;
  category: { name: string };
  office: { _id: string; name: string };
  reservationCount: number;
  reservations: Array<{
    _id: string;
    startDate: string;
    endDate: string;
    user: { name: string };
    status: string;
  }>;
  needsService: boolean;
  images: string[];
}

export default function VehicleReservationReport() {
  const [data, setData] = useState<VehicleReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOffice, setFilterOffice] = useState("");
  const [offices, setOffices] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetchData();
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await fetch("/api/offices?limit=100");
      const data = await res.json();
      setOffices(data.data || []);
    } catch (error) {
      console.log("Failed to fetch offices:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/vehicles");
      const result = await res.json();
      setData(result.data || []);
    } catch (error) {
      showToast.error("Failed to load report");
      console.log("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = filterOffice
    ? data.filter((v) => v.office._id === filterOffice)
    : data;

  const exportToCSV = () => {
    const headers = [
      "Vehicle Title",
      "Number",
      "Category",
      "Office",
      "Total Reservations",
      "Needs Service",
      "Description",
    ];
    const rows = filteredData.map((v) => [
      v.title,
      v.number,
      v.category?.name || "-",
      v.office?.name || "-",
      v.reservationCount,
      v.needsService ? "Yes" : "No",
      v.description,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehicle-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-[#fe9a00]/30 border-t-[#fe9a00] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">
          Vehicle Reservation Report
        </h2>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-2">
        <FiFilter className="text-gray-400" />
        <select
          value={filterOffice}
          onChange={(e) => setFilterOffice(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg  focus:outline-none focus:border-[#fe9a00]"
        >
          <option value="">All Offices</option>
          {offices.map((office) => (
            <option className="text-black" key={office._id} value={office._id}>
              {office.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/70">
            <tr>
              <th className="px-4 py-3 text-left text-white font-bold">#</th>
              <th className="px-4 py-3 text-left text-white font-bold">
                Title
              </th>
              <th className="px-4 py-3 text-left text-white font-bold">
                Number
              </th>
              <th className="px-4 py-3 text-left text-white font-bold">
                Category
              </th>
              <th className="px-4 py-3 text-left text-white font-bold">
                Office
              </th>
              <th className="px-4 py-3 text-left text-white font-bold">
                Reservations
              </th>
              <th className="px-4 py-3 text-left text-white font-bold">
                Service
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((vehicle, idx) => (
              <tr
                key={vehicle._id}
                className="border-b border-white/10 hover:bg-white/10 transition-colors"
              >
                <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                <td className="px-4 py-3 text-white font-semibold">
                  {vehicle.title}
                </td>
                <td className="px-4 py-3 text-gray-300">{vehicle.number}</td>
                <td className="px-4 py-3 text-gray-300">
                  {vehicle.category?.name || "-"}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {vehicle.office?.name || "-"}
                </td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-[#fe9a00]/20 text-[#fe9a00] rounded-full text-sm font-semibold">
                    {vehicle.reservationCount}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      vehicle.needsService
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {vehicle.needsService ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-400">No vehicles found</div>
      )}
    </div>
  );
}
