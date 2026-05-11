import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const buildings = await prisma.building.findMany({ where: { isHidden: false } });
    return apiSuccess(buildings);
  } catch (error) {
    return apiError("Failed to fetch buildings", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const building = await prisma.building.create({ data: body });
    return apiSuccess(building, 201);
  } catch (error) {
    return apiError("Failed to create building", 500);
  }
}
