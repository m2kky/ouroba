import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const showHidden = searchParams.get("showHidden") === "true";
    const where = showHidden ? {} : { isHidden: false };

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { number: "asc" },
    });

    return apiSuccess(banners);
  } catch (error) {
    return apiError("Failed to fetch banners", 500);
  }
}

// POST /api/banners
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const banner = await prisma.banner.create({ data: body });
    return apiSuccess(banner, 201);
  } catch (error) {
    return apiError("Failed to create banner", 500);
  }
}
