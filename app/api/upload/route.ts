import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.this_S3_REGION,
  credentials: {
    accessKeyId: process.env.this_ACCESS_KEY_ID!,
    secretAccessKey: process.env.this_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `images/${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.this_S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = `https://${process.env.this_S3_BUCKET}.s3.${process.env.this_S3_REGION}.amazonaws.com/${key}`;
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
