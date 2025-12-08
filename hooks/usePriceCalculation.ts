import { useState, useEffect } from "react";

interface PricingTier {
  minHours: number;
  maxHours: number;
  pricePerHour: number;
}

interface PriceCalculationResult {
  totalHours: number;
  billableDays: number;
  billableHours: number;
  pricePerHour: number;
  totalPrice: number;
  breakdown: string;
}

export function usePriceCalculation(
  startDate: string,
  endDate: string,
  pricingTiers: PricingTier[]
): PriceCalculationResult | null {
  const [result, setResult] = useState<PriceCalculationResult | null>(null);

  useEffect(() => {
    if (!startDate || !endDate || !pricingTiers || pricingTiers.length === 0) {
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log('=== Date Parsing ===');
    console.log('Raw Start Date:', startDate);
    console.log('Raw End Date:', endDate);
    console.log('Parsed Start:', start.toISOString());
    console.log('Parsed End:', end.toISOString());
    console.log('Start Time:', start.toLocaleTimeString());
    console.log('End Time:', end.toLocaleTimeString());
    console.log('===================');
    
    const diffTime = end.getTime() - start.getTime();
    const totalHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (totalHours <= 0) {
      setResult(null);
      return;
    }

    // Find the appropriate pricing tier
    const tier = pricingTiers.find(
      (t) => totalHours >= t.minHours && totalHours <= t.maxHours
    ) || pricingTiers[0];

    const pricePerHour = tier.pricePerHour;

    // Calculate billable days and hours based on the rule:
    // - Less than 6 hours: charge by hour
    // - 6+ hours but less than 24: charge as 1 day (24 hours)
    // - 24+ hours: calculate full days + remaining hours
    //   - If remaining hours >= 6: charge as full day
    //   - If remaining hours < 6: charge by hour

    let billableDays = 0;
    let billableHours = 0;
    let breakdown = "";

    if (totalHours < 24) {
      // Less than 24 hours: charge as 1 day (24 hours)
      billableDays = 1;
      breakdown = `1 day (${totalHours}h charged as 24h)`;
    } else {
      // 24+ hours: calculate days and remaining hours
      const fullDays = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;

      if (remainingHours >= 6) {
        // Remaining hours >= 6: charge as full day
        billableDays = fullDays + 1;
        breakdown = `${billableDays} days (${totalHours}h = ${fullDays}d + ${remainingHours}h rounded up)`;
      } else if (remainingHours > 0) {
        // Remaining hours < 6: charge days + hours
        billableDays = fullDays;
        billableHours = remainingHours;
        breakdown = `${billableDays} day${billableDays > 1 ? 's' : ''} + ${remainingHours}h (${totalHours}h total)`;
      } else {
        // Exact days
        billableDays = fullDays;
        breakdown = `${billableDays} day${billableDays > 1 ? 's' : ''} (${totalHours}h)`;
      }
    }

    // Calculate total price
    const totalPrice = (billableDays * 24 + billableHours) * pricePerHour;

    // Log calculation details
    console.log('=== Price Calculation ===');
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Total Hours:', totalHours);
    console.log('Billable Days:', billableDays);
    console.log('Billable Hours:', billableHours);
    console.log('Billable Total:', `${billableDays} days (${billableDays * 24}h) + ${billableHours}h = ${billableDays * 24 + billableHours}h`);
    console.log('Price Per Hour:', `£${pricePerHour}`);
    console.log('Total Price:', `£${totalPrice}`);
    console.log('Breakdown:', breakdown);
    console.log('========================');

    setResult({
      totalHours,
      billableDays,
      billableHours,
      pricePerHour,
      totalPrice,
      breakdown,
    });
  }, [startDate, endDate, pricingTiers]);

  return result;
}
