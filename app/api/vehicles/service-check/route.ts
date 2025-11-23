import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Vehicle from "@/model/vehicle";
import Category from "@/model/category";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    
    const vehicles = await Vehicle.find().populate("category");
    const now = new Date();
    const vehiclesNeedingService = [];

    for (const vehicle of vehicles) {
      const category = vehicle.category as any;
      if (!category?.servicesPeriod) continue;

      const expiredServices = [];
      const serviceTypes = ['tire', 'oil', 'battery', 'air', 'service'];

      for (const serviceType of serviceTypes) {
        const lastServiceDate = vehicle.serviceHistory?.[serviceType];
        const periodDays = category.servicesPeriod[serviceType];

        if (lastServiceDate && periodDays) {
          const daysSinceService = Math.floor((now.getTime() - new Date(lastServiceDate).getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceService >= periodDays) {
            expiredServices.push({
              type: serviceType,
              lastService: lastServiceDate,
              daysSinceService,
              requiredPeriod: periodDays,
              daysOverdue: daysSinceService - periodDays
            });
          }
        }
      }

      if (expiredServices.length > 0) {
        // Update needsService flag
        await Vehicle.findByIdAndUpdate(vehicle._id, { needsService: true });
        
        vehiclesNeedingService.push({
          _id: vehicle._id,
          title: vehicle.title,
          category: category.name,
          needsService: true,
          expiredServices
        });
      } else {
        // Update needsService flag to false if all services are up to date
        await Vehicle.findByIdAndUpdate(vehicle._id, { needsService: false });
      }
    }

    return successResponse({
      total: vehiclesNeedingService.length,
      vehicles: vehiclesNeedingService
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
