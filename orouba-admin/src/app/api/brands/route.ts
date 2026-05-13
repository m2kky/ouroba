import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, parsePagination } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/brands — Public: read-only
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);

    const where = { isHidden: false };

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        orderBy: { number: "asc" },
        skip,
        take: limit,
        include: {
          _count: { select: { categories: true } },
        },
      }),
      prisma.brand.count({ where }),
    ]);

    return apiSuccess({
      brands,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return apiError("Failed to fetch brands", 500);
  }
}

// POST /api/brands — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, image, imageMain, imageSmall, imageSmallMain, colorBrand, colorHover, number } = body;

    if (!nameEn || !nameAr) {
      return apiError("nameEn and nameAr are required");
    }

    const brand = await prisma.brand.create({
      data: {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        image,
        imageMain,
        imageSmall,
        imageSmallMain,
        colorBrand,
        colorHover,
        number: number ?? 999,
      },
    });

    return apiSuccess(brand, 201);
  } catch (error) {
    return apiError("Failed to create brand", 500);
  }
}
