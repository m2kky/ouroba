import RecipeDetailsView from "@/views/RecipeDetails/RecipeDetails";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";

export const dynamic = "force-dynamic";

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch Recipe details by ID with properties and steps
  const recipeDetails = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      properties: true,
      steps: {
        orderBy: (steps, { asc }) => [asc(steps.createdAt), asc(steps.id)],
      },
      images: true,
      foods: {
        with: {
          food: {
            with: {
              recipeCategories: {
                with: {
                  recipeCategory: true,
                }
              }
            }
          }
        }
      }
    },
  });

  if (!recipeDetails) {
    notFound();
  }

  // Find associated food and category for breadcrumbs
  const firstFoodRelation = recipeDetails.foods?.[0];
  const food = firstFoodRelation?.food;
  const category = food?.recipeCategories?.[0]?.recipeCategory;

  const breads = {
    recName: category?.nameEn || "",
    recNameAr: category?.nameAr || "",
    recId: category?.id || "",
    foodName: food?.nameEn || "",
    foodNameAr: food?.nameAr || "",
    foodId: food?.id || "",
  };

  const steps = (recipeDetails.steps || []).map((step) => ({
    ...step,
    step_ar: step.stepAr,
    step_en: step.stepEn,
  }));

  const properties = (recipeDetails.properties || []).map((property) => ({
    ...property,
    title_ar: property.titleAr,
    title_en: property.titleEn,
    text_ar: property.textAr,
    text_en: property.textEn,
  }));

  const normalizedRecipeDetails = {
    ...recipeDetails,
    description_ar: recipeDetails.descriptionAr,
    description_en: recipeDetails.descriptionEn,
    internal_image: recipeDetails.internalImage,
    properties,
    step: steps,
    steps,
  };

  return <RecipeDetailsView data={resolveMediaTree(normalizedRecipeDetails)} breads={breads} />;
}
