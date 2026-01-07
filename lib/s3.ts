import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "eu-west-2",
  credentials: {
    accessKeyId: "AKIAYPHV2DKYBE2S7LWO",
    secretAccessKey:"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",
  },
});

export async function uploadImage(key: string, file: Buffer | Uint8Array) {
  const cmd = new PutObjectCommand({
    Bucket: "svh-bucket-s3",
    Key: key,
    Body: file,
    ContentType: "image/jpeg", // or whatever
  });

  await s3.send(cmd);
}

export async function getImageUrl(key: string) {
  const cmd = new GetObjectCommand({
    Bucket:"svh-bucket-s3",
    Key: key,
  });

  return await getSignedUrl(s3, cmd, { expiresIn: 3600 });
}
