import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// POST /api/collaborates — Submit collaboration form (public)
export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per 10 minutes per IP
  const ip = getClientIp(request);
  const { limited, resetIn } = checkRateLimit(`collaborates:${ip}`, RATE_LIMITS.form);
  if (limited) {
    return apiError(`Too many requests. Try again in ${resetIn} seconds`, 429);
  }

  try {
    const body = await request.json();
    const { firstName, lastName, name, email, phone, message } = body;

    if (!email) {
      return apiError("email is required");
    }

    // Basic input length validation
    if (email.length > 200 || (name && name.length > 200) || (message && message.length > 5000)) {
      return apiError("Input too long");
    }

    const collaborate = await prisma.collaborateRequest.create({
      data: { firstName, lastName, name, email, phone, message },
    });
    return apiSuccess(collaborate, 201);
  } catch (error) {
    return apiError("Failed to submit collaboration request", 500);
  }
}

// GET /api/collaborates — Admin only: list all
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

    const collaborates = await prisma.collaborateRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(collaborates);
  } catch (error) {
    return apiError("Failed to fetch collaboration requests", 500);
  }
}

