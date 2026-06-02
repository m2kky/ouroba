import RecipesView from "@/views/reciepe";
import { db } from "@/db";
import { recipeCategories, foods, recipeCategoryFoods, recipes, recipeFoods, recipeImages } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { resolveMediaTree } from "@/utils/media";

export default async function RecipesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ c?: string; s_c?: string }>;
}) {
  const { lang } = await params;
  const { c, s_c } = await searchParams;

  // 1. Fetch Categories
  const categories = await db.query.recipeCategories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.number)],
  });

  const selectedCategoryId = c || (categories.length > 0 ? categories[0].id : null);

  // 2. Fetch Foods for the selected category
  let categoryFoodsList: any[] = [];
  if (selectedCategoryId) {
    const relations = await db.query.recipeCategoryFoods.findMany({
      where: eq(recipeCategoryFoods.recipeCategoryId, selectedCategoryId),
      with: {
        food: true,
      },
    });
    categoryFoodsList = relations.map((r) => r.food);
  }

  const selectedFoodId = s_c || (categoryFoodsList.length > 0 ? categoryFoodsList[0].id : null);

  // 3. Fetch Recipes for the selected food
  let foodRecipesList: any[] = [];
  if (selectedFoodId) {
    const relations = await db.query.recipeFoods.findMany({
      where: eq(recipeFoods.foodId, selectedFoodId),
      with: {
        recipe: {
          with: {
            images: true,
          },
        },
      },
    });
    foodRecipesList = relations.map((r) => r.recipe);
  }

  const recipesPageData = {
    data: categories,
    recs: categoryFoodsList,
    cooks: foodRecipesList,
  };

  return <RecipesView recipesPageData={resolveMediaTree(recipesPageData)} />;
}
