import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/models/blogs";
import Jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  storeId: string;
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[3];
  if (!id) {
    return NextResponse.json("Blog ID is required", { status: 400 });
  }

  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = Jwt.decode(token) as CustomJwtPayload;
  if (!decodedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const storeId = decodedToken.storeId;
  if (!storeId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connect();
  if (!connect) {
    return NextResponse.json("Database connection error", { status: 500 });
  }

  const blog = await Blog.findById({ _id: id, storeId: storeId });
  if (!blog) {
    return NextResponse.json("Blog not found", { status: 404 });
  }

  return NextResponse.json(blog, { status: 200 });
}
