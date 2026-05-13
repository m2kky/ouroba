import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// POST /api/contacts — Submit contact form (public)
export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per 10 minutes per IP
  const ip = getClientIp(request);
  const { limited, resetIn } = checkRateLimit(`contacts:${ip}`, RATE_LIMITS.form);
  if (limited) {
    return apiError(`Too many requests. Try again in ${resetIn} seconds`, 429);
  }

  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email) {
      return apiError("name and email are required");
    }

    // Basic input length validation
    if (name.length > 200 || email.length > 200 || (phone && phone.length > 30) || (message && message.length > 5000)) {
      return apiError("Input too long");
    }

    const contact = await prisma.contactRequest.create({
      data: { name, email, phone, message },
    });
    return apiSuccess(contact, 201);
  } catch (error) {
    return apiError("Failed to submit contact", 500);
  }
}

// GET /api/contacts — Admin only: list all contacts
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

    const contacts = await prisma.contactRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(contacts);
  } catch (error) {
    return apiError("Failed to fetch contacts", 500);
  }
}

