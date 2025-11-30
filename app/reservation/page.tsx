"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VanListing from "@/components/global/vanListing";
import { Category } from "@/types/type";

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
          setLoaded(true);
        }
      })
      .catch(err => console.error("Failed to fetch categories", err));
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
        <VanListing vans={filteredCategories as any} />
      </div>
    </div>
  );
}
