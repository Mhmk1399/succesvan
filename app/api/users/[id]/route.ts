import { NextRequest } from "next/server";
import connect from "@/lib/data";
import User from "@/model/user";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const user = await User.findById(id).select("-password");
    if (!user) return errorResponse("User not found", 404);
    return successResponse(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req);
    const { id } = await params;
    if (auth.userId !== id && auth.role !== "admin") {
      return errorResponse("Forbidden", 403);
    }

    await connect();
    const body = await req.json();

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.address) updateData.address = body.address;
    if (body.email) updateData["emaildata.emailAddress"] = body.email;
    if (body.phone) updateData["phoneData.phoneNumber"] = body.phone;
    if (body.password) updateData.password = body.password;
    if (body.licenceAttached) updateData.licenceAttached = body.licenceAttached;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    if (!user) return errorResponse("User not found", 404);
    return successResponse(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(
      message === "Unauthorized" ? message : message,
      message === "Unauthorized" ? 401 : 400
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req);
    const { id } = await params;
    if (auth.userId !== id && auth.role !== "admin") {
      return errorResponse("Forbidden", 403);
    }

    await connect();
    const user = await User.findByIdAndDelete(id);
    if (!user) return errorResponse("User not found", 404);
    return successResponse({ message: "User deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(
      message === "Unauthorized" ? message : message,
      message === "Unauthorized" ? 401 : 500
    );
  }
}
