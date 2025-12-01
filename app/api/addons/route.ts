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

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const addOn = await AddOn.findByIdAndUpdate(id, body, { new: true });
    return successResponse(addOn);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await AddOn.findByIdAndDelete(id);
    return successResponse({ message: "AddOn deleted" });
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
