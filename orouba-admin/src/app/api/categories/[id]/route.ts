import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/categories/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        brand: true,
        products: {
          where: { isHidden: false },
          include: {
            product: { include: { images: true, type: true } },
          },
          orderBy: { product: { number: "asc" } },
        },
      },
    });

    if (!category) return apiError("Category not found", 404);
    return apiSuccess(category);
  } catch (error) {
    return apiError("Failed to fetch category", 500);
  }
}

// PUT /api/categories/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const category = await prisma.category.update({ where: { id }, data: body });
    return apiSuccess(category);
  } catch (error) {
    return apiError("Failed to update category", 500);
  }
}

// DELETE /api/categories/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError("Failed to delete category", 500);
  }
}
