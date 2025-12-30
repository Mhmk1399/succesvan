"use client";

import { CustomSelectProps } from "@/types/type";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  icon,
  isInline = false,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const optionsArray = Array.isArray(options) ? options : [];
  const filtered = optionsArray.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = optionsArray.find((opt) => opt._id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors flex items-center justify-between ${
          isInline ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {icon}
          <span className="truncate">{selectedOption?.name || placeholder}</span>
        </span>
        <FiChevronDown
          className={`transition-transform  shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg z-50"
          >
            <div className="p-2 border-b border-white/10 flex items-center gap-2 bg-white/5">
              <FiSearch className="text-amber-400 text-sm shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((opt) => (
                  <button
                    key={opt._id}
                    type="button"
                    onClick={() => {
                      if (opt._id) {
                        onChange(opt._id);
                        setIsOpen(false);
                        setSearch("");
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      value === opt._id
                        ? "bg-amber-500/20 text-amber-300"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-gray-400 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
