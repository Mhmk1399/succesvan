import connect from "@/lib/data";
import Vehicle from "@/model/vehicle";
import Reservation from "@/model/reservation";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();

    const totalVehicles = await Vehicle.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const inUseCount = await Reservation.countDocuments({
      status: { $in: ["confirmed", "pending"] },
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    const maintenanceCount = await Vehicle.countDocuments({
      needsService: true,
    });

    const available = totalVehicles - inUseCount - maintenanceCount;

    return successResponse({
      available: Math.max(0, available),
      inUse: inUseCount,
      maintenance: maintenanceCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
