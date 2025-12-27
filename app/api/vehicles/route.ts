import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Vehicle from "@/model/vehicle";
import { successResponse, errorResponse } from "@/lib/api-response";
import Reservation from "@/model/reservation";
export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50"); // higher limit for dropdown
    const title = searchParams.get("title");
    const number = searchParams.get("number");
    const office = searchParams.get("office");
    const status = searchParams.get("status");
    const available = searchParams.get("available"); // ← NEW

    const skip = (page - 1) * limit;

    let query: any = {};

    // Text search
    if (title) query.title = { $regex: title, $options: "i" };
    if (number) query.number = { $regex: number, $options: "i" };
    if (office) query.office = office;
    if (status) query.status = status;

    // Special: only available vehicles
    if (available === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find all vehicles currently reserved (active reservations overlapping today)
      const inUseVehicleIds = await Reservation.find({
        status: { $in: ["confirmed", "pending"] },
        startDate: { $lte: tomorrow },
        endDate: { $gte: today },
        vehicle: { $ne: null },
      })
        .distinct("vehicle")
        .lean();

      // Build availability filter
      query._id = { $nin: inUseVehicleIds };
      query.needsService = false;
      query.status = "active";
    }

    const vehicles = await Vehicle.find(query)
      .populate("category", "name")
      .populate("office", "name")
      .skip(skip)
      .limit(limit)
      .sort({ title: 1 })
      .lean();

    const total = await Vehicle.countDocuments(query);

    return successResponse({
      data: vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const vehicle = await Vehicle.create(body);
    await vehicle.populate("category");
    return successResponse(vehicle, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}
