import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Category from "@/model/category";
import { successResponse, errorResponse } from "@/lib/api-response";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function addCorsHeaders(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) return addCorsHeaders(errorResponse("Category not found", 404));
    return addCorsHeaders(successResponse(category));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return addCorsHeaders(errorResponse(message, 500));
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!category) return addCorsHeaders(errorResponse("Category not found", 404));
    return addCorsHeaders(successResponse(category));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return addCorsHeaders(errorResponse(message, 400));
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return addCorsHeaders(errorResponse("Category not found", 404));
    return addCorsHeaders(successResponse({ message: "Category deleted" }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return addCorsHeaders(errorResponse(message, 500));
  }
}
