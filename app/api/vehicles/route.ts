import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Vehicle from "@/model/vehicle";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const name = searchParams.get("name");
    const title = searchParams.get("title");
    const number = searchParams.get("number");
    const office = searchParams.get("office");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (name) {
      query.title = { $regex: name, $options: "i" };
    }
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (number) {
      query.number = { $regex: number, $options: "i" };
    }
    if (office) {
      query.office = office;
    }
    if (status) {
      query.status = status;
    }

    const vehicles = await Vehicle.find(query)
      .populate("category")
      .populate({
        path: "reservation",
        populate: [
          { path: "user", select: "name lastName" },
          { path: "office", select: "name" },
        ],
      })
      .populate({
        path: "office",
        select: "name",
      })
      .skip(skip)
      .limit(limit);

    const total = await Vehicle.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return successResponse({
      data: vehicles,
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
    const vehicle = await Vehicle.create(body);
    await vehicle.populate("category");
    return successResponse(vehicle, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}
