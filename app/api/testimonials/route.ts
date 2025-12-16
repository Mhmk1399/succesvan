import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Testimonial from "@/model/testimonial";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Testimonial.countDocuments();
    const pages = Math.ceil(total / limit);

    return successResponse({
      data: testimonials,
      pagination: { page, limit, total, pages },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
export async function POST(req: NextRequest) {
  try {
    await connect();
    const { name, email, message, rating } = await req.json();

    if (!name || !email || !message) {
      return errorResponse("All fields are required", 400);
    }

    const testimonial = await Testimonial.create({
      name,
      email,
      message,
      rating: rating || 5,
      status: "pending",
    });

    return successResponse(testimonial, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}
