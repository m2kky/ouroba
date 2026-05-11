import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        type: true,
        categories: {
          include: {
            category: {
              include: { brand: { select: { id: true, nameEn: true, nameAr: true, image: true } } },
            },
          },
        },
        recommendedRecipes: {
          include: {
            recipe: {
              include: { images: true, properties: true },
            },
          },
        },
        socials: true,
      },
    });

    if (!product) return apiError("Product not found", 404);
    return apiSuccess(product);
  } catch (error) {
    return apiError("Failed to fetch product", 500);
  }
}

// PUT /api/products/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { imageUrls, categoryIds, ...data } = body;

    // Update product data
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    // Update images if provided
    if (imageUrls) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (imageUrls.length > 0) {
        await prisma.productImage.createMany({
          data: imageUrls.map((url: string) => ({ productId: id, url })),
        });
      }
    }

    // Update categories if provided
    if (categoryIds) {
      await prisma.categoryProduct.deleteMany({ where: { productId: id } });
      if (categoryIds.length > 0) {
        await prisma.categoryProduct.createMany({
          data: categoryIds.map((categoryId: string) => ({ productId: id, categoryId })),
        });
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id },
      include: { images: true, categories: true },
    });

    return apiSuccess(updated);
  } catch (error) {
    return apiError("Failed to update product", 500);
  }
}

// DELETE /api/products/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError("Failed to delete product", 500);
  }
}
