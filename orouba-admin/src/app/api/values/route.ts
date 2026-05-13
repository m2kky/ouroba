import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/values — Public: read-only
export async function GET() {
  try {
    const values = await prisma.value.findMany({ where: { isHidden: false } });
    return apiSuccess(values);
  } catch (error) {
    return apiError("Failed to fetch values", 500);
  }
}

// POST /api/values — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const value = await prisma.value.create({ data: body });
    return apiSuccess(value, 201);
  } catch (error) {
    return apiError("Failed to create value", 500);
  }
}
