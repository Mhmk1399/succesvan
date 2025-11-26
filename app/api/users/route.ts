import { NextRequest } from "next/server";
import connect from "@/lib/data";
import User from "@/model/user";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const users = await User.find().select("-password");
    return successResponse(users);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
