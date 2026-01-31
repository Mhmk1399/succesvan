import { NextRequest, NextResponse } from "next/server";
import Blog from "@/model/blogs";
import connect from "@/lib/data";

/**
 * GET /api/blog/[id]
 * Get a single blog by ID or slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  console.log("📖 [Blog API] Fetching blog:", resolvedParams.id);

  try {
    await connect();

    // Try to find by MongoDB ID first, then by slug
    let blog = await Blog.findById(resolvedParams.id);
    
    if (!blog) {
      blog = await Blog.findOne({ slug: resolvedParams.id });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    console.log(`✅ [Blog API] Blog found: ${blog.seo.seoTitle}`);
    console.log(`   - Views: ${blog.views}`);
    console.log(`   - Reading time: ${blog.readingTime} min`);

    return NextResponse.json({
      success: true,
      blog
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [Blog API] Error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/blog/[id]
 * Partially update a blog (useful for status changes, publish, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  console.log("🔧 [Blog API] Patching blog:", resolvedParams.id);

  try {
    await connect();

    const body = await request.json();
    
    const blog = await Blog.findById(resolvedParams.id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Apply updates
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined) {
        (blog as any)[key] = body[key];
      }
    });

    await blog.save();

    console.log(`✅ [Blog API] Blog patched: ${blog._id}`);

    return NextResponse.json({
      success: true,
      blog,
      message: "Blog updated successfully"
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [Blog API] Error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
