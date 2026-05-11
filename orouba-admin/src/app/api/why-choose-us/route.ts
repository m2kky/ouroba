import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const items = await prisma.whyChooseUs.findMany({ where: { isHidden: false } });
    return apiSuccess(items);
  } catch (error) {
    return apiError("Failed to fetch why-choose-us", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await prisma.whyChooseUs.create({ data: body });
    return apiSuccess(item, 201);
  } catch (error) {
    return apiError("Failed to create why-choose-us", 500);
  }
}
