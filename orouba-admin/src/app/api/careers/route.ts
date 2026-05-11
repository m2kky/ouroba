import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// POST /api/careers — Submit career/join form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, position, message, resumeUrl } = body;

    if (!name || !email) {
      return apiError("name and email are required");
    }

    const career = await prisma.careerRequest.create({
      data: { name, email, phone, position, message, resumeUrl },
    });
    return apiSuccess(career, 201);
  } catch (error) {
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
