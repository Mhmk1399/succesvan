import { NextRequest, NextResponse } from "next/server";
import { generateBlogImage } from "@/lib/image-generator";
import Blog from "@/model/blogs";
import connect from "@/lib/data";

/**
 * POST /api/blog/generate-image
 * Generate images for blog headings using DALL-E
 * 
 * Body: {
 *   blogId: string,
 *   headingId: string,
 *   description: string (optional - user's custom description)
 * }
 */
export async function POST(request: NextRequest) {
  console.log("🎨 [Image Generator API] Received image generation request");

  try {
    await connect();

    const body = await request.json();
    const { blogId, headingId, description } = body;

    // Validate inputs
    if (!blogId) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    if (!headingId) {
      return NextResponse.json(
        { success: false, error: "Heading ID is required" },
        { status: 400 }
      );
    }

    // Fetch blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Find the heading
    const heading = blog.content.headings.find((h: any) => h.id === headingId);
    if (!heading) {
      return NextResponse.json(
        { success: false, error: "Heading not found" },
        { status: 404 }
      );
    }

    // Only generate images for H1 and H2
    if (heading.level > 2) {
      return NextResponse.json(
        { success: false, error: "Images are only generated for H1 and H2 headings" },
        { status: 400 }
      );
    }

    console.log(`🎨 [Image Generator] Generating image for: ${heading.text}`);

    // Generate image using DALL-E
    const imageData = await generateBlogImage(
      blog.content.topic,
      heading.text,
      description || blog.generationProgress.imageDescriptions?.get(headingId)
    );

    // Add to media library
    const mediaItem = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "image" as const,
      url: imageData.url,
      alt: `${heading.text} - Illustration`,
      caption: heading.text,
      filename: `${heading.text.toLowerCase().replace(/\s+/g, "-")}.png`,
      size: 0, // DALL-E images don't have size info
    };

    if (!blog.media.mediaLibrary) {
      blog.media.mediaLibrary = [];
    }
    blog.media.mediaLibrary.push(mediaItem);

    // Set as featured image if it's the first one
    if (!blog.media.featuredImage) {
      blog.media.featuredImage = imageData.url;
    }

    await blog.save();

    console.log(`✅ [Image Generator] Image generated and saved`);
    console.log(`   - URL: ${imageData.url.substring(0, 50)}...`);

    return NextResponse.json({
      success: true,
      blogId: blog._id,
      headingId,
      mediaItem,
      message: "Image generated successfully"
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [Image Generator API] Error:", message);

    return NextResponse.json(
      {
        success: false,
        error: message || "Failed to generate image",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/generate-image/batch
 * Generate images for multiple headings at once
 */
export async function PUT(request: NextRequest) {
  console.log("🎨 [Image Generator API] Batch image generation request");

  try {
    await connect();

    const body = await request.json();
    const { blogId, headingIds, descriptions } = body;

    if (!blogId || !headingIds || !Array.isArray(headingIds)) {
      return NextResponse.json(
        { success: false, error: "Blog ID and headingIds array are required" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    console.log(`🎨 [Image Generator] Generating ${headingIds.length} images`);

    const results = [];
    const errors = [];

    // Generate images sequentially to avoid rate limits
    for (const headingId of headingIds) {
      try {
        const heading = blog.content.headings.find((h: any) => h.id === headingId);
        
        if (!heading || heading.level > 2) {
          errors.push({ headingId, error: "Invalid heading or level > 2" });
          continue;
        }

        const description = descriptions?.[headingId] || 
                          blog.generationProgress.imageDescriptions?.get(headingId);

        console.log(`   - Generating image for: ${heading.text}`);

        const imageData = await generateBlogImage(
          blog.content.topic,
          heading.text,
          description
        );

        const mediaItem = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "image" as const,
          url: imageData.url,
          alt: `${heading.text} - Illustration`,
          caption: heading.text,
          filename: `${heading.text.toLowerCase().replace(/\s+/g, "-")}.png`,
          size: 0,
        };

        if (!blog.media.mediaLibrary) {
          blog.media.mediaLibrary = [];
        }
        blog.media.mediaLibrary.push(mediaItem);

        if (!blog.media.featuredImage) {
          blog.media.featuredImage = imageData.url;
        }

        results.push({ headingId, mediaItem });

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errors.push({ headingId, error: message });
        console.error(`   ❌ Failed for heading ${headingId}:`, message);
      }
    }

    // Mark images as approved if all succeeded
    if (errors.length === 0) {
      blog.generationProgress.imagesApproved = true;
      blog.generationProgress.currentStep = "content";
    }

    await blog.save();

    console.log(`✅ [Image Generator] Batch complete: ${results.length} succeeded, ${errors.length} failed`);

    return NextResponse.json({
      success: true,
      blogId: blog._id,
      results,
      errors,
      message: `Generated ${results.length} images${errors.length > 0 ? ` (${errors.length} failed)` : ""}`
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [Image Generator API] Batch error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
