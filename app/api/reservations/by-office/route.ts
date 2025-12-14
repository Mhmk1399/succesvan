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

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const startEnd = new Date(startDate);
      startEnd.setHours(23, 59, 59, 999);
      query.startDate = { $gte: start, $lte: startEnd };
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      const endEnd = new Date(endDate);
      endEnd.setHours(23, 59, 59, 999);
      query.endDate = { $gte: end, $lte: endEnd };
    }

    const reservations = await Reservation.find(query).populate({
      path: "office",
      model: office,
    });

    const reservedSlots = reservations.map((r: any) => ({
      startTime: new Date(r.startDate).toTimeString().slice(0, 5),
      endTime: new Date(r.endDate).toTimeString().slice(0, 5),
    }));

    return successResponse({ reservations, reservedSlots });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
