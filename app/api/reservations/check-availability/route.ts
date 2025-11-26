import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import Vehicle from "@/model/vehicle";
import Office from "@/model/office";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { officeId, vehicleId, startDate, endDate } = await req.json();
    
    const office = await Office.findById(officeId);
    if (!office) return errorResponse("Office not found", 404);
    
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return errorResponse("Vehicle not found", 404);
    
    const conflictingReservation = await Reservation.findOne({
      vehicle: vehicleId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });
    
    if (conflictingReservation) {
      return successResponse({ available: false, message: "Vehicle not available for selected dates" });
    }
    
    return successResponse({ available: true });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
