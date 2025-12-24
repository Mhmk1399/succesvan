import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Category from "@/model/category";
import Type from "@/model/type";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const name = searchParams.get("name");
    const type = searchParams.get("type");

    if (!page && !limit) {
      const query: any = {};
      if (name) query.name = { $regex: name, $options: "i" };
      if (type) query.type = type;
      const categories = await Category.find(query)
        .populate("type")
        .sort({ showPrice: 1 });
      return successResponse({ data: categories });
    }

    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit || "10");
    const skip = (pageNum - 1) * limitNum;
    const query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (type) query.type = type;

    const [categories, total] = await Promise.all([
      Category.find(query)
        .populate("type")
        .sort({ showPrice: 1 })
        .skip(skip)
        .limit(limitNum),
      Category.countDocuments(query),
    ]);

    return successResponse({
      data: categories,
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
    const category = await Category.create(body);
    await category.populate("type");
    return successResponse(category, 201);
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
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
    }).populate("type");
    return successResponse(category);
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
    await Category.findByIdAndDelete(id);
    return successResponse({ message: "Category deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}
