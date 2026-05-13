import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/buildings — Public: read-only
export async function GET() {
  try {
    const buildings = await prisma.building.findMany({ where: { isHidden: false } });
    return apiSuccess(buildings);
  } catch (error) {
    return apiError("Failed to fetch buildings", 500);
  }
}

// POST /api/buildings — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const building = await prisma.building.create({ data: body });
    return apiSuccess(building, 201);
  } catch (error) {
    return apiError("Failed to create building", 500);
  }
}
