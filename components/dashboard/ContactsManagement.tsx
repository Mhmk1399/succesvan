"use client";

import { useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import DynamicTableView from "./DynamicTableView";
import { User } from "@/types/type";

export default function ContactsManagement() {
  const mutateRef = useRef<(() => Promise<any>) | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetails = (item: User) => {
    setSelectedUser(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <DynamicTableView
        apiEndpoint="/api/users"
        filters={[
          { key: "username", label: "Username", type: "text" },
          { key: "email", label: "Email", type: "text" },
          { key: "phone", label: "Phone", type: "text" },
          { key: "createdAt", label: "Joined Date", type: "date" },
        ]}
        title="User"
        columns={[
          {
            key: "name" as keyof User,
            label: "Username",
          },
          {
            key: "lastName" as keyof User,
            label: "Last Name",
          },
          {
            key: "emaildata" as keyof User,
            label: "Email",
            render: (value: any) => (
              <div className="flex items-center gap-2">
                <span>{value?.emailAddress || "-"}</span>
                <span
                  className={`text-[10px] font-semibold ${
                    value?.isVerified ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {value?.isVerified ? "verify" : "unVerify"}
                </span>
              </div>
            ),
          },
          {
            key: "phoneData" as keyof User,
            label: "Phone",
            render: (value: any) => (
              <div className="flex items-center gap-2">
                <span>{value?.phoneNumber || "-"}</span>
                <span
                  className={`text-[10px] font-semibold ${
                    value?.isVerified ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {value?.isVerified ? "verify" : "unVerify"}
                </span>
              </div>
            ),
          },
          {
            key: "address" as keyof User,
            label: "Address",
          },
          {
            key: "createdAt" as keyof User,
            label: "Joined",
            render: (value: Date) =>
              new Date(value).toLocaleDateString("en-GB"),
          },
        ]}
        onEdit={handleViewDetails}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />

      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full border border-white/10">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a2847]">
              <h2 className="text-2xl font-black text-white">User Details</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-sm">First Name</label>
                    <p className="text-white font-semibold">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Last Name</label>
                    <p className="text-white font-semibold">
                      {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white font-semibold">
                      {(selectedUser.emaildata as any)?.emailAddress}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {(selectedUser.emaildata as any)?.isVerified
                        ? "✓ Verified"
                        : "✗ Not Verified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <p className="text-white font-semibold">
                      {(selectedUser.phoneData as any)?.phoneNumber}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {(selectedUser.phoneData as any)?.isVerified
                        ? "✓ Verified"
                        : "✗ Not Verified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Address</label>
                    <p className="text-white font-semibold">
                      {(selectedUser as any).address || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Role</label>
                    <p className="text-white font-semibold capitalize">
                      {(selectedUser as any).role}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Joined</label>
                    <p className="text-white font-semibold">
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
