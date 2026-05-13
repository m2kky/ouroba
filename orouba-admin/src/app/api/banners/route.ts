import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/banners — Public: read-only
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isHidden: false },
      orderBy: { number: "asc" },
    });
    return apiSuccess(banners);
  } catch (error) {
    return apiError("Failed to fetch banners", 500);
  }
}

// POST /api/banners — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const banner = await prisma.banner.create({ data: body });
    return apiSuccess(banner, 201);
  } catch (error) {
    return apiError("Failed to create banner", 500);
  }
}
