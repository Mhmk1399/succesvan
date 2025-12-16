import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Office from "@/model/office";
import Vehicle from "@/model/vehicle";
import Category from "@/model/category";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const offices = await Office.find()
      .populate([
        { path: "vehicles.vehicle", model: Vehicle },
        { path: "categories", model: Category },
      ])
      .skip(skip)
      .limit(limit);

    const total = await Office.countDocuments();
    const pages = Math.ceil(total / limit);

    return successResponse({
      data: offices,
      pagination: { page, limit, total, pages },
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
    const office = await Office.create(body);
    await office.populate([
      { path: "vehicles.vehicle", model: Vehicle },
      { path: "categories", model: Category },
    ]);
    return successResponse(office, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}
