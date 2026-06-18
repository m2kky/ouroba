import RecipeDetailsView from "@/views/RecipeDetails/RecipeDetails";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardBaseUrl,
  getDashboardRecipe,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const revalidate = 300;

const first = (...values: Array<string | null | undefined>) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

type LocalizedFields = {
  nameAr?: string | null;
  name_ar?: string | null;
  nameEn?: string | null;
  name_en?: string | null;
};

type RecipeStep = {
  stepAr?: string | null;
  step_ar?: string | null;
  stepEn?: string | null;
  step_en?: string | null;
  [key: string]: unknown;
};

type RecipeProperty = {
  icon?: string | null;
  titleAr?: string | null;
  title_ar?: string | null;
  titleEn?: string | null;
  title_en?: string | null;
  textAr?: string | null;
  text_ar?: string | null;
  textEn?: string | null;
  text_en?: string | null;
  [key: string]: unknown;
};

type RecipeCategory = LocalizedFields & {
  id?: string;
};

type RecipeFood = LocalizedFields & {
  id?: string;
  recipeCategories?: Array<{ recipeCategory?: RecipeCategory | null }>;
};

const normalizeStep = (step: RecipeStep) => ({
  ...step,
  step_ar: first(step?.stepAr, step?.step_ar),
  step_en: first(step?.stepEn, step?.step_en),
});

const PROPERTY_ICON_SETTINGS: Record<string, string> = {
  level: "recipe_property_level_image",
  prep_time: "recipe_property_prep_time_image",
  cooking_time: "recipe_property_cooking_time_image",
  servings: "recipe_property_servings_image",
};

const FIXED_PROPERTY_ICONS: Record<string, string> = {
  prep_time: "/خصائص الوصفة/Prep Time.png",
  cooking_time: "/خصائص الوصفة/Cooking Time.png",
  servings: "/خصائص الوصفة/Serving.png",
  level: "/خصائص الوصفة/Level.png",
};

const PROPERTY_ALIASES: Record<string, string[]> = {
  level: ["level", "difficulty", "المستوى", "مستوى", "المستوي", "/خصائص الوصفة/level.png"],
  prep_time: [
    "prep_time",
    "prep time",
    "preparation time",
    "وقت التحضير",
    "وقت الاعداد",
    "وقت الإعداد",
    "/خصائص الوصفة/prep time.png",
  ],
  cooking_time: [
    "cooking_time",
    "cooking time",
    "cook time",
    "وقت الطبخ",
    "/خصائص الوصفة/cooking time.png",
  ],
  servings: [
    "servings",
    "serving",
    "عدد الأفراد",
    "عدد الافراد",
    "التقديم",
    "خدمة",
    "/خصائص الوصفة/serving.png",
  ],
};

const normalize = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const propertyKey = (property: RecipeProperty) => {
  const values = [
    property?.icon,
    property?.titleAr,
    property?.title_ar,
    property?.titleEn,
    property?.title_en,
  ].map(normalize);

  return (
    Object.entries(PROPERTY_ALIASES).find(([, aliases]) =>
      values.some((value) => value && aliases.includes(value))
    )?.[0] || ""
  );
};

const isImageUrl = (value: unknown) =>
  typeof value === "string" && /^(https?:|\/|data:image)/i.test(value.trim());

const dashboardAssetUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed || /^(https?:|data:image)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) {
    return new URL(trimmed, `${getDashboardBaseUrl()}/`).toString();
  }
  return trimmed;
};

const recipePropertyIcon = (property: RecipeProperty, siteInfo: Record<string, string>) => {
  const key = propertyKey(property);
  const settingKey = key ? PROPERTY_ICON_SETTINGS[key] : "";
  const globalIcon = settingKey
    ? first(siteInfo[settingKey], siteInfo[`${settingKey}Ar`], siteInfo[`${settingKey}En`])
    : "";
  const fixedIcon = key ? FIXED_PROPERTY_ICONS[key] : "";
  const propertyIcon = isImageUrl(property?.icon) ? String(property.icon) : "";

  return first(
    propertyIcon ? dashboardAssetUrl(propertyIcon) : "",
    fixedIcon ? dashboardAssetUrl(fixedIcon) : "",
    globalIcon ? dashboardAssetUrl(globalIcon) : ""
  );
};

const normalizeProperty = (property: RecipeProperty, siteInfo: Record<string, string>) => ({
  ...property,
  icon: recipePropertyIcon(property, siteInfo),
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
  const { lang, id } = await params;
  const [recipeDetails, siteData] = await Promise.all([
    getDashboardRecipe(id),
    getDashboardSiteData(lang),
  ]);

  if (!recipeDetails || recipeDetails.isHidden) {
    notFound();
  }

  const firstFoodRelation = recipeDetails.foods?.[0];
  const food = firstFoodRelation?.food as RecipeFood | undefined;
  const category = food?.recipeCategories?.[0]?.recipeCategory;

  const breads = {
    recName: first(category?.nameEn, category?.name_en),
    recNameAr: first(category?.nameAr, category?.name_ar),
    recId: category?.id || "",
    foodName: first(food?.nameEn, food?.name_en),
    foodNameAr: first(food?.nameAr, food?.name_ar),
    foodId: food?.id || "",
  };

  const steps = (recipeDetails.steps || []).map((step: RecipeStep) => normalizeStep(step));
  const siteInfo = dashboardSettingsToSiteinfo(siteData.settings, lang);
  const properties = (recipeDetails.properties || []).map((property: RecipeProperty) =>
    normalizeProperty(property, siteInfo)
  );

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
