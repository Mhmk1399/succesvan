"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VanListing from "@/components/global/vanListing";
import { Category } from "@/types/type";

function ReservationContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [addOns, setAddOns] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(res => res.json()),
      fetch("/api/addons").then(res => res.json())
    ])
      .then(([categoriesData, addOnsData]) => {
        if (categoriesData.success) setCategories(categoriesData.data);
        if (addOnsData.success) setAddOns(addOnsData.data);
        setLoaded(true);
      })
      .catch(err => console.error("Failed to fetch data", err));
  }, []);

  useEffect(() => {
    if (!loaded || categories.length === 0) return;

    const query = searchParams.get("search") || "";
    const categoryId = searchParams.get("category");

    let filtered = categories;

    if (categoryId) {
      filtered = filtered.filter((cat) => cat._id === categoryId);
    } else if (query.trim()) {
      filtered = filtered.filter((cat) =>
        cat.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [searchParams, loaded, categories]);

  return (
    <div className="min-h-screen bg-[#0f172b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VanListing vans={filteredCategories as any} addOns={addOns} />
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172b] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <ReservationContent />
    </Suspense>
  );
}
