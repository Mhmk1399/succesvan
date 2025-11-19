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
                <VanCard van={van} />
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
    </section>
  );
}

function VanCard({ van }: { van: VanData }) {
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
