export const RECIPE_PROPERTY_TEMPLATES = [
  {
    key: "prep_time",
    titleAr: "وقت التحضير",
    titleEn: "Prep Time",
    icon: "/خصائص الوصفة/Prep Time.png",
    aliases: [
      "prep_time",
      "prep time",
      "preparation time",
      "وقت التحضير",
      "/خصائص الوصفة/prep time.png",
    ],
  },
  {
    key: "cooking_time",
    titleAr: "وقت الطبخ",
    titleEn: "Cooking Time",
    icon: "/خصائص الوصفة/Cooking Time.png",
    aliases: [
      "cooking_time",
      "cooking time",
      "cook time",
      "وقت الطبخ",
      "/خصائص الوصفة/cooking time.png",
    ],
  },
  {
    key: "servings",
    titleAr: "عدد الأفراد",
    titleEn: "Servings",
    icon: "/خصائص الوصفة/Serving.png",
    aliases: [
      "servings",
      "serving",
      "عدد الأفراد",
      "عدد الافراد",
      "خدمة",
      "/خصائص الوصفة/serving.png",
    ],
  },
  {
    key: "level",
    titleAr: "المستوى",
    titleEn: "Level",
    icon: "/خصائص الوصفة/Level.png",
    aliases: ["level", "difficulty", "المستوى", "/خصائص الوصفة/level.png"],
  },
] as const;

type RecipePropertyInput = {
  id?: string;
  icon?: string | null;
  titleAr?: string | null;
  titleEn?: string | null;
  textAr?: string | null;
  textEn?: string | null;
};

const normalize = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const templateForProperty = (property: RecipePropertyInput) => {
  const values = [property.icon, property.titleAr, property.titleEn].map(normalize);

  return RECIPE_PROPERTY_TEMPLATES.find((template) =>
    values.some((value) => value && template.aliases.includes(value))
  );
};

export const normalizeRecipeProperties = (properties: RecipePropertyInput[] = []) =>
  RECIPE_PROPERTY_TEMPLATES.map((template) => {
    const match =
      properties.find((property) => normalize(property.icon) === template.key) ||
      properties.find((property) => templateForProperty(property)?.key === template.key);

    return {
      id: match?.id,
      icon: template.icon,
      titleAr: template.titleAr,
      titleEn: template.titleEn,
      textAr: match?.textAr || "",
      textEn: match?.textEn || "",
    };
  });

export const recipePropertiesForCreate = (properties: RecipePropertyInput[], recipeId: string) =>
  normalizeRecipeProperties(properties).map((property) => ({
    recipeId,
    icon: property.icon,
    titleAr: property.titleAr,
    titleEn: property.titleEn,
    textAr: property.textAr,
    textEn: property.textEn,
  }));

export const recipePropertiesForNestedCreate = (properties: RecipePropertyInput[] = []) =>
  normalizeRecipeProperties(properties).map((property) => ({
    icon: property.icon,
    titleAr: property.titleAr,
    titleEn: property.titleEn,
    textAr: property.textAr,
    textEn: property.textEn,
  }));
