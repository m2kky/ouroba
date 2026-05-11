import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/brands/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        categories: {
          where: { isHidden: false },
          orderBy: { number: "asc" },
          include: {
            products: {
              where: { isHidden: false },
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!brand) return apiError("Brand not found", 404);
    return apiSuccess(brand);
  } catch (error) {
    return apiError("Failed to fetch brand", 500);
  }
}

// PUT /api/brands/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const brand = await prisma.brand.update({
      where: { id },
      data: body,
    });

    return apiSuccess(brand);
  } catch (error) {
    return apiError("Failed to update brand", 500);
  }
}

// DELETE /api/brands/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.brand.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError("Failed to delete brand", 500);
  }
}
