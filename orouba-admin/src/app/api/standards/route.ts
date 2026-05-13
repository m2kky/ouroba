import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/standards — Public: read-only
export async function GET() {
  try {
    const standards = await prisma.standard.findMany({ where: { isHidden: false } });
    return apiSuccess(standards);
  } catch (error) {
    return apiError("Failed to fetch standards", 500);
  }
}

// POST /api/standards — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const standard = await prisma.standard.create({ data: body });
    return apiSuccess(standard, 201);
  } catch (error) {
    return apiError("Failed to create standard", 500);
  }
}
