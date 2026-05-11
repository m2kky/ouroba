import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// POST /api/collaborates — Submit collaboration form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, name, email, phone, message } = body;

    if (!email) {
      return apiError("email is required");
    }

    const collaborate = await prisma.collaborateRequest.create({
      data: { firstName, lastName, name, email, phone, message },
    });
    return apiSuccess(collaborate, 201);
  } catch (error) {
    return apiError("Failed to submit collaboration request", 500);
  }
}

// GET /api/collaborates — Admin: list all
export async function GET(request: NextRequest) {
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
