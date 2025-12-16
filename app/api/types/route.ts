import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Type from "@/model/type";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const types = await Type.find().skip(skip).limit(limit);
    const total = await Type.countDocuments();
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
