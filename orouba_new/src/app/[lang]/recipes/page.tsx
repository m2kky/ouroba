import RecipesView from "@/views/reciepe";
import type { Metadata } from "next";
import {
  getDashboardRecipe,
  getDashboardRecipes,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { resolveMediaTree } from "@/utils/media";
import { firstText, staticPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type NamedItem = {
  id?: string | null;
  nameAr?: string | null;
  nameEn?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  number?: number | null;
  isHidden?: boolean | null;
  hidden?: number | null;
  [key: string]: unknown;
};

type RecipeCategory = NamedItem & {
  foods?: Array<{ food?: RecipeFood | null; foodId?: string | null }>;
};

type RecipeFood = NamedItem & {
  image?: string | null;
};

type Recipe = NamedItem & {
  foods?: Array<{ food?: RecipeFood | null; foodId?: string | null }>;
  images?: Array<{ url?: string | null }>;
};

const visible = (item: NamedItem | null | undefined) => !item?.isHidden && item?.hidden !== 1;

const numberValue = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 9999;

const localizedName = (item: NamedItem, locale: string) =>
  locale === "ar"
    ? item?.nameAr || item?.name_ar || ""
    : item?.nameEn || item?.name_en || "";

const byNumberThenName = (locale: string) => (a: NamedItem, b: NamedItem) => {
  const numberDiff = numberValue(a?.number) - numberValue(b?.number);
  if (numberDiff !== 0) return numberDiff;
  return localizedName(a, locale).localeCompare(localizedName(b, locale), locale);
};

const withLegacyNames = <T extends NamedItem>(item: T) => ({
  ...item,
  name_ar: item.nameAr || item.name_ar,
  name_en: item.nameEn || item.name_en,
});

const uniqueById = <T extends NamedItem>(items: T[]) => {
  const map = new Map<string, T>();
  items.forEach((item) => {
    if (item?.id && !map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
};

const recipeHasFood = (recipe: Recipe, foodId: string) =>
  (Array.isArray(recipe?.foods) ? recipe.foods : []).some(
    (relation) => relation?.foodId === foodId || relation?.food?.id === foodId
  );

const hasRecipeFoods = (recipe: Recipe) => Array.isArray(recipe?.foods);

async function recipesWithFoods() {
  const recipes = (await getDashboardRecipes(100)) as Recipe[];

  if (recipes.every(hasRecipeFoods)) {
    return recipes;
  }

  const detailedRecipes = await Promise.all(
    recipes.map(async (recipe) => {
      if (hasRecipeFoods(recipe) || !recipe?.id) return recipe;
      return ((await getDashboardRecipe(recipe.id)) as Recipe | null) || recipe;
    })
  );

  return detailedRecipes;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  try {
    const recipes = (await getDashboardRecipes(12)) as Recipe[];
    const firstRecipe = recipes.find((recipe) => visible(recipe));

    return staticPageMetadata(lang, "recipes", {
      image: firstText(firstRecipe?.images?.[0]?.url),
    });
  } catch {
    return staticPageMetadata(lang, "recipes");
  }
}

export default async function RecipesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ c?: string; s_c?: string }>;
}) {
  const { lang } = await params;
  const { c, s_c } = await searchParams;
  const locale = lang === "en" ? "en" : "ar";

  const [siteData, allRecipes] = await Promise.all([
    getDashboardSiteData(locale),
    recipesWithFoods(),
  ]);

  const visibleCategories = ((siteData.recipeCategories || []) as RecipeCategory[])
    .filter(visible)
    .slice()
    .sort(byNumberThenName(locale))
    .map(withLegacyNames);

  const selectedCategory =
    visibleCategories.find((category) => category.id === c) || visibleCategories[0] || null;
  const selectedCategoryId = selectedCategory?.id || null;

  const categoryFoodsList = selectedCategory
    ? uniqueById(
        (Array.isArray(selectedCategory.foods) ? selectedCategory.foods : [])
          .flatMap((relation) => (relation?.food && visible(relation.food) ? [relation.food] : []))
          .sort(byNumberThenName(locale))
      ).map(withLegacyNames)
    : [];

  const selectedFoodId =
    categoryFoodsList.find((food) => food.id === s_c)?.id ||
    categoryFoodsList[0]?.id ||
    null;

  const foodRecipesList = selectedFoodId
    ? uniqueById(
        allRecipes
          .filter((recipe) => visible(recipe) && recipeHasFood(recipe, selectedFoodId))
          .sort(byNumberThenName(locale))
      ).map(withLegacyNames)
    : [];

  const recipesPageData = {
    data: visibleCategories,
    recs: categoryFoodsList,
    cooks: foodRecipesList,
    selectedCategoryId,
    selectedFoodId,
  };

  return <RecipesView recipesPageData={resolveMediaTree(recipesPageData)} />;
}
