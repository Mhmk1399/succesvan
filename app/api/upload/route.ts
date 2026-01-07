import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.this_S3_REGION || "eu-west-2",
  credentials: {
    accessKeyId: process.env.this_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.this_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: NextRequest) {
  try {
    // Debug logging for environment variables
    console.log("Environment check:", {
      hasAccessKey: !!process.env.this_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.this_SECRET_ACCESS_KEY,
      hasRegion: !!process.env.this_S3_REGION,
      hasBucket: !!process.env.this_S3_BUCKET,
    });

    if (!process.env.this_ACCESS_KEY_ID || !process.env.this_SECRET_ACCESS_KEY) {
      console.error("Missing AWS credentials");
      return NextResponse.json(
        { error: "Server configuration error: Missing AWS credentials" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only image and video files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${isVideo ? '50MB' : '5MB'}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = isVideo ? "videos" : "images";
    const key = `${folder}/${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;

    console.log("Uploading to S3:", {
      bucket: process.env.this_S3_BUCKET,
      key,
      size: buffer.length,
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.this_S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        // Removed ACL as modern S3 buckets don't support it
      })
    );

    const url = `https://${process.env.this_S3_BUCKET}.s3.${process.env.this_S3_REGION}.amazonaws.com/${key}`;
    console.log("Upload successful:", url);
    return NextResponse.json({ url });
  } catch (error) {
    console.log("Upload error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
