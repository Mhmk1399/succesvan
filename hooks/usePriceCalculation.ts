import { useState, useEffect } from "react";

interface PricingTier {
  minDays: number;
  maxDays: number;
  pricePerDay: number;
}

interface PriceCalculationResult {
  totalHours: number;
  totalDays: number;
  extraHours: number;
  pricePerDay: number;
  extraHoursRate: number;
  totalPrice: number;
  breakdown: string;
  pickupExtensionPrice?: number;
  returnExtensionPrice?: number;
  addOnsPrice?: number;
}

export function usePriceCalculation(
  startDate: string,
  endDate: string,
  pricingTiers: PricingTier[],
  extraHoursRate: number = 0,
  pickupExtensionPrice: number = 0,
  returnExtensionPrice: number = 0,
  gearExtraCostPerDay: number = 0,
  addOnsPrice: number = 0,
  sellOffer: number = 0
): PriceCalculationResult | null {
  const [result, setResult] = useState<PriceCalculationResult | null>(null);

  useEffect(() => {
    console.log('usePriceCalculation received extraHoursRate:', extraHoursRate);
    if (!startDate || !endDate || !pricingTiers || pricingTiers.length === 0) {
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setResult(null);
      return;
    }
    
    console.log('=== Date Parsing ===');
    console.log('Raw Start Date:', startDate);
    console.log('Raw End Date:', endDate);
    console.log('Parsed Start:', start.toISOString());
    console.log('Parsed End:', end.toISOString());
    console.log('Start Time:', start.toLocaleTimeString());
    console.log('End Time:', end.toLocaleTimeString());
    console.log('===================');
    
    const diffTime = end.getTime() - start.getTime();
    const totalMinutes = diffTime / (1000 * 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // If minutes > 15, count as extra hour; if <= 15, ignore
    const billableHours = remainingMinutes > 15 ? totalHours + 1 : totalHours;

    if (billableHours <= 0) {
      setResult(null);
      return;
    }

    // Calculate full days and extra hours
    // If extra hours > 6, count as 1 additional day
    let totalDays = Math.floor(billableHours / 24);
    let extraHours = billableHours % 24;
    
    if (extraHours > 6) {
      totalDays += 1;
      extraHours = 0;
    }

    // Find the appropriate pricing tier based on days
    const tier = pricingTiers.find(
      (t) => totalDays >= t.minDays && totalDays <= t.maxDays
    ) || pricingTiers[pricingTiers.length - 1];

    let pricePerDay = tier.pricePerDay;
    if (sellOffer && sellOffer > 0) {
      pricePerDay = pricePerDay * (1 - sellOffer / 100);
    }

    // Calculate total price: (days * pricePerDay) + (days * gearExtraCost) + (extraHours * extraHoursRate) + extensions + addons
    const daysPrice = totalDays * pricePerDay;
    const gearExtraPrice = totalDays * gearExtraCostPerDay;
    const extraHoursPrice = extraHours * extraHoursRate;
    const totalPrice = daysPrice + gearExtraPrice + extraHoursPrice + pickupExtensionPrice + returnExtensionPrice + addOnsPrice;

    // Build breakdown
    let breakdown = "";
    if (totalDays > 0 && extraHours > 0) {
      breakdown = `(${totalDays} day${totalDays > 1 ? 's' : ''} × £${pricePerDay}) + (${extraHours}h × £${extraHoursRate})`;
    } else if (totalDays > 0) {
      breakdown = `(${totalDays} day${totalDays > 1 ? 's' : ''} × £${pricePerDay})`;
    } else {
      breakdown = `(${extraHours}h × £${extraHoursRate})`;
    }
    
    if (pickupExtensionPrice > 0) {
      breakdown += ` + (Pickup Extension £${pickupExtensionPrice})`;
    }
    if (returnExtensionPrice > 0) {
      breakdown += ` + (Return Extension £${returnExtensionPrice})`;
    }
    
    if (gearExtraCostPerDay > 0) {
      breakdown += ` + (${totalDays} day${totalDays > 1 ? 's' : ''} × £${gearExtraCostPerDay} Gear)`;
    }
    
    if (addOnsPrice > 0) {
      breakdown += ` + (Add-ons £${addOnsPrice})`;
    }

    // Log calculation details
    console.log('=== Price Calculation ===');
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Total Minutes:', totalMinutes);
    console.log('Remaining Minutes:', remainingMinutes);
    console.log('Billable Hours:', billableHours);
    console.log('Total Days:', totalDays);
    console.log('Extra Hours:', extraHours);
    console.log('Price Per Day:', `£${pricePerDay}`);
    console.log('Extra Hours Rate:', `£${extraHoursRate}`);
    console.log('Days Price:', `£${daysPrice}`);
    console.log('Gear Extra Price:', `£${gearExtraPrice}`);
    console.log('Extra Hours Price:', `£${extraHoursPrice}`);
    console.log('Pickup Extension Price:', `£${pickupExtensionPrice}`);
    console.log('Return Extension Price:', `£${returnExtensionPrice}`);
    console.log('Total Price:', `£${totalPrice}`);
    console.log('Breakdown:', breakdown);
    console.log('========================');

    setResult({
      totalHours: billableHours,
      totalDays,
      extraHours,
      pricePerDay,
      extraHoursRate,
      totalPrice,
      breakdown,
      pickupExtensionPrice,
      returnExtensionPrice,
      addOnsPrice,
    });
  }, [startDate, endDate, pricingTiers, extraHoursRate, pickupExtensionPrice, returnExtensionPrice, gearExtraCostPerDay, addOnsPrice, sellOffer]);

  return result;
}
