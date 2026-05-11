import { writeFile, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "uploads"
): Promise<string> {
  // Ensure the directory exists
  const uploadDir = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate a unique filename to prevent collisions
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${fileName.replace(/\s+/g, '-')}`;
  const filePath = path.join(uploadDir, uniqueFileName);

  try {
    await writeFile(filePath, fileBuffer);
    // Return the public URL path
    return `/${folder}/${uniqueFileName}`;
  } catch (error) {
    console.error("Error saving file locally:", error);
    throw new Error("Failed to upload file");
  }
}

export async function deleteFile(fileUrl: string): Promise<boolean> {
  if (!fileUrl) return false;

  try {
    // Determine local path from URL
    // URL example: /uploads/123123-file.png
    // We want to delete: public/uploads/123123-file.png
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
    const filePath = path.join(process.cwd(), "public", relativePath);

    if (fs.existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting file locally:", error);
    return false;
  }
}
