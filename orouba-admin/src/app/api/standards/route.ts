import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const standards = await prisma.standard.findMany({ where: { isHidden: false } });
    return apiSuccess(standards);
  } catch (error) {
    return apiError("Failed to fetch standards", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const standard = await prisma.standard.create({ data: body });
    return apiSuccess(standard, 201);
  } catch (error) {
    return apiError("Failed to create standard", 500);
  }
}
