import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Vehicle from "@/model/vehicle";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const vehicles = await Vehicle.find().populate("category");
    return successResponse(vehicles);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const vehicle = await Vehicle.create(body);
    await vehicle.populate("category");
    return successResponse(vehicle, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
