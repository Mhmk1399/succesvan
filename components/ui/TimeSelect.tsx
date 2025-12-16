"use client";

import { useState, useRef, useEffect } from "react";
import { FiClock, FiChevronDown } from "react-icons/fi";

interface TimeSelectProps {
  value: string;
  onChange: (time: string) => void;
  slots: string[];
  reservedSlots: { startDate: string; endDate: string; startTime: string; endTime: string; isSameDay: boolean }[];
  isInline?: boolean;
  tooltip?: string;
  selectedDate?: Date;
  isStartTime?: boolean;
  extensionTimes?: { start: string; end: string; normalStart: string; normalEnd: string; price: number };
}

export default function TimeSelect({
  value,
  onChange,
  slots,
  reservedSlots,
  isInline,
  tooltip,
  selectedDate,
  isStartTime = true,
  extensionTimes,
}: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const isDisabled = (slot: string) => {
    if (!selectedDate) return false;
    
    const currentDateStr = selectedDate.toISOString().split('T')[0];
    
    return reservedSlots.some((r) => {
      if (isStartTime && r.startDate === currentDateStr) {
        return slot >= r.startTime && slot < r.endTime;
      }
      
      if (!isStartTime && r.endDate === currentDateStr) {
        return slot > r.startTime && slot <= r.endTime;
      }
      
      return false;
    });
  };

  return (
    <div ref={dropdownRef} className="relative w-full group">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/10 border border-white/20 rounded-lg text-white flex items-center justify-between focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all ${
          isInline ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"
        }`}
      >
        <span className="flex items-center gap-2">
          <FiClock className="text-amber-400" />
          {value}
        </span>
        <FiChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {tooltip && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 border border-amber-400/30 rounded-lg text-amber-300 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
          {tooltip}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 w-full   bg-slate-800 border border-white/20 rounded-lg shadow-2xl max-h-40 overflow-y-auto">
          {slots.length > 0 ? (
            slots.map((slot) => {
              const disabled = isDisabled(slot);
              const isActive = value === slot;
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
                  className={`w-full px-3 py-2.5 text-left text-xs transition-colors flex items-center justify-between gap-3 ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border-l-2 border-amber-400"
                      : disabled
                      ? "bg-slate-900/50 text-gray-500 cursor-not-allowed"
                      : "text-gray-200 hover:bg-white/10"
                  }`}
                >
                  <span className="flex-1">{slot}</span>
                  {!disabled && extensionTimes && (slot < extensionTimes.normalStart || slot > extensionTimes.normalEnd) && (
                    <>
                      <div className="w-1.5 h-1.5 absolute left-1 rounded-full bg-yellow-400"></div>
                      <span className="text-[9px] text-yellow-400">extra(+£{extensionTimes.price})</span>
                    </>
                  )}
                  {!disabled && extensionTimes && extensionTimes.normalStart !== extensionTimes.normalEnd && slot >= extensionTimes.normalStart && slot <= extensionTimes.normalEnd && (
                    <div className="w-1 h-1 absolute left-1 rounded-full bg-green-500"></div>
                  )}
                  {disabled && (
                    <div className="w-1 h-1 absolute left-1 rounded-full bg-red-500"></div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-center text-gray-400 text-xs">
              No available times
            </div>
          )}
        </div>
      )}
    </div>
  );
}
