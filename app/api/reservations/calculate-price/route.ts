import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Vehicle from "@/model/vehicle";
import AddOn from "@/model/addOn";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { vehicleId, startDate, endDate, addOns } = await req.json();
    
    const vehicle = await Vehicle.findById(vehicleId).populate("category");
    if (!vehicle) return errorResponse("Vehicle not found", 404);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const days = Math.ceil(hours / 24);
    
    const category = vehicle.category as any;
    const tier = category.pricingTiers?.find((t: any) => hours >= t.minHours && hours <= t.maxHours);
    if (!tier) return errorResponse("No pricing tier found for this duration", 400);
    
    let vehiclePrice = tier.pricePerHour * hours;
    let addOnsPrice = 0;
    
    if (addOns && addOns.length > 0) {
      for (const item of addOns) {
        const addOn = await AddOn.findById(item.addOnId);
        if (addOn) {
          if (addOn.pricingType === "flat") {
            addOnsPrice += addOn.flatPrice * item.quantity;
          } else if (addOn.pricingType === "tiered") {
            const tier = addOn.tiers.find((t: any) => days >= t.minDays && days <= t.maxDays);
            if (tier) {
              addOnsPrice += tier.price * item.quantity;
            }
          }
        }
      }
    }
    
    const totalPrice = vehiclePrice + addOnsPrice;
    
    return successResponse({ 
      vehiclePrice, 
      addOnsPrice, 
      totalPrice, 
      hours, 
      days 
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
