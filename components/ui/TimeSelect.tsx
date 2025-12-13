"use client";

import { useState, useRef, useEffect } from "react";
import { FiClock, FiChevronDown } from "react-icons/fi";

interface TimeSelectProps {
  value: string;
  onChange: (time: string) => void;
  slots: string[];
  reservedSlots: { startTime: string; endTime: string }[];
  isInline?: boolean;
}

export default function TimeSelect({ value, onChange, slots, reservedSlots, isInline }: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDisabled = (slot: string) => {
    return reservedSlots.some(r => slot >= r.startTime && slot <= r.endTime);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/10 border border-white/20 rounded-lg text-white flex items-center justify-between focus:outline-none focus:border-amber-400 transition-colors ${
          isInline ? "px-2 py-2 text-xs" : "px-3 py-2 text-xs"
        }`}
      >
        <span className="flex items-center gap-2">
          <FiClock className="text-amber-400" />
          {value}
        </span>
        <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-white/20 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {slots.map(slot => {
            const disabled = isDisabled(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    onChange(slot);
                    setIsOpen(false);
                  }
                }}
                disabled={disabled}
                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                  value === slot
                    ? "bg-amber-500 text-white"
                    : disabled
                    ? "bg-slate-900 text-gray-600 cursor-not-allowed"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {slot} {disabled ? "(Reserved)" : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
