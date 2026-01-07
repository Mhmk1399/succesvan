import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION || process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.this_SECRET_ACCESS_KEY!
  }
});

export async function uploadImage(key: string, file: Buffer | Uint8Array) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET || process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file,
    ContentType: "image/jpeg" // or whatever
  });

  await s3.send(cmd);
}

export async function getImageUrl(key: string) {
  const cmd = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET || process.env.AWS_S3_BUCKET,
    Key: key
  });

  return await getSignedUrl(s3, cmd, { expiresIn: 3600 });
}
