import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import { successResponse, errorResponse } from "@/lib/api-response";
import office from "@/model/office";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const officeId = searchParams.get("office");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!officeId) return errorResponse("Office ID is required", 400);

    const query: any = { office: officeId };

    // Find reservations that overlap with the selected date
    if (startDate) {
      const date = new Date(startDate);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      // Find reservations where:
      // - startDate is on this day, OR
      // - endDate is on this day, OR
      // - reservation spans across this day
      query.$or = [
        { startDate: { $gte: dayStart, $lte: dayEnd } },
        { endDate: { $gte: dayStart, $lte: dayEnd } },
        { startDate: { $lt: dayStart }, endDate: { $gt: dayEnd } },
      ];
    }

    const reservations = await Reservation.find(query).populate({
      path: "office",
      model: office,
    });

    // Group slots by date
    const reservedSlots = reservations.map((r: any) => {
      const resStart = new Date(r.startDate);
      const resEnd = new Date(r.endDate);
      const isSameDay = resStart.toDateString() === resEnd.toDateString();

      return {
        startDate: resStart.toISOString().split("T")[0],
        endDate: resEnd.toISOString().split("T")[0],
        startTime: resStart.toTimeString().slice(0, 5),
        endTime: resEnd.toTimeString().slice(0, 5),
        isSameDay,
      };
    });

    return successResponse({ reservations, reservedSlots });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
