import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/recipes/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        images: true,
        properties: true,
        steps: true,
        foods: {
          include: { food: true },
        },
        recommendedWith: {
          include: {
            product: { include: { images: true } },
          },
        },
      },
    });

    if (!recipe) return apiError("Recipe not found", 404);
    return apiSuccess(recipe);
  } catch (error) {
    return apiError("Failed to fetch recipe", 500);
  }
}

// PUT /api/recipes/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { steps, properties, imageUrls, ...data } = body;

    await prisma.recipe.update({ where: { id }, data });

    if (steps) {
      await prisma.recipeStep.deleteMany({ where: { recipeId: id } });
      if (steps.length > 0) {
        await prisma.recipeStep.createMany({
          data: steps.map((s: any) => ({ recipeId: id, stepEn: s.stepEn, stepAr: s.stepAr })),
        });
      }
    }

    if (properties) {
      await prisma.recipeProperty.deleteMany({ where: { recipeId: id } });
      if (properties.length > 0) {
        await prisma.recipeProperty.createMany({
          data: properties.map((p: any) => ({
            recipeId: id, titleEn: p.titleEn, titleAr: p.titleAr,
            textEn: p.textEn, textAr: p.textAr, icon: p.icon,
          })),
        });
      }
    }

    if (imageUrls) {
      await prisma.recipeImage.deleteMany({ where: { recipeId: id } });
      if (imageUrls.length > 0) {
        await prisma.recipeImage.createMany({
          data: imageUrls.map((url: string) => ({ recipeId: id, url })),
        });
      }
    }

    const updated = await prisma.recipe.findUnique({
      where: { id },
      include: { images: true, properties: true, steps: true },
    });

    return apiSuccess(updated);
  } catch (error) {
    return apiError("Failed to update recipe", 500);
  }
}

// DELETE /api/recipes/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.recipe.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError("Failed to delete recipe", 500);
  }
}
