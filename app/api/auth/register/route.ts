import { NextRequest } from "next/server";
import connect from "@/lib/data";
import User from "@/model/user";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({ ...body, password: hashedPassword });
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    
    const { password, ...userWithoutPassword } = user.toObject();
    return successResponse({ token, user: userWithoutPassword }, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
