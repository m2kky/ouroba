import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

// Initialize S3 Client for Cloudflare R2
const getS3Client = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing R2 credentials in environment variables");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "uploads"
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucketName || !publicUrl) {
    throw new Error("Missing R2 bucket configuration");
  }

  // Generate a unique filename to prevent collisions
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${fileName.replace(/\s+/g, '-')}`;
  const fileKey = `${folder}/${uniqueFileName}`; // Path inside the R2 bucket

  // Determine Content-Type based on extension
  const ext = path.extname(fileName).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".gif") contentType = "image/gif";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".mp4") contentType = "video/mp4";
  else if (ext === ".svg") contentType = "image/svg+xml";

  const s3 = getS3Client();

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    // Return the full public URL from R2
    return `${publicUrl}/${fileKey}`;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw new Error("Failed to upload file to Cloudflare R2");
  }
}

export async function deleteFile(fileUrl: string): Promise<boolean> {
  if (!fileUrl) return false;

  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucketName || !publicUrl) return false;

  try {
    // Determine the Key from the URL
    // URL example: https://pub-...r2.dev/uploads/123123-file.png
    // We want the Key: uploads/123123-file.png
    let fileKey = fileUrl;
    
    // If it's a full R2 url, extract the path
    if (fileUrl.startsWith(publicUrl)) {
      fileKey = fileUrl.replace(`${publicUrl}/`, "");
    } else if (fileUrl.startsWith("/")) {
      // Handle legacy local uploads that started with /uploads
      fileKey = fileUrl.substring(1);
    }

    // Skip deletion for old Laravel files that aren't on our R2
    if (fileUrl.includes("camp-coding.site")) {
      return false;
    }

    const s3 = getS3Client();

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })
    );

    return true;
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return false;
  }
}
