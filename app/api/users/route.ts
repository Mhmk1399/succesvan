 import connect from "@/lib/data";
import User from "@/model/user";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const users = await User.find().sort({ createdAt: -1 });
    return successResponse(users);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
