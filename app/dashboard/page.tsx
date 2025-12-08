"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "@/components/dashboard/dashboard";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (user === null) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/register");
        return;
      }
    } else {
      if (user.role !== "admin") {
        router.push("/customerDashboard");
        return;
      }
      setIsVerifying(false);
    }
  }, [user, router]);

  if (isVerifying || !user) {
    return (
      <div className="min-h-screen bg-[#0f172b] flex items-center justify-center">
        <div className="text-white text-xl">Verifying access...</div>
      </div>
    );
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;
