import { NextRequest, NextResponse } from "next/server";
import { generateBlogImage } from "@/lib/image-generator";
import { uploadImage, getImageUrl, deleteImage } from "@/lib/s3";
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
    const { blogId, headingId, description, insertIntoContent } = body;

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

    // Only generate images for H1, H2, H3, and H4
    if (heading.level > 4) {
      return NextResponse.json(
        { success: false, error: "Images are only generated for H1, H2, H3, and H4 headings" },
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

    console.log(`   - DALL-E image generated, downloading and uploading to S3...`);

    // Download image from DALL-E and upload to S3
    const imageResponse = await fetch(imageData.url);
    if (!imageResponse.ok) {
      throw new Error("Failed to download image from DALL-E");
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Generate unique S3 key
    const s3Key = `blog-images/${blogId}/${headingId}-${Date.now()}.png`;
    
    // Upload to S3
    await uploadImage(s3Key, Buffer.from(imageBuffer));
    
    // Get signed URL for the uploaded image
    const s3Url = await getImageUrl(s3Key);
    
    console.log(`   - Image uploaded to S3: ${s3Key}`);

    // Add to media library with S3 URL
    const mediaItem = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "image" as const,
      url: s3Url,
      s3Key: s3Key, // Store S3 key for deletion
      alt: `${heading.text} - Illustration`,
      caption: heading.text,
      filename: `${heading.text.toLowerCase().replace(/\s+/g, "-")}.png`,
      size: imageBuffer.byteLength,
    };

    if (!blog.media.mediaLibrary) {
      blog.media.mediaLibrary = [];
    }
    blog.media.mediaLibrary.push(mediaItem);

    // Set as featured image if it's the first one
    if (!blog.media.featuredImage) {
      blog.media.featuredImage = s3Url;
    }

    // Insert image into heading content if requested
    if (insertIntoContent) {
      const headingIndex = blog.content.headings.findIndex((h: any) => h.id === headingId);
      if (headingIndex !== -1) {
        const imageHtml = `<figure class="my-6">\n  <img src="${s3Url}" alt="${mediaItem.alt}" class="w-full rounded-xl shadow-lg" />\n</figure>`;
        
        // Prepend image to heading content
        blog.content.headings[headingIndex].content = imageHtml + (blog.content.headings[headingIndex].content || "");
        blog.markModified('content.headings');
        console.log(`   - Image inserted into heading: ${blog.content.headings[headingIndex].text}`);
      }
    }

    await blog.save();

    console.log(`✅ [Image Generator] Image generated and saved to S3`);

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
    const { blogId, headingIds, descriptions, insertIntoContent } = body;

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
        
        if (!heading || heading.level > 4) {
          errors.push({ headingId, error: "Invalid heading or level > 4" });
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

        console.log(`   - DALL-E image generated, uploading to S3...`);

        // Download image from DALL-E and upload to S3
        const imageResponse = await fetch(imageData.url);
        if (!imageResponse.ok) {
          throw new Error("Failed to download image from DALL-E");
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        
        // Generate unique S3 key
        const s3Key = `blog-images/${blogId}/${headingId}-${Date.now()}.png`;
        
        // Upload to S3
        await uploadImage(s3Key, Buffer.from(imageBuffer));
        
        // Get signed URL for the uploaded image
        const s3Url = await getImageUrl(s3Key);

        const mediaItem = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "image" as const,
          url: s3Url,
          s3Key: s3Key,
          alt: `${heading.text} - Illustration`,
          caption: heading.text,
          filename: `${heading.text.toLowerCase().replace(/\s+/g, "-")}.png`,
          size: imageBuffer.byteLength,
        };

        if (!blog.media.mediaLibrary) {
          blog.media.mediaLibrary = [];
        }
        blog.media.mediaLibrary.push(mediaItem);

        if (!blog.media.featuredImage) {
          blog.media.featuredImage = s3Url;
        }

        // Insert image into heading content if requested
        if (insertIntoContent) {
          const headingIndex = blog.content.headings.findIndex((h: any) => h.id === headingId);
          if (headingIndex !== -1) {
            const imageHtml = `<figure class="my-6">\n  <img src="${s3Url}" alt="${mediaItem.alt}" class="w-full rounded-xl shadow-lg" />\n</figure>`;
            
            // Prepend image to heading content
            blog.content.headings[headingIndex].content = imageHtml + (blog.content.headings[headingIndex].content || "");
            console.log(`   - Image inserted into heading: ${blog.content.headings[headingIndex].text}`);
          }
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

    // Mark headings as modified if asdi inserted images
    if (insertIntoContent) {
      blog.markModified('content.headings');
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

/**
 * DELETE /api/blog/generate-image
 * Delete an image from media library and S3
 * 
 * Body: {
 *   blogId: string,
 *   mediaId: string
 * }
 */
export async function DELETE(request: NextRequest) {
  console.log("🗑️ [Image Generator API] Received delete request");

  try {
    await connect();

    const body = await request.json();
    const { blogId, mediaId } = body;

    if (!blogId || !mediaId) {
      return NextResponse.json(
        { success: false, error: "Blog ID and Media ID are required" },
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

    // Find the media item
    const mediaIndex = blog.media.mediaLibrary?.findIndex((m: any) => m.id === mediaId);
    if (mediaIndex === -1 || mediaIndex === undefined) {
      return NextResponse.json(
        { success: false, error: "Media item not found" },
        { status: 404 }
      );
    }

    const mediaItem = blog.media.mediaLibrary[mediaIndex];

    // Delete from S3 if we have the s3Key
    if (mediaItem.s3Key) {
      try {
        await deleteImage(mediaItem.s3Key);
        console.log(`✅ [Image Generator] Deleted from S3: ${mediaItem.s3Key}`);
      } catch (s3Error) {
        console.error("❌ [Image Generator] Failed to delete from S3:", s3Error);
        // Continue anyway - we still want to remove from database
      }
    }

    // Remove from media library
    blog.media.mediaLibrary = blog.media.mediaLibrary.filter((m: any) => m.id !== mediaId);

    // If deleted item was featured image, clear it
    if (blog.media.featuredImage === mediaItem.url) {
      blog.media.featuredImage = null;
    }

    await blog.save();

    console.log(`✅ [Image Generator] Image deleted from media library`);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [Image Generator API] Delete error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
