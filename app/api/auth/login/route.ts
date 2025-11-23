import { NextRequest } from "next/server";
import connect from "@/lib/data";
import User from "@/model/user";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connect();
    
    // Check if token is in header (auto-login)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const decoded = verifyToken(req);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return errorResponse("User not found", 404);
        
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );
        
        return successResponse({ token, user });
      } catch (error) {
        return errorResponse("Invalid token", 401);
      }
    }
    
    // Password login
    const { emailAddress, password } = await req.json();
    if (!emailAddress || !password) {
      return errorResponse("Email and password required", 400);
    }
    
    const user = await User.findOne({ "emaildata.emailAddress": emailAddress });
    if (!user) return errorResponse("Invalid credentials", 401);
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return errorResponse("Invalid credentials", 401);
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    return successResponse({ token, user: userWithoutPassword });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
