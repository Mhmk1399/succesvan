import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/model/blogs";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[3];
  if (!id) {
    return NextResponse.json("Blog ID is required", { status: 400 });
  }
  await connect();
  if (!connect) {
    return NextResponse.json("Database connection error", { status: 500 });
  }

  const blog = await Blog.findById({ _id: id });
  if (!blog) {
    return NextResponse.json("Blog not found", { status: 404 });
  }

  return NextResponse.json(blog, { status: 200 });
}