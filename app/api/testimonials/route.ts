import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Testimonial from "@/model/testimonial";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return successResponse(testimonials);
  } catch (error: any) {
    return errorResponse(error.message, 500);
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
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
