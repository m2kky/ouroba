export const RECIPE_PROPERTY_TEMPLATES = [
  {
    key: "prep_time",
    titleAr: "وقت التحضير",
    titleEn: "Prep Time",
    aliases: ["prep_time", "prep time", "preparation time", "وقت التحضير"],
  },
  {
    key: "cooking_time",
    titleAr: "وقت الطبخ",
    titleEn: "Cooking Time",
    aliases: ["cooking_time", "cooking time", "cook time", "وقت الطبخ"],
  },
  {
    key: "servings",
    titleAr: "عدد الأفراد",
    titleEn: "Servings",
    aliases: ["servings", "serving", "عدد الأفراد", "عدد الافراد", "خدمة"],
  },
  {
    key: "level",
    titleAr: "المستوى",
    titleEn: "Level",
    aliases: ["level", "difficulty", "المستوى"],
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
      icon: template.key,
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
