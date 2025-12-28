import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Category from "@/model/category";
 import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const name = searchParams.get("name");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    if (!page && !limit) {
      const query: any = {};
      if (name) query.name = { $regex: name, $options: "i" };
      if (type) query.type = type;
      if (status) query.status = status;

      let categories = await Category.find(query)
        .sort({ showPrice: 1 });

      // Try to populate type field, but don't fail if it doesn't work
      try {
        categories = await Category.populate(categories, {
          path: "type",
          options: { strictPopulate: false }
        });
      } catch (populateError) {
        console.warn("Failed to populate type field:", populateError);
        // Continue without populated data
      }

      return successResponse({ data: categories });
    }

    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit || "10");
    const skip = (pageNum - 1) * limitNum;
    const query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (type) query.type = type;
    if (status) query.status = status;

    let categories = await Category.find(query)
      .sort({ showPrice: 1 })
      .skip(skip)
      .limit(limitNum);

    // Try to populate type field, but don't fail if it doesn't work
    try {
      categories = await Category.populate(categories, {
        path: "type",
        options: { strictPopulate: false }
      });
    } catch (populateError) {
      console.warn("Failed to populate type field:", populateError);
      // Continue without populated data
    }

    const total = await Category.countDocuments(query);

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
    console.error("Categories API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const category = await Category.create(body);

    // Try to populate type field, but don't fail if it doesn't work
    try {
      await category.populate("type");
    } catch (populateError) {
      console.warn("Failed to populate type field on create:", populateError);
      // Continue without populated data
    }

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
    });

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    // Try to populate type field, but don't fail if it doesn't work
    try {
      await category.populate("type");
    } catch (populateError) {
      console.warn("Failed to populate type field on update:", populateError);
      // Continue without populated data
    }

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
