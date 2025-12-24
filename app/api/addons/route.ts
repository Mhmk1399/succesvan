import { NextRequest } from "next/server";
import connect from "@/lib/data";
import AddOn from "@/model/addOn";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const name = searchParams.get("name");
    const createdAtStart = searchParams.get("createdAtStart");
    const createdAtEnd = searchParams.get("createdAtEnd");
    const status = searchParams.get("status");

    const query: any = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
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
    if (status) {
      query.status = status;
    }

    // If pagination params not provided, return all data
    if (!page && !limit) {
      const addOns = await AddOn.find(query);
      return successResponse({ data: addOns });
    }

    // With pagination
    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit || "10");
    const skip = (pageNum - 1) * limitNum;

    const [addOns, total] = await Promise.all([
      AddOn.find(query).skip(skip).limit(limitNum),
      AddOn.countDocuments(query),
    ]);

    return successResponse({
      data: addOns,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
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
    const addOn = await AddOn.create(body);
    return successResponse(addOn, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const addOn = await AddOn.findByIdAndUpdate(id, body, { new: true });
    return successResponse(addOn);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await AddOn.findByIdAndDelete(id);
    return successResponse({ message: "AddOn deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}
