"use client";

import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { AuthProvider } from "@/components/auth/AuthContext";

export default function RegisterPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0f172b] flex items-center justify-center p-4">
        <AuthForm mode={authMode} onModeChange={setAuthMode} />
      </div>
    </AuthProvider>
  );
}
