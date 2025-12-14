import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Office from "@/model/office";
import Vehicle from "@/model/vehicle";
import Category from "@/model/category";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const offices = await Office.find().populate([{path:"vehicles.vehicle", model: Vehicle}, {path:"categories", model: Category}]);
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
    await office.populate([{path:"vehicles.vehicle", model: Vehicle}, {path:"categories", model: Category}]);
    return successResponse(office, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
