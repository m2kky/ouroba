import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const values = await prisma.value.findMany({ where: { isHidden: false } });
    return apiSuccess(values);
  } catch (error) {
    return apiError("Failed to fetch values", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const value = await prisma.value.create({ data: body });
    return apiSuccess(value, 201);
  } catch (error) {
    return apiError("Failed to create value", 500);
  }
}
