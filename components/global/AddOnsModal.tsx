"use client";

import { useState } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";

interface AddOn {
  _id: string;
  name: string;
  description?: string;
  pricingType: "flat" | "tiered";
  flatPrice?: {
    amount: number;
    isPerDay: boolean;
  };
  tieredPrice?: {
    isPerDay: boolean;
    tiers: { minDays: number; maxDays: number; price: number }[];
  };
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
      const amount = addon.flatPrice?.amount || 0;
      const isPerDay = addon.flatPrice?.isPerDay || false;
      return isPerDay ? amount * rentalDays : amount;
    }
    if (tierIndex !== undefined && addon.tieredPrice?.tiers?.[tierIndex]) {
      const tier = addon.tieredPrice.tiers[tierIndex];
      if (rentalDays >= tier.minDays && rentalDays <= tier.maxDays) {
        const price = tier.price;
        const isPerDay = addon.tieredPrice.isPerDay || false;
        return isPerDay ? price * rentalDays : price;
      }
    }
    const matchingTier = addon.tieredPrice?.tiers?.find(
      (tier) => rentalDays >= tier.minDays && rentalDays <= tier.maxDays
    );
    if (matchingTier) {
      const isPerDay = addon.tieredPrice?.isPerDay || false;
      return isPerDay ? matchingTier.price * rentalDays : matchingTier.price;
    }
    return 0;
  };

  const handleToggle = (addonId: string, addon: AddOn) => {
    const hasMatchingTier = addon.pricingType === "flat" || addon.tieredPrice?.tiers?.some(
      (tier) => rentalDays >= tier.minDays && rentalDays <= tier.maxDays
    );
    if (!hasMatchingTier) return;
    
    const exists = selected.find((s) => s.addOn === addonId);
    if (exists) {
      setSelected(selected.filter((s) => s.addOn !== addonId));
    } else {
      let defaultTierIndex = 0;
      if (addon.pricingType === "tiered" && addon.tieredPrice?.tiers) {
        const matchingTierIndex = addon.tieredPrice.tiers.findIndex(
          (tier) => rentalDays >= tier.minDays && rentalDays <= tier.maxDays
        );
        defaultTierIndex = matchingTierIndex !== -1 ? matchingTierIndex : 0;
      }
      setSelected([...selected, { 
        addOn: addonId, 
        quantity: 1,
        selectedTierIndex: addon.pricingType === "tiered" ? defaultTierIndex : undefined
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10001"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-10002 flex items-center justify-center p-4">
        <div className="bg-[#1a2847] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-black text-white">Select Add-ons</h2>
              <p className="text-gray-400 text-sm mt-1">Rental Duration: {rentalDays} day{rentalDays !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="text-white text-xl" />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-250px)]">
            {addOns.filter((addon) => {
              return addon.pricingType === "flat" || addon.tieredPrice?.tiers?.some(
                (tier) => rentalDays >= tier.minDays && rentalDays <= tier.maxDays
              );
            }).sort((a, b) => {
              const typeA = (a as any).type || '';
              const typeB = (b as any).type || '';
              // Group by type - items with same type together
              if (typeA === typeB) return 0;
              // Items without type go to the end
              if (!typeA) return 1;
              if (!typeB) return -1;
              // Sort alphabetically by type
              return typeA.localeCompare(typeB);
            }).map((addon) => {
              const isSelected = selected.find((s) => s.addOn === addon._id);
              const price = getAddOnPrice(addon, isSelected?.selectedTierIndex);
              
              // Check if another addon with the same type is already selected
              const addonType = (addon as any).type;
              const isTypeDisabled = addonType && selected.some((s) => {
                const selectedAddon = addOns.find((a) => a._id === s.addOn);
                return selectedAddon && (selectedAddon as any).type === addonType && selectedAddon._id !== addon._id;
              });
              
              // Max quantity is 1
 
              return (
                <div
                  key={addon._id}
                  className={`border rounded-xl p-2 transition-all ${
                    isSelected
                      ? "border-[#fe9a00] bg-[#fe9a00]/10 cursor-pointer"
                      : isTypeDisabled
                      ? "border-red-500/30 bg-white/5 opacity-50 cursor-not-allowed"
                      : "border-white/10 bg-white/5 hover:border-white/20 cursor-pointer"
                  }`}
                  onClick={() => !isSelected && !isTypeDisabled && handleToggle(addon._id, addon)}
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
                      {isTypeDisabled && (
                        <p className="text-red-400 text-xs mt-1">
                          Another option of this type is already selected
                        </p>
                      )}
                      {addon.pricingType === "flat" ? (
                        <p className="text-[#fe9a00] font-bold mt-2">
                          £{addon.flatPrice?.amount || 0}
                          {addon.flatPrice?.isPerDay && (
                            <span className="text-gray-400 text-xs ml-1">
                              /day × {rentalDays} days = £{price.toFixed(2)}
                            </span>
                          )}
                        </p>
                      ) : (
                        <div className="mt-1">
                          <p className="text-gray-400 text-xs mb-1">
                            Select tier {addon.tieredPrice?.isPerDay && `(per day × ${rentalDays} days)`}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {addon.tieredPrice?.tiers?.filter(
                              (tier) => rentalDays >= tier.minDays && rentalDays <= tier.maxDays
                            ).map((tier, idx) => {
                              const originalIdx = addon.tieredPrice?.tiers?.indexOf(tier) || 0;
                              const tierPrice = addon.tieredPrice?.isPerDay ? tier.price * rentalDays : tier.price;
                              return (
                                <button
                                  key={originalIdx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isSelected) {
                                      handleTierChange(addon._id, originalIdx);
                                    }
                                  }}
                                  disabled={!isSelected}
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                    isSelected?.selectedTierIndex === originalIdx
                                      ? "bg-[#fe9a00] text-white"
                                      : "bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
                                  } disabled:opacity-50`}
                                >
                                  {tier.minDays}-{tier.maxDays} days: £{tier.price}
                                  {addon.tieredPrice?.isPerDay && (
                                    <span className="ml-1">/day = £{tierPrice.toFixed(2)}</span>
                                  )}
                                </button>
                              );
                            })}
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
                            handleToggle(addon._id, addon);
                          }}
                          className="w-8 h-5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
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
                          }}
                          disabled={true}
                          className="w-8 h-8 rounded-lg bg-gray-600/50 text-gray-400 flex items-center justify-center cursor-not-allowed opacity-50"
                          title="Maximum quantity reached"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isTypeDisabled) {
                            handleToggle(addon._id, addon);
                          }
                        }}
                        disabled={isTypeDisabled}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          isTypeDisabled
                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                            : 'bg-[#fe9a00] hover:bg-orange-600 text-white'
                        }`}
                        title={isTypeDisabled ? 'Another option of this type is already selected' : 'Add addon'}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="bg-white/5 rounded-xl p-2 mb-4 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Total Add-ons Cost</span>
                <span className="text-[#fe9a00] font-black text-lg">
                  £{totalCost.toFixed(2)}
                </span>
              </div>
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
                className="flex-1 px-4 py-3 bg-[#fe9a00] hover:bg-orange-600 text-white rounded-lg transition-colors font-semibold shadow-lg"
              >
                Confirm Add-ons ({selected.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
