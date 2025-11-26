import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Category from "@/model/category";
import Type from "@/model/type";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const categories = await Category.find().populate("type");
    return successResponse(categories);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const category = await Category.create(body);
    await category.populate("type");
    return successResponse(category, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
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
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Category.findByIdAndDelete(id);
    return successResponse({ message: "Category deleted" });
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
