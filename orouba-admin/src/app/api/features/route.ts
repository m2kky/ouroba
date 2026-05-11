import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const features = await prisma.feature.findMany({ where: { isHidden: false } });
    return apiSuccess(features);
  } catch (error) {
    return apiError("Failed to fetch features", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feature = await prisma.feature.create({ data: body });
    return apiSuccess(feature, 201);
  } catch (error) {
    return apiError("Failed to create feature", 500);
  }
}
