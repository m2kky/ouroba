import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, parsePagination } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/recipes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);
    const showHidden = searchParams.get("showHidden") === "true";

    const where = showHidden ? {} : { isHidden: false };

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        orderBy: { number: "asc" },
        skip,
        take: limit,
        include: {
          images: true,
          properties: true,
          _count: { select: { steps: true, foods: true } },
        },
      }),
      prisma.recipe.count({ where }),
    ]);

    return apiSuccess({
      recipes,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return apiError("Failed to fetch recipes", 500);
  }
}

// POST /api/recipes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, videoLink, internalImage, number, steps, properties, imageUrls } = body;

    const recipe = await prisma.recipe.create({
      data: {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        videoLink,
        internalImage,
        number: number ?? 999,
        steps: steps?.length
          ? { create: steps.map((s: any) => ({ stepEn: s.stepEn, stepAr: s.stepAr })) }
          : undefined,
        properties: properties?.length
          ? { create: properties.map((p: any) => ({ titleEn: p.titleEn, titleAr: p.titleAr, textEn: p.textEn, textAr: p.textAr, icon: p.icon })) }
          : undefined,
        images: imageUrls?.length
          ? { create: imageUrls.map((url: string) => ({ url })) }
          : undefined,
      },
      include: { images: true, properties: true, steps: true },
    });

    return apiSuccess(recipe, 201);
  } catch (error) {
    return apiError("Failed to create recipe", 500);
  }
}
