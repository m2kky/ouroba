import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.R2_ACCOUNT_ID) {
  console.warn("Missing R2_ACCOUNT_ID");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const BUCKET_NAME = process.env.R2_BUCKET_NAME || "orouba-media";
export const BUCKET_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_BUCKET_URL || "";
