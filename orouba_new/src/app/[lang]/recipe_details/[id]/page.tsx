import RecipeDetailsView from "@/views/RecipeDetails/RecipeDetails";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import { getDashboardRecipe } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

const first = (...values: Array<string | null | undefined>) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const normalizeStep = (step: any) => ({
  ...step,
  step_ar: first(step?.stepAr, step?.step_ar),
  step_en: first(step?.stepEn, step?.step_en),
});

const normalizeProperty = (property: any) => ({
  ...property,
  title_ar: first(property?.titleAr, property?.title_ar),
  title_en: first(property?.titleEn, property?.title_en),
  text_ar: first(property?.textAr, property?.text_ar),
  text_en: first(property?.textEn, property?.text_en),
});

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id } = await params;
  const recipeDetails = await getDashboardRecipe(id);

  if (!recipeDetails || recipeDetails.isHidden) {
    notFound();
  }

  const firstFoodRelation = recipeDetails.foods?.[0];
  const food = firstFoodRelation?.food;
  const category = food?.recipeCategories?.[0]?.recipeCategory;

  const breads = {
    recName: first(category?.nameEn, category?.name_en),
    recNameAr: first(category?.nameAr, category?.name_ar),
    recId: category?.id || "",
    foodName: first(food?.nameEn, food?.name_en),
    foodNameAr: first(food?.nameAr, food?.name_ar),
    foodId: food?.id || "",
  };

  const steps = (recipeDetails.steps || []).map(normalizeStep);
  const properties = (recipeDetails.properties || []).map(normalizeProperty);

  const normalizedRecipeDetails = {
    ...recipeDetails,
    name_ar: first(recipeDetails.nameAr, recipeDetails.name_ar),
    name_en: first(recipeDetails.nameEn, recipeDetails.name_en),
    description_ar: first(recipeDetails.descriptionAr, recipeDetails.description_ar),
    description_en: first(recipeDetails.descriptionEn, recipeDetails.description_en),
    internal_image: first(recipeDetails.internalImage, recipeDetails.internal_image),
    video_link: first(recipeDetails.videoLink, recipeDetails.video_link),
    properties,
    step: steps,
    steps,
  };

  return <RecipeDetailsView data={resolveMediaTree(normalizedRecipeDetails)} breads={breads} />;
}
