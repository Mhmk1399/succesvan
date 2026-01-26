import { NextRequest, NextResponse } from "next/server";
import connect from "../../../lib/data";
import blogs from "../../../model/blogs";
import Jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
interface CustomJwtPayload extends JwtPayload {
  storeId: string;
}

export async function POST(req: Request) {
  const BlogData = await req.json();

  try {
    await connect();
    if (!connect) {
      console.log("POST_ERROR", "Database connection failed");
      return new NextResponse("Database connection error", { status: 500 });
    }
    const newBlog = new blogs(BlogData);
    console.log(newBlog);

    await newBlog.save();
    console.log("POST_SUCCESS", "Blog created successfully");
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging in", error },
      { status: 500 }
    );
  }
}

export const GET = async (req: NextRequest) => {
  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = Jwt.decode(token) as CustomJwtPayload;
    console.log(decodedToken);

    const storeId = decodedToken.storeId;
    if (!storeId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allBlogs = await blogs.find({ storeId: storeId });
    return NextResponse.json({ blogs: allBlogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging in", error },
      { status: 500 }
    );
  }
};
export const DELETE = async (req: NextRequest) => {
  const id = req.headers.get("id");

  if (!id) {
    return new NextResponse("Blog ID is required", { status: 400 });
  }
  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const decodedToken = Jwt.decode(token) as CustomJwtPayload;
  if (!decodedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sotreId = decodedToken.storeId;
  if (!sotreId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const blogId = id;
  if (!blogId) {
    return new NextResponse("Blog ID is required", { status: 400 });
  }
  console.log(blogId);
  console.log(sotreId);

  await blogs.findByIdAndDelete({ _id: id });
  return new NextResponse(
    JSON.stringify({ message: "Blog deleted successfully" }),
    { status: 200 }
  );
};

export async function PATCH(req: NextRequest) {
  const id = req.headers.get("id");

  if (!id) {
    return new NextResponse("Blog ID is required", { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid blog ID format" },
      { status: 400 }
    );
  }

  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    const body = await req.json();
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = Jwt.decode(token) as CustomJwtPayload;
    const sotreId = decodedToken.storeId;
    if (!sotreId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedBlog = await blogs.findByIdAndUpdate(
      id,
      { ...body, storeId: sotreId },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.log("PATCH_ERROR", id, error);
    return NextResponse.json(
      { message: "Error updating blog" },
      { status: 500 }
    );
  }
}
