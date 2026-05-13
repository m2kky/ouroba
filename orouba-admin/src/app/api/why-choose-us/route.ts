import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/why-choose-us — Public: read-only
export async function GET() {
  try {
    const items = await prisma.whyChooseUs.findMany({ where: { isHidden: false } });
    return apiSuccess(items);
  } catch (error) {
    return apiError("Failed to fetch why-choose-us", 500);
  }
}

// POST /api/why-choose-us — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const item = await prisma.whyChooseUs.create({ data: body });
    return apiSuccess(item, 201);
  } catch (error) {
    return apiError("Failed to create why-choose-us", 500);
  }
}
