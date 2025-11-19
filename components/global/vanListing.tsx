"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FiUsers, FiPackage, FiCheckCircle, FiInfo } from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Van data type
export interface VanData {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  priceUnit: string;
  seats: number;
  transmission: "Manual" | "Automatic";
  fuelType: string;
  cargo: string;
  doors: number;
  features: string[];
  popular?: boolean;
  available: boolean;
  deposit: number;
  mileage: string;
}

// Sample van data
export const vansData: VanData[] = [
  {
    id: 1,
    name: "Small Van - Ford Transit Custom",
    category: "Small Van",
    image: "/assets/images/van3.png",
    price: 45,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "6m³",
    doors: 3,
    features: [
      "Bluetooth",
      "Air Conditioning",
      "Parking Sensors",
      "USB Charging",
    ],
    popular: false,
    available: true,
    deposit: 200,
    mileage: "Unlimited",
  },
  {
    id: 2,
    name: "Medium Van - Mercedes Sprinter",
    category: "Medium Van",
    image: "/assets/images/van.png",
    price: 65,
    priceUnit: "per day",
    seats: 3,
    transmission: "Automatic",
    fuelType: "Diesel",
    cargo: "10m³",
    doors: 4,
    features: [
      "Cruise Control",
      "Air Conditioning",
      "Reversing Camera",
      "Bluetooth",
      "Sat Nav",
    ],
    popular: true,
    available: true,
    deposit: 300,
    mileage: "Unlimited",
  },
  {
    id: 3,
    name: "Large Van - Luton with Tail Lift",
    category: "Large Van",
    image: "/assets/images/van.png",
    price: 85,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "18m³",
    doors: 3,
    features: [
      "Tail Lift",
      "Air Conditioning",
      "Parking Sensors",
      "Extra Storage",
      "Heavy Duty",
    ],
    popular: true,
    available: true,
    deposit: 400,
    mileage: "Unlimited",
  },
  {
    id: 4,
    name: "Extra Large Van - Luton Box Van",
    category: "Extra Large",
    image: "/assets/images/van.png",
    price: 95,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "22m³",
    doors: 3,
    features: [
      "Tail Lift",
      "Long Wheelbase",
      "High Roof",
      "Air Conditioning",
      "Extra Secure",
    ],
    popular: false,
    available: true,
    deposit: 500,
    mileage: "Unlimited",
  },
  {
    id: 5,
    name: "Refrigerated Van - Temperature Controlled",
    category: "Specialist",
    image: "/assets/images/van.png",
    price: 110,
    priceUnit: "per day",
    seats: 3,
    transmission: "Automatic",
    fuelType: "Diesel",
    cargo: "12m³",
    doors: 4,
    features: [
      "Temperature Control",
      "Insulated",
      "Digital Display",
      "Air Conditioning",
      "Bluetooth",
    ],
    popular: false,
    available: true,
    deposit: 400,
    mileage: "Unlimited",
  },
  {
    id: 6,
    name: "Tipper Van - Construction Ready",
    category: "Specialist",
    image: "/assets/images/van.png",
    price: 75,
    priceUnit: "per day",
    seats: 3,
    transmission: "Manual",
    fuelType: "Diesel",
    cargo: "8m³",
    doors: 3,
    features: [
      "Hydraulic Tipper",
      "Heavy Duty",
      "Cage Sides",
      "Tow Bar",
      "Construction Spec",
    ],
    popular: false,
    available: true,
    deposit: 350,
    mileage: "Unlimited",
  },
];

interface VanListingProps {
  vans?: VanData[];
  showFilters?: boolean;
}

export default function VanListing({
  vans = vansData,
  showFilters = true,
}: VanListingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [filteredVans, setFilteredVans] = useState(vans);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-low");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState<VanData | null>(null);

  const categories = [
    "All",
    ...Array.from(new Set(vans.map((v) => v.category))),
  ];

  useEffect(() => {
    let filtered = [...vans];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((van) => van.category === selectedCategory);
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "capacity") {
      filtered.sort((a, b) => parseFloat(b.cargo) - parseFloat(a.cargo));
    }

    setFilteredVans(filtered);
  }, [selectedCategory, sortBy, vans]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredVans]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0f172b] py-20">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Choose Your
            <br />
            <span className="text-[#fe9a00]">Perfect Van</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find the ideal van for your needs from our modern fleet
          </p>
        </div>

        {/* Vans Grid */}
        {filteredVans.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredVans.map((van, index) => (
              <div
                key={van.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <VanCard van={van} onBook={() => setSelectedVan(van)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <FiInfo className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No vans found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("price-low");
              }}
              className="px-6 py-3 rounded-xl bg-[#fe9a00] text-white font-bold hover:scale-105 transition-transform duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Reservation Panel */}
      {selectedVan && (
        <ReservationPanel
          van={selectedVan}
          onClose={() => setSelectedVan(null)}
        />
      )}
    </section>
  );
}

function ReservationPanel({
  van,
  onClose,
}: {
  van: VanData;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reservation:", { van, ...formData });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-[#0f172b]/80 border-l border-white/10 z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f172b]/80 border-b border-white/10 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Reserve Van</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Van Summary */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex gap-3 mb-3">
            <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10  shrink-0 overflow-hidden">
              <Image
                src={van.image}
                alt={van.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm line-clamp-2">
                {van.name}
              </h3>
              <p className="text-[#fe9a00] font-bold text-lg mt-1">
                £{van.price}/{van.priceUnit}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded p-2">
              <p className="text-gray-400">Cargo</p>
              <p className="text-white font-semibold">{van.cargo}</p>
            </div>
            <div className="bg-white/5 rounded p-2">
              <p className="text-gray-400">Deposit</p>
              <p className="text-white font-semibold">£{van.deposit}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] transition-colors"
              placeholder="+44 123 456 7890"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#fe9a00] transition-colors"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Return Date
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#fe9a00] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Pickup Location
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] transition-colors"
              placeholder="London, UK"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00] transition-colors resize-none h-20"
              placeholder="Any special requirements?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#fe9a00] hover:bg-[#e68a00] text-white font-bold py-3 rounded-lg transition-colors duration-300 mt-6"
          >
            Complete Reservation
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-colors duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}

function VanCard({ van, onBook }: { van: VanData; onBook: () => void }) {
  return (
    <div className="group relative h-[500px] rounded-3xl overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0">
        <Image
          src={van.image}
          alt={van.name}
          fill
          className="object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/85 transition-all duration-500"></div>

        {/* Gradient Overlays */}
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col p-6 justify-between">
        {/* Top Section */}
        <div>
          <h3 className="text-xl font-black text-white line-clamp-1 leading-tight mb-1">
            {van.name}
          </h3>
          <p className="text-gray-300 text-sm font-medium mb-4">or similar</p>

          {/* Specs Badges */}
          <div className="flex gap-1 flex-wrap">
            <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1.5">
              <FiPackage className="text-[#fe9a00] text-xs" />
              <span className="text-white text-xs font-semibold">
                {van.cargo}
              </span>
            </div>
            <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1.5">
              <BsFuelPump className="text-[#fe9a00] text-xs" />
              <span className="text-white text-xs font-semibold">
                {van.fuelType}
              </span>
            </div>
            <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-1.5">
              <FiUsers className="text-[#fe9a00] text-xs" />
              <span className="text-white text-xs font-semibold">
                B / {van.seats}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* Mileage */}
          <div className="flex items-center gap-2   text-xs font-semibold">
            <FiCheckCircle className="text-xs text-green-500" />
            <span className="text-gray-200 ">
              {van.mileage} kilometers included
            </span>
          </div>

          {/* Price & Button */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white">
                  £{van.price}
                </span>
                <span className="text-gray-300 text-xs font-semibold">
                  /{van.priceUnit}
                </span>
              </div>
              <div className="text-gray-400 text-xs mt-1">
                £{(van.price * 11).toFixed(2)} total
              </div>
            </div>
            <button
              disabled={!van.available}
              onClick={onBook}
              className={`group/btn relative cursor-pointer border-2 rounded-md border-white/50 px-6 py-2.5   font-bold text-sm overflow-hidden transition-all duration-300 whitespace-nowrap ${
                van.available
                  ? "  text-white hover:scale-105 shadow-lg  "
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="relative text-[#fe9a00] z-10">Book Now</span>
              {van.available && (
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
