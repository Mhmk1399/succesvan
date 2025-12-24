import { NextRequest } from "next/server";
import connect from "@/lib/data";
import User from "@/model/user";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const createdAtStart = searchParams.get("createdAtStart");
    const createdAtEnd = searchParams.get("createdAtEnd");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (username) {
      query.$or = [
        { name: { $regex: username, $options: "i" } },
        { lastName: { $regex: username, $options: "i" } },
      ];
    }
    if (email) {
      query["emaildata.emailAddress"] = { $regex: email, $options: "i" };
    }
    if (phone) {
      query["phoneData.phoneNumber"] = { $regex: phone, $options: "i" };
    }
    if (createdAtStart || createdAtEnd) {
      query.createdAt = {};
      if (createdAtStart) query.createdAt.$gte = new Date(createdAtStart);
      if (createdAtEnd) {
        const endDate = new Date(createdAtEnd);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return successResponse({
      data: users,
      pagination: { page, limit, total, pages },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
