"use client";

import { useState, useRef } from "react";
import DynamicTableView from "./DynamicTableView";
import CustomSelect from "@/components/ui/CustomSelect";
import { User } from "@/types/type";
import { showToast } from "@/lib/toast";

interface EditUserData {
  name: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  role: string;
}

interface EmailData {
  emailAddress: string;
  isVerified: boolean;
}

interface PhoneData {
  phoneNumber: string;
  isVerified: boolean;
}

interface LicenseData {
  front?: string;
  back?: string;
}

type MutateFn = () => Promise<void>;

const roleOptions = [
  { _id: "user", name: "user" },
  { _id: "admin", name: "admin" },
];

export default function ContactsManagement() {
  const mutateRef = useRef<MutateFn | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState<EditUserData | null>(null);

  const handleViewDetails = (item: User) => {
    setSelectedUser(item);
    setEditData({
      name: item.name,
      lastName: item.lastName,
      address: item.address || "",
      email: item.emaildata.emailAddress,
      phone: item.phoneData.phoneNumber,
      role: item.role || "user",
    });
    setIsDetailOpen(true);
    setIsEditing(false);
  };

  const handleEditChange = (field: keyof EditUserData, value: string) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSaveEdit = async () => {
    if (!selectedUser || !editData) return;
    const token = localStorage.getItem("token");
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token || "",
        },
        body: JSON.stringify({
          name: editData.name,
          lastName: editData.lastName,
          address: editData.address,
          email: editData.email,
          phone: editData.phone,
          role: editData.role,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");
      showToast.success("User updated successfully!");
      setIsEditing(false);
      if (mutateRef.current) mutateRef.current();
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DynamicTableView
        hideDelete={true}
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
            render: (value: EmailData) => (
              <div className="flex items-center gap-2">
                <span>{value?.emailAddress || "-"}</span>
              </div>
            ),
          },
          {
            key: "phoneData" as keyof User,
            label: "Phone",
            render: (value: PhoneData) => (
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
          {
            key: "licenceAttached" as keyof User,
            label: "License",
            render: (value: LicenseData) => (
              <div className="flex items-center gap-2">
                {value?.front || value?.back ? (
                  <div className="flex gap-1">
                    {value?.front && (
                      <a
                        href={value.front}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs underline"
                      >
                        Front
                      </a>
                    )}
                    {value?.back && (
                      <a
                        href={value.back}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs underline"
                      >
                        Back
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="text-red-400 text-xs">No License</span>
                )}
              </div>
            ),
          },
        ]}
        hiddenColumns={["address"]}
        onEdit={handleViewDetails}
        onMutate={(mutate) => (mutateRef.current = mutate)}
      />

      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full border max-h-[95vh] overflow-y-scroll border-white/10">
            <div className="p-6 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3 grid grid-cols-2 gap-2">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-gray-400 text-sm">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editData?.name || ""}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                          className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#fe9a00]"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editData?.lastName || ""}
                          onChange={(e) =>
                            handleEditChange("lastName", e.target.value)
                          }
                          className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#fe9a00]"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Email</label>
                        <input
                          type="email"
                          value={editData?.email || ""}
                          onChange={(e) =>
                            handleEditChange("email", e.target.value)
                          }
                          className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#fe9a00]"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Phone</label>
                        <input
                          type="tel"
                          value={editData?.phone || ""}
                          onChange={(e) =>
                            handleEditChange("phone", e.target.value)
                          }
                          className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#fe9a00]"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Address</label>
                        <input
                          type="text"
                          value={editData?.address || ""}
                          onChange={(e) =>
                            handleEditChange("address", e.target.value)
                          }
                          className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#fe9a00]"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Role</label>
                        <CustomSelect
                          options={roleOptions}
                          value={editData?.role || "user"}
                          onChange={(value) => handleEditChange("role", value)}
                          placeholder="Select role"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-gray-400 text-sm">
                          First Name
                        </label>
                        <p className="text-white font-semibold">
                          {selectedUser.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">
                          Last Name
                        </label>
                        <p className="text-white font-semibold">
                          {selectedUser.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Email</label>
                        <p className="text-white font-semibold">
                          {selectedUser.emaildata.emailAddress}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Phone</label>
                        <p className="text-white font-semibold">
                          {selectedUser.phoneData.phoneNumber}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {selectedUser.phoneData.isVerified
                            ? "✓ Verified"
                            : "✗ Not Verified"}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Address</label>
                        <p className="text-white font-semibold">
                          {selectedUser.address || "-"}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-gray-400 text-sm">Role</label>
                    <p className="text-white font-semibold capitalize">
                      {selectedUser.role}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Joined</label>
                    <p className="text-white font-semibold">
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm">License</label>
                    <div className="mt-1 flex gap-4">
                      {selectedUser.licenceAttached?.front ||
                      selectedUser.licenceAttached?.back ? (
                        <div className="flex gap-4">
                          {selectedUser.licenceAttached?.front && (
                            <div className="flex-1">
                              <p className="text-gray-400 text-xs mb-1">
                                Front
                              </p>
                              <a
                                href={selectedUser.licenceAttached.front}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={selectedUser.licenceAttached.front}
                                  alt="License Front"
                                  className="w-32 h-20 object-cover rounded-lg border border-white/20 hover:border-[#fe9a00] cursor-pointer transition-colors"
                                />
                              </a>
                            </div>
                          )}
                          {selectedUser.licenceAttached?.back && (
                            <div className="flex-1">
                              <p className="text-gray-400 text-xs mb-1">Back</p>
                              <a
                                href={selectedUser.licenceAttached.back}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={selectedUser.licenceAttached.back}
                                  alt="License Back"
                                  className="w-32 h-20 object-cover rounded-lg border border-white/20 hover:border-[#fe9a00] cursor-pointer transition-colors"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-red-400 text-sm">
                          No License Attached
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 px-4 py-3 bg-[#fe9a00] hover:bg-orange-600 text-white rounded-lg transition-colors font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setIsDetailOpen(false)}
                      className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
