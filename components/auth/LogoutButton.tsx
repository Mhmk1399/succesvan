"use client";

import { useAuth } from "./AuthContext";
import { FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 border border-red-500/20"
    >
      <FiLogOut className="w-4 h-4" />
      Logout
    </button>
  );
}