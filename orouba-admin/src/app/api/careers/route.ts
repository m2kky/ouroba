import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { uploadFile } from "@/lib/upload";

// POST /api/careers — Submit career/join form
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const message = formData.get("message") as string;
    const file = formData.get("file") as File | null;

    if (!name || !email) {
      return apiError("name and email are required");
    }

    let resumeUrl = "";
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      resumeUrl = await uploadFile(buffer, file.name, "careers");
    }

    const career = await prisma.careerRequest.create({
      data: { name, email, phone, position, message, resumeUrl },
    });
    return apiSuccess(career, 201);
  } catch (error) {
    console.error("Career submit error:", error);
    return apiError("Failed to submit career request", 500);
  }
}

// GET /api/careers — Admin: list all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const where: any = {};
    if (status) where.status = status;

    const careers = await prisma.careerRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(careers);
  } catch (error) {
    return apiError("Failed to fetch career requests", 500);
  }
}
