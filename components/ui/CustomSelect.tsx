import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Option {
  _id: string;
  name: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInline?: boolean;
  disabled?: boolean;
  id?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isInline = false,
  disabled = false,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o._id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        id={id}
        className={`w-full bg-white/10 border border-white/20 rounded-lg text-white text-left focus:outline-none focus:border-[#fe9a00] flex items-center justify-between ${
          isInline ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={selected ? "text-white" : "text-gray-400"}>
          {selected ? selected.name : placeholder}
        </span>
        <FiChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#1a2847] border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option._id}
              type="button"
              onClick={() => {
                if (!option.disabled) {
                  onChange(option._id);
                  setIsOpen(false);
                }
              }}
              disabled={option.disabled}
              className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors ${
                value === option._id ? "bg-[#fe9a00]/20 text-[#fe9a00]" : "text-white"
              } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
