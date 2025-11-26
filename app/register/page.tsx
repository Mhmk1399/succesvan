"use client";

import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-[#0f172b] flex items-center justify-center p-4">
      <AuthForm mode={authMode} onModeChange={setAuthMode} />
    </div>
  );
}
