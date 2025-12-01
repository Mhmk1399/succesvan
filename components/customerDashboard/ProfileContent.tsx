"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/lib/toast";

interface UserData {
  _id: string;
  name: string;
  lastName: string;
  emaildata?: {
    emailAddress: string;
    isVerified: boolean;
  };
  phoneData?: {
    phoneNumber: string;
    isVerified: boolean;
  };
}

export default function ProfileContent() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast.error("No authentication token found");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch user");

      const userData = data.data;
      setUser(userData);
      setFormData({
        name: userData.name,
        lastName: userData.lastName,
        emailAddress: userData.emaildata?.emailAddress || "",
        phoneNumber: userData.phoneData?.phoneNumber || "",
      });
    } catch (error: any) {
      showToast.error(error.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${user?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          emaildata: { emailAddress: formData.emailAddress },
          phoneData: { phoneNumber: formData.phoneNumber },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");

      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(data.data));
      
      showToast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchUserData();
    } catch (error: any) {
      showToast.error(error.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-black text-white mb-6">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
            ) : (
              <p className="text-white font-semibold mt-1">{user?.name}</p>
            )}
          </div>
          <div>
            <label className="text-gray-400 text-sm">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
            ) : (
              <p className="text-white font-semibold mt-1">{user?.lastName}</p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-sm">Email</label>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                user?.emaildata?.isVerified
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}>
                {user?.emaildata?.isVerified ? "✓ Verified" : "✗ Not Verified"}
              </span>
            </div>
            {isEditing ? (
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) =>
                  setFormData({ ...formData, emailAddress: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
            ) : (
              <p className="text-white font-semibold mt-1">
                {user?.emaildata?.emailAddress}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-sm">Phone</label>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                user?.phoneData?.isVerified
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}>
                {user?.phoneData?.isVerified ? "✓ Verified" : "✗ Not Verified"}
              </span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe9a00]"
              />
            ) : (
              <p className="text-white font-semibold mt-1">
                {user?.phoneData?.phoneNumber}
              </p>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-6 py-3 bg-[#fe9a00] hover:bg-[#e68a00] text-white rounded-lg transition-colors font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
