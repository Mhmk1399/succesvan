import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Office from "@/model/office";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const offices = await Office.find().populate("vehicles.vehicle");
    return successResponse(offices);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const office = await Office.create(body);
    await office.populate("vehicles.vehicle");
    return successResponse(office, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
