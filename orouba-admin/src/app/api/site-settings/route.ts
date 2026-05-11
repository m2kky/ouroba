import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/site-settings — Get all settings
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    // Transform to key-value map for easy frontend consumption
    const settingsMap = settings.reduce((acc: any, s) => {
      acc[s.key] = { en: s.valueEn, ar: s.valueAr };
      return acc;
    }, {});
    return apiSuccess(settingsMap);
  } catch (error) {
    return apiError("Failed to fetch site settings", 500);
  }
}

// PUT /api/site-settings — Upsert settings (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // body = { key: string, valueEn?: string, valueAr?: string }
    const { key, valueEn, valueAr, description } = body;

    if (!key) return apiError("key is required");

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { valueEn, valueAr, description },
      create: { key, valueEn, valueAr, description },
    });

    return apiSuccess(setting);
  } catch (error) {
    return apiError("Failed to update site setting", 500);
  }
}
