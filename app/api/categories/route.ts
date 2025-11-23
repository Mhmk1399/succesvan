import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Category from "@/model/category";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const categories = await Category.find();
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
    return successResponse(category, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
