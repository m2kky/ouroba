import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, parsePagination } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);
    const showHidden = searchParams.get("showHidden") === "true";
    const brandId = searchParams.get("brandId");
    const categoryId = searchParams.get("categoryId");
    const typeId = searchParams.get("typeId");
    const search = searchParams.get("search");

    const where: any = showHidden ? {} : { isHidden: false };

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

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { number: "asc" },
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

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, typeId, color, number, categoryIds, imageUrls } = body;

    if (!nameEn || !nameAr) {
      return apiError("nameEn and nameAr are required");
    }

    const product = await prisma.product.create({
      data: {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        typeId,
        color: color ?? "#ffffff",
        number: number ?? 999,
        images: imageUrls?.length
          ? { create: imageUrls.map((url: string) => ({ url })) }
          : undefined,
        categories: categoryIds?.length
          ? { create: categoryIds.map((categoryId: string) => ({ categoryId })) }
          : undefined,
      },
      include: { images: true, categories: true },
    });

    return apiSuccess(product, 201);
  } catch (error) {
    return apiError("Failed to create product", 500);
  }
}
