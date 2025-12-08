"use client";

import { useState } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";

interface AddOn {
  _id: string;
  name: string;
  description?: string;
  pricingType: "flat" | "tiered";
  flatPrice?: number;
  tiers?: { minDays: number; maxDays: number; price: number }[];
}

interface AddOnsModalProps {
  addOns: AddOn[];
  selectedAddOns: { addOn: string; quantity: number; selectedTierIndex?: number }[];
  onSave: (selected: { addOn: string; quantity: number; selectedTierIndex?: number }[]) => void;
  onClose: () => void;
  rentalDays: number;
}

export default function AddOnsModal({
  addOns,
  selectedAddOns,
  onSave,
  onClose,
  rentalDays,
}: AddOnsModalProps) {
  const [selected, setSelected] = useState<{ addOn: string; quantity: number; selectedTierIndex?: number }[]>(selectedAddOns);

  const getAddOnPrice = (addon: AddOn, tierIndex?: number) => {
    if (addon.pricingType === "flat") {
      return addon.flatPrice || 0;
    }
    if (tierIndex !== undefined && addon.tiers?.[tierIndex]) {
      return addon.tiers[tierIndex].price;
    }
    return addon.tiers?.[0]?.price || 0;
  };

  const handleToggle = (addonId: string, addon: AddOn) => {
    const exists = selected.find((s) => s.addOn === addonId);
    if (exists) {
      setSelected(selected.filter((s) => s.addOn !== addonId));
    } else {
      setSelected([...selected, { 
        addOn: addonId, 
        quantity: 1,
        selectedTierIndex: addon.pricingType === "tiered" ? 0 : undefined
      }]);
    }
  };

  const handleTierChange = (addonId: string, tierIndex: number) => {
    setSelected(
      selected.map((s) =>
        s.addOn === addonId ? { ...s, selectedTierIndex: tierIndex } : s
      )
    );
  };

  const handleQuantityChange = (addonId: string, delta: number) => {
    setSelected(
      selected.map((s) =>
        s.addOn === addonId
          ? { ...s, quantity: Math.max(1, s.quantity + delta) }
          : s
      )
    );
  };

  const totalCost = selected.reduce((sum, item) => {
    const addon = addOns.find((a) => a._id === item.addOn);
    return sum + (addon ? getAddOnPrice(addon, item.selectedTierIndex) * item.quantity : 0);
  }, 0);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
        <div className="bg-[#1a2847] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-white/10">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-black text-white">Select Add-ons</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="text-white text-xl" />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
            {addOns.map((addon) => {
              const isSelected = selected.find((s) => s.addOn === addon._id);
              const price = getAddOnPrice(addon, isSelected?.selectedTierIndex);

              return (
                <div
                  key={addon._id}
                  className={`border rounded-xl p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#fe9a00] bg-[#fe9a00]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                  onClick={() => !isSelected && handleToggle(addon._id, addon)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">
                        {addon.name}
                      </h3>
                      {addon.description && (
                        <p className="text-gray-400 text-sm mt-1">
                          {addon.description}
                        </p>
                      )}
                      {addon.pricingType === "flat" ? (
                        <p className="text-[#fe9a00] font-bold mt-2">£{price}</p>
                      ) : (
                        <div className="mt-2">
                          <p className="text-gray-400 text-xs mb-2">Select tier:</p>
                          <div className="flex flex-wrap gap-2">
                            {addon.tiers?.map((tier, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isSelected) {
                                    handleTierChange(addon._id, idx);
                                  }
                                }}
                                disabled={!isSelected}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                  isSelected?.selectedTierIndex === idx
                                    ? "bg-[#fe9a00] text-white"
                                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                                } disabled:opacity-50`}
                              >
                                {tier.minDays}-{tier.maxDays} days: £{tier.price}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected.quantity === 1) {
                              handleToggle(addon._id, addon);
                            } else {
                              handleQuantityChange(addon._id, -1);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                          <FiMinus />
                        </button>
                        <span className="text-white font-bold w-8 text-center">
                          {isSelected.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(addon._id, 1);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#fe9a00] hover:bg-orange-600 flex items-center justify-center text-white transition-colors"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(addon._id, addon);
                        }}
                        className="px-4 py-2 bg-[#fe9a00] hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Add-ons Cost</span>
              <span className="text-[#fe9a00] font-black text-2xl">
                £{totalCost}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(selected);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-[#fe9a00] hover:bg-orange-600 text-white rounded-lg transition-colors font-semibold"
              >
                Save ({selected.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
