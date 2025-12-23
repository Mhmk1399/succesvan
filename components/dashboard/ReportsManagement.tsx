"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiBarChart2,
  FiHome,
  FiClipboard,
  FiTruck,
  FiUsers,
  FiGift,
} from "react-icons/fi";
import CategoryReport from "./reports/CategoryReport";
import OfficeReport from "./reports/OfficeReport";
import DefaultReport from "./reports/DefaultReport";
import VehicleReservationReport from "./reports/VehicleReservationReport";
import ReservationReport from "./reports/ReservationReport";
import CustomerReport from "./reports/CustomerReport";
import AddOnReport from "./reports/AddOnReport";

interface Report {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const reports: Report[] = [
  {
    id: "categories",
    name: "Categories Report",
    description: "Most/least used categories with revenue analysis",
    icon: <FiBarChart2 />,
  },
  {
    id: "offices",
    name: "Offices Report",
    description: "Most/least used offices with revenue analysis",
    icon: <FiHome />,
  },
  {
    id: "reservations",
    name: "Reservations Report",
    description: "Top price reservations with customer and category details",
    icon: <FiClipboard />,
  },
  {
    id: "vehicles",
    name: "Vehicle Reservations Report",
    description: "Vehicles with reservation counts and details",
    icon: <FiTruck />,
  },
  {
    id: "customers",
    name: "Customers Report",
    description: "Most/least reserved users, revenue, and monthly stats",
    icon: <FiUsers />,
  },
  {
    id: "addons",
    name: "Add-Ons Report",
    description:
      "Most used add-ons, customer preferences, and revenue analysis",
    icon: <FiGift />,
  },
];

export default function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleViewReport = (reportId: string) => {
    setSelectedReport(reportId);
    setIsDropdownOpen(false);
  };

  const currentReport = reports.find((r) => r.id === selectedReport);

  return (
    <div className="space-y-6">
      {/* Report Selector Dropdown */}
      <div className="relative w-full md:w-80">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <span className="font-semibold">
            {currentReport ? currentReport.name : "Select a Report"}
          </span>
          <FiChevronDown
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2847] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => handleViewReport(report.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  selectedReport === report.id
                    ? "bg-[#fe9a00]/20 text-[#fe9a00]"
                    : "text-white hover:bg-white/5"
                }`}
              >
                <span className="text-xl">{report.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{report.name}</p>
                  <p className="text-xs text-gray-400">{report.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Report Content */}
      {currentReport ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{currentReport.icon}</span>
              <div>
                <h2 className="text-2xl font-black text-white">
                  {currentReport.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {currentReport.description}
                </p>
              </div>
            </div>
          </div>

          {selectedReport === "categories" ? (
            <CategoryReport />
          ) : selectedReport === "offices" ? (
            <OfficeReport />
          ) : selectedReport === "vehicles" ? (
            <VehicleReservationReport />
          ) : selectedReport === "reservations" ? (
            <ReservationReport />
          ) : selectedReport === "customers" ? (
            <CustomerReport />
          ) : selectedReport === "addons" ? (
            <AddOnReport />
          ) : (
            <DefaultReport reportName={currentReport.name} />
          )}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">
            Select a report from the dropdown to view details
          </p>
        </div>
      )}
    </div>
  );
}
