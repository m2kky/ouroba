import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, parsePagination } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/recipes — Public: list recipes (read-only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);

    const where = { isHidden: false };

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

