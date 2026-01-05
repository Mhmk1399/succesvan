import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Type from "@/model/type";
import { successResponse, errorResponse } from "@/lib/api-response";
import Office from "@/model/office";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const name = searchParams.get("name");
    const status = searchParams.get("status");
    const createdAtStart = searchParams.get("createdAtStart");
    const createdAtEnd = searchParams.get("createdAtEnd");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (status) {
      // accept explicit status filter (e.g. "active" or "inactive")
      query.status = status;
    }
    if (createdAtStart || createdAtEnd) {
      query.createdAt = {};
      if (createdAtStart) query.createdAt.$gte = new Date(createdAtStart);
      if (createdAtEnd) {
        const endDate = new Date(createdAtEnd);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    const types = await Type.find(query)
      .populate({
        path: "offices",
        model: Office,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Type.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return successResponse({
      data: types,
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
    const type = await Type.create(body);
    return successResponse(type, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}
