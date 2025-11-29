"use client";

import { useEffect } from "react";
import CustomerDashboard from "@/components/customerDashboard/CustomerDashboard";

const page = () => {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        document.title = `${userData.name}'s Dashboard | SuccessVan`;
      } catch {
        document.title = "Customer Dashboard | SuccessVan";
      }
    }
  }, []);

  return (
    <div>
      <CustomerDashboard />
    </div>
  );
};

export default page;
