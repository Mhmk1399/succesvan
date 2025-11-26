import { NextRequest } from "next/server";
import connect from "@/lib/data";
import User from "@/model/user";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    await connect();

    const user = await User.findById(auth.userId).select("-password");
    if (!user) return errorResponse("User not found", 404);

    return successResponse(user);
  } catch (error: any) {
    return errorResponse(
      error.message === "Unauthorized" ? "Unauthorized" : error.message,
      error.message === "Unauthorized" ? 401 : 500
    );
  }
}
