import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/features — Public: read-only
export async function GET() {
  try {
    const features = await prisma.feature.findMany({ where: { isHidden: false } });
    return apiSuccess(features);
  } catch (error) {
    return apiError("Failed to fetch features", 500);
  }
}

// POST /api/features — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const feature = await prisma.feature.create({ data: body });
    return apiSuccess(feature, 201);
  } catch (error) {
    return apiError("Failed to create feature", 500);
  }
}
