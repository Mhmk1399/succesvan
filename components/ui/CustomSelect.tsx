"use client";

import { CustomSelectProps } from "@/types/type";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  icon,
  isInline = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const filtered = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt._id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        portalRef.current &&
        !portalRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors flex items-center justify-between ${
          isInline ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"
        }`}
      >
        <span className="flex items-center gap-2">
          {icon}
          {selectedOption?.name || placeholder}
        </span>
        <FiChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            className="fixed bg-slate-800 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg z-50"
            style={{
              top: `${dropdownPos.top + 8}px`,
              left: `${dropdownPos.left}px`,
              width: `${dropdownPos.width}px`,
            }}
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
          </div>,
          document.body
        )}
    </div>
  );
}
