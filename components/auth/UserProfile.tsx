"use client";

import { useAuth } from "../../context/AuthContext";
import { FiUser } from "react-icons/fi";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
        <FiUser className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-white font-medium text-sm">{user.name}</p>
        <p className="text-white/60 text-xs">{user.email}</p>
      </div>
    </div>
  );
}