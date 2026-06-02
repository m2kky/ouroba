import RecipeDetailsView from "@/views/RecipeDetails/RecipeDetails";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  // 1. Fetch Recipe details by ID with properties and steps
  const recipeDetails = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      properties: true,
      steps: true,
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

  return <RecipeDetailsView data={resolveMediaTree(recipeDetails)} breads={breads} />;
}
