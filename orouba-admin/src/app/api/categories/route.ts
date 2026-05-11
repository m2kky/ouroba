import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, parsePagination } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);
    const brandId = searchParams.get("brandId");
    const showHidden = searchParams.get("showHidden") === "true";

    const where: any = showHidden ? {} : { isHidden: false };
    if (brandId) where.brandId = brandId;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { number: "asc" },
        skip,
        take: limit,
        include: {
          brand: { select: { id: true, nameEn: true, nameAr: true } },
          _count: { select: { products: true } },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return apiSuccess({
      categories,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return apiError("Failed to fetch categories", 500);
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, image, imageEn, brandId, number } = body;

    if (!nameEn || !nameAr || !brandId) {
      return apiError("nameEn, nameAr, and brandId are required");
    }

    const category = await prisma.category.create({
      data: { nameEn, nameAr, descriptionEn, descriptionAr, image, imageEn, brandId, number: number ?? 999 },
      include: { brand: { select: { id: true, nameEn: true, nameAr: true } } },
    });

    return apiSuccess(category, 201);
  } catch (error) {
    return apiError("Failed to create category", 500);
  }
}
