import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { uploadFile } from "@/lib/upload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

const ALLOWED_RESUME_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

// POST /api/careers — Submit career/join form (public)
export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per 10 minutes per IP
  const ip = getClientIp(request);
  const { limited, resetIn } = checkRateLimit(`careers:${ip}`, RATE_LIMITS.form);
  if (limited) {
    return apiError(`Too many requests. Try again in ${resetIn} seconds`, 429);
  }

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

    // Basic input length validation
    if (name.length > 200 || email.length > 200 || (message && message.length > 5000)) {
      return apiError("Input too long");
    }

    let resumeUrl = "";
    if (file && file.size > 0) {
      // Validate file size
      if (file.size > MAX_RESUME_SIZE) {
        return apiError("File too large. Maximum size is 5MB");
      }
      // Validate file type
      if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
        return apiError("Invalid file type. Only PDF and Word documents are allowed");
      }
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

// GET /api/careers — Admin only: list all
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

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

