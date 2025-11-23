import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Category from "@/model/category";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) return errorResponse("Category not found", 404);
    return successResponse(category);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!category) return errorResponse("Category not found", 404);
    return successResponse(category);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return errorResponse("Category not found", 404);
    return successResponse({ message: "Category deleted" });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
