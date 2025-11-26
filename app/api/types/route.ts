import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Type from "@/model/type";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const types = await Type.find();
    return successResponse(types);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const type = await Type.create(body);
    return successResponse(type, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
