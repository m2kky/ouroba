import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, parsePagination } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/products — Public: list products (read-only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);
    const brandId = searchParams.get("brandId");
    const categoryId = searchParams.get("categoryId");
    const typeId = searchParams.get("typeId");
    const search = searchParams.get("search");

    const where: any = { isHidden: false };

    if (typeId) where.typeId = typeId;
    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: "insensitive" } },
        { nameAr: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      where.categories = { some: { categoryId } };
    }
    if (brandId) {
      where.categories = {
        some: { category: { brandId } },
      };
    }

    const localeParam = searchParams.get("locale");
    const referer = request.headers.get("referer") || "";
    const isEn = localeParam === "en" || referer.includes("/en/") || referer.endsWith("/en");

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [
          { number: "asc" },
          isEn ? { nameEn: "asc" } : { nameAr: "asc" }
        ],
        skip,
        take: limit,
        include: {
          images: true,
          type: true,
          categories: {
            include: { category: { select: { id: true, nameEn: true, nameAr: true } } },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return apiSuccess({
      products,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return apiError("Failed to fetch products", 500);
  }
}

