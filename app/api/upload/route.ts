import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region:"eu-west-2",
  credentials: {
    accessKeyId: "AKIAYPHV2DKYBE2S7LWO",
    secretAccessKey:"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",
  },
});

export async function POST(req: NextRequest) {
  try {
    // Debug logging for environment variables
   

    const accessKey = "AKIAYPHV2DKYBE2S7LWO";
    const secretKey ="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";
    const bucket = "svh-bucket-s3";

    if (!accessKey || !secretKey || !bucket) {
      console.log("Missing AWS configuration");
      return NextResponse.json(
        { error: "Server configuration error: Missing AWS configuration" },
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
      bucket,
      key,
      size: buffer.length,
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        // Removed ACL as modern S3 buckets don't support it
      })
    );

    const region = "eu-west-2";
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
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
