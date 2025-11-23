import { NextRequest } from "next/server";
import connect from "@/lib/data";
import AddOn from "@/model/addOn";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const addOns = await AddOn.find();
    return successResponse(addOns);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const addOn = await AddOn.create(body);
    return successResponse(addOn, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
