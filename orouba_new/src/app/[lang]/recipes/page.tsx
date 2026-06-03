import RecipesView from "@/views/reciepe";
import { db } from "@/db";
import { recipeCategories, recipeCategoryFoods, recipeFoods } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resolveMediaTree } from "@/utils/media";

type LegacyNamed = {
  id: string;
  nameAr?: string | null;
  nameEn?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
};

const withLegacyNames = <T extends { nameAr?: string | null; nameEn?: string | null }>(
  item: T
) => ({
  ...item,
  name_ar: item.nameAr,
  name_en: item.nameEn,
});

export default async function RecipesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ c?: string; s_c?: string }>;
}) {
  await params;
  const { c, s_c } = await searchParams;

  // 1. Fetch Categories
  const categories = await db.query.recipeCategories.findMany({
    where: eq(recipeCategories.isHidden, false),
    orderBy: (categories, { asc }) => [asc(categories.number)],
  });

  const visibleCategories = categories.map(withLegacyNames);
  const selectedCategoryId = c || (visibleCategories.length > 0 ? visibleCategories[0].id : null);

  // 2. Fetch Foods for the selected category
  let categoryFoodsList: LegacyNamed[] = [];
  if (selectedCategoryId) {
    const relations = await db.query.recipeCategoryFoods.findMany({
      where: eq(recipeCategoryFoods.recipeCategoryId, selectedCategoryId),
      with: {
        food: true,
      },
    });
    categoryFoodsList = relations
      .flatMap((r) => (r.food && !r.food.isHidden ? [r.food] : []))
      .map(withLegacyNames);
  }

  const selectedFoodId = s_c || (categoryFoodsList.length > 0 ? categoryFoodsList[0].id : null);

  // 3. Fetch Recipes for the selected food
  let foodRecipesList: LegacyNamed[] = [];
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
    foodRecipesList = relations
      .flatMap((r) => (r.recipe && !r.recipe.isHidden ? [r.recipe] : []))
      .map(withLegacyNames);
  }

  const recipesPageData = {
    data: visibleCategories,
    recs: categoryFoodsList,
    cooks: foodRecipesList,
  };

  return <RecipesView recipesPageData={resolveMediaTree(recipesPageData)} />;
}
