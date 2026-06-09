import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SqlRow = Record<string, string | null>;

type SeedStats = {
  created: number;
  updated: number;
  skipped: number;
};

const stats: Record<string, SeedStats> = {
  recipeCategories: { created: 0, updated: 0, skipped: 0 },
  foods: { created: 0, updated: 0, skipped: 0 },
  recipeCategoryFoods: { created: 0, updated: 0, skipped: 0 },
  recipes: { created: 0, updated: 0, skipped: 0 },
  recipeFoods: { created: 0, updated: 0, skipped: 0 },
  recipeImages: { created: 0, updated: 0, skipped: 0 },
  recipeProperties: { created: 0, updated: 0, skipped: 0 },
  recipeSteps: { created: 0, updated: 0, skipped: 0 },
  recommendedRecipes: { created: 0, updated: 0, skipped: 0 },
};

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const overwrite = args.has("--overwrite");
const fillRelated = args.has("--fill-related") || overwrite;
const includePlaceholders = args.has("--include-placeholders");
const rootDir = path.resolve(__dirname, "../..");
const sqlPath = path.join(rootDir, "campcod3_eloroba.sql");

function cleanId(value: string | null | undefined) {
  return String(value ?? "").trim();
}

function cleanText(value: string | null | undefined) {
  const text = value ?? "";
  return text === "NULL" ? "" : text;
}

function nullableText(value: string | null | undefined) {
  const text = cleanText(value).trim();
  return text.length ? text : null;
}

function plainText(value: string | null | undefined) {
  return cleanText(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isPlaceholderDescription(value: string | null | undefined) {
  const text = plainText(value).toLowerCase();
  return !text || text === "instructions" || text === "طريقة التحضير";
}

function parseBool(value: string | null | undefined) {
  return cleanText(value) === "1";
}

function parseNumber(value: string | null | undefined, fallback = 999) {
  const parsed = Number.parseInt(cleanText(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isPlaceholderRecipe(row: SqlRow) {
  const nameEn = cleanText(row.name_en).trim();
  const nameAr = cleanText(row.name_ar).trim();
  return !nameEn || nameEn === "." || nameAr === ".";
}

function recordExistingOrCreated(stat: SeedStats, exists: boolean) {
  if (exists) {
    stat.updated++;
  } else {
    stat.created++;
  }
}

function recordSkippedOrCreated(stat: SeedStats, exists: boolean) {
  if (exists) {
    stat.skipped++;
  } else {
    stat.created++;
  }
}

function getRecipeDataToFill(
  existing: Awaited<ReturnType<typeof prisma.recipe.findUnique>>,
  data: {
    descriptionAr: string;
    descriptionEn: string;
  },
) {
  if (!existing || overwrite) return {};

  const fillData: Partial<typeof data> = {};

  if (
    isPlaceholderDescription(existing.descriptionAr) &&
    !isPlaceholderDescription(data.descriptionAr)
  ) {
    fillData.descriptionAr = data.descriptionAr;
  }

  if (
    isPlaceholderDescription(existing.descriptionEn) &&
    !isPlaceholderDescription(data.descriptionEn)
  ) {
    fillData.descriptionEn = data.descriptionEn;
  }

  return fillData;
}

function parseSqlInserts(sqlContent: string, tableName: string): SqlRow[] {
  const pattern = `INSERT INTO \`${tableName}\` \\((.*?)\\) VALUES([\\s\\S]*?);\\r?\\n`;
  const regex = new RegExp(pattern, "g");
  const results: SqlRow[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sqlContent)) !== null) {
    const columns = match[1].split(",").map((column) => column.trim().replace(/`/g, ""));
    const valuesStr = match[2];
    let inString = false;
    let escape = false;
    let currentTuple: string[] = [];
    let currentValue = "";

    for (let i = 0; i < valuesStr.length; i++) {
      const char = valuesStr[i];

      if (escape) {
        currentValue += char;
        escape = false;
        continue;
      }

      if (char === "\\") {
        currentValue += char;
        escape = true;
        continue;
      }

      if (char === "'") {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "(" && currentValue.trim() === "") {
          currentTuple = [];
          currentValue = "";
          continue;
        }

        if (char === "," || char === ")") {
          currentTuple.push(currentValue.trim());
          currentValue = "";

          if (char === ")") {
            const obj: SqlRow = {};
            columns.forEach((column, idx) => {
              const value = currentTuple[idx];
              obj[column] = value === "NULL" ? null : value;
            });
            results.push(obj);
            currentTuple = [];

            while (
              i + 1 < valuesStr.length &&
              [",", " ", "\n", "\r"].includes(valuesStr[i + 1])
            ) {
              i++;
            }
          }

          continue;
        }
      }

      currentValue += char;
    }
  }

  return results;
}

function printStats() {
  console.log(apply ? "Applied recipe-only seed:" : "Recipe-only seed dry run:");
  console.log(
    `Mode: ${overwrite ? "overwrite existing records" : "preserve existing records"}, ${fillRelated ? "fill unmatched related records" : "do not add unmatched related records when a recipe already has them"}`,
  );
  for (const [label, value] of Object.entries(stats)) {
    console.log(
      `${label}: create ${value.created}, update ${value.updated}, skip ${value.skipped}`,
    );
  }
}

async function findRecipeByLegacyRow(row: SqlRow) {
  const id = cleanId(row.id);
  const byId = await prisma.recipe.findUnique({ where: { id } });
  if (byId) return byId;

  const nameEn = cleanText(row.name_en).trim();
  if (!nameEn) return null;

  return prisma.recipe.findFirst({
    where: { nameEn: { equals: nameEn, mode: "insensitive" } },
  });
}

async function findFoodByLegacyRow(row: SqlRow, recipeCategoryId: string | null) {
  const id = cleanId(row.id);
  const byId = await prisma.food.findUnique({ where: { id } });
  if (byId) return byId;

  const nameEn = cleanText(row.name_en).trim();
  if (!nameEn) return null;

  const scoped = recipeCategoryId
    ? await prisma.food.findFirst({
        where: {
          nameEn: { equals: nameEn, mode: "insensitive" },
          recipeCategories: { some: { recipeCategoryId } },
        },
      })
    : null;

  if (scoped) return scoped;

  return prisma.food.findFirst({
    where: { nameEn: { equals: nameEn, mode: "insensitive" } },
  });
}

async function seedRecipeCategories(rows: SqlRow[]) {
  const categoryIdMap = new Map<string, string>();

  for (const row of rows) {
    const sourceId = cleanId(row.id);
    if (!sourceId) {
      stats.recipeCategories.skipped++;
      continue;
    }

    const data = {
      nameAr: cleanText(row.name_ar),
      nameEn: cleanText(row.name_en) || cleanText(row.name_ar),
      image: nullableText(row.image),
      number: parseNumber(row.number),
      isHidden: parseBool(row.hidden),
    };

    const existing = await prisma.recipeCategory.findUnique({ where: { id: sourceId } });
    categoryIdMap.set(sourceId, existing?.id ?? sourceId);

    if (existing && !overwrite) {
      stats.recipeCategories.skipped++;
      continue;
    }

    if (!apply) {
      recordExistingOrCreated(stats.recipeCategories, Boolean(existing));
      continue;
    }

    await prisma.recipeCategory.upsert({
      where: { id: sourceId },
      update: data,
      create: { id: sourceId, ...data },
    });
    recordExistingOrCreated(stats.recipeCategories, Boolean(existing));
  }

  return categoryIdMap;
}

async function seedFoods(rows: SqlRow[], categoryIdMap: Map<string, string>) {
  const foodIdMap = new Map<string, string>();

  for (const row of rows) {
    const sourceId = cleanId(row.id);
    if (!sourceId) {
      stats.foods.skipped++;
      continue;
    }

    const sourceCategoryId = cleanId(row.recipe_id);
    const recipeCategoryId = categoryIdMap.get(sourceCategoryId) ?? null;
    const existing = await findFoodByLegacyRow(row, recipeCategoryId);
    const targetId = existing?.id ?? sourceId;
    foodIdMap.set(sourceId, targetId);

    const data = {
      nameAr: cleanText(row.name_ar),
      nameEn: cleanText(row.name_en) || cleanText(row.name_ar),
      image: nullableText(row.image),
      number: parseNumber(row.number),
      isHidden: parseBool(row.hidden),
    };

    if (existing && !overwrite) {
      stats.foods.skipped++;
    } else if (!apply) {
      recordExistingOrCreated(stats.foods, Boolean(existing));
    } else if (existing) {
      await prisma.food.update({ where: { id: existing.id }, data });
      stats.foods.updated++;
    } else {
      await prisma.food.create({ data: { id: sourceId, ...data } });
      stats.foods.created++;
    }

    if (!recipeCategoryId) {
      stats.recipeCategoryFoods.skipped++;
      continue;
    }

    const existingLink = await prisma.recipeCategoryFood.findUnique({
      where: { recipeCategoryId_foodId: { recipeCategoryId, foodId: targetId } },
    });

    if (!apply) {
      recordSkippedOrCreated(stats.recipeCategoryFoods, Boolean(existingLink));
      continue;
    }

    if (existingLink) {
      stats.recipeCategoryFoods.skipped++;
    } else {
      await prisma.recipeCategoryFood.create({ data: { recipeCategoryId, foodId: targetId } });
      stats.recipeCategoryFoods.created++;
    }
  }

  return foodIdMap;
}

async function seedRecipes(rows: SqlRow[]) {
  const recipeIdMap = new Map<string, string>();

  for (const row of rows) {
    const sourceId = cleanId(row.id);
    if (!sourceId || (!includePlaceholders && isPlaceholderRecipe(row))) {
      stats.recipes.skipped++;
      continue;
    }

    const existing = await findRecipeByLegacyRow(row);
    const targetId = existing?.id ?? sourceId;
    recipeIdMap.set(sourceId, targetId);

    const data = {
      nameAr: cleanText(row.name_ar),
      nameEn: cleanText(row.name_en) || cleanText(row.name_ar),
      descriptionAr: cleanText(row.description_ar),
      descriptionEn: cleanText(row.description_en),
      videoLink: nullableText(row.video_link),
      internalImage: nullableText(row.internal_image),
      number: parseNumber(row.number),
      isHidden: parseBool(row.hidden),
    };

    if (existing && !overwrite) {
      const fillData = getRecipeDataToFill(existing, data);
      const hasFillData = Object.keys(fillData).length > 0;

      if (!hasFillData) {
        stats.recipes.skipped++;
        continue;
      }

      if (!apply) {
        stats.recipes.updated++;
        continue;
      }

      await prisma.recipe.update({ where: { id: existing.id }, data: fillData });
      stats.recipes.updated++;
    } else if (!apply) {
      recordExistingOrCreated(stats.recipes, Boolean(existing));
    } else if (existing) {
      await prisma.recipe.update({ where: { id: existing.id }, data });
      stats.recipes.updated++;
    } else {
      await prisma.recipe.create({ data: { id: sourceId, ...data } });
      stats.recipes.created++;
    }
  }

  return recipeIdMap;
}

async function seedRecipeFoods(
  rows: SqlRow[],
  recipeIdMap: Map<string, string>,
  foodIdMap: Map<string, string>,
) {
  for (const row of rows) {
    const recipeId = recipeIdMap.get(cleanId(row.cook_id));
    const foodId = foodIdMap.get(cleanId(row.food_id));

    if (!recipeId || !foodId) {
      stats.recipeFoods.skipped++;
      continue;
    }

    const existing = await prisma.recipeFood.findUnique({
      where: { recipeId_foodId: { recipeId, foodId } },
    });

    if (!apply) {
      recordSkippedOrCreated(stats.recipeFoods, Boolean(existing));
      continue;
    }

    if (existing) {
      stats.recipeFoods.skipped++;
    } else {
      await prisma.recipeFood.create({ data: { recipeId, foodId } });
      stats.recipeFoods.created++;
    }
  }
}

async function seedRecipeImages(rows: SqlRow[], recipeIdMap: Map<string, string>) {
  for (const row of rows) {
    const recipeId = recipeIdMap.get(cleanId(row.cook_id));
    const url = cleanText(row.url).trim();

    if (!recipeId || !url) {
      stats.recipeImages.skipped++;
      continue;
    }

    const existingById = await prisma.recipeImage.findUnique({ where: { id: cleanId(row.id) } });
    const existingByContent =
      existingById ??
      (await prisma.recipeImage.findFirst({
        where: { recipeId, url },
      }));
    const hasAnyForRecipe = existingByContent
      ? true
      : (await prisma.recipeImage.count({ where: { recipeId } })) > 0;

    if (existingByContent && !overwrite) {
      stats.recipeImages.skipped++;
    } else if (!existingByContent && hasAnyForRecipe && !fillRelated) {
      stats.recipeImages.skipped++;
    } else if (!apply) {
      recordExistingOrCreated(stats.recipeImages, Boolean(existingByContent));
    } else if (existingByContent) {
      await prisma.recipeImage.update({
        where: { id: existingByContent.id },
        data: { recipeId, url },
      });
      stats.recipeImages.updated++;
    } else {
      await prisma.recipeImage.create({ data: { id: cleanId(row.id), recipeId, url } });
      stats.recipeImages.created++;
    }
  }
}

async function seedRecipeProperties(rows: SqlRow[], recipeIdMap: Map<string, string>) {
  for (const row of rows) {
    const recipeId = recipeIdMap.get(cleanId(row.cook_id));
    if (!recipeId) {
      stats.recipeProperties.skipped++;
      continue;
    }

    const data = {
      recipeId,
      icon: nullableText(row.icon),
      titleAr: cleanText(row.title_ar),
      titleEn: cleanText(row.title_en) || cleanText(row.title_ar),
      textAr: cleanText(row.text_ar),
      textEn: cleanText(row.text_en) || cleanText(row.text_ar),
    };

    const existingById = await prisma.recipeProperty.findUnique({
      where: { id: cleanId(row.id) },
    });
    const existingByContent =
      existingById ??
      (await prisma.recipeProperty.findFirst({
        where: {
          recipeId,
          titleEn: data.titleEn,
          titleAr: data.titleAr,
          textEn: data.textEn,
          textAr: data.textAr,
        },
      }));
    const hasAnyForRecipe = existingByContent
      ? true
      : (await prisma.recipeProperty.count({ where: { recipeId } })) > 0;

    if (existingByContent && !overwrite) {
      stats.recipeProperties.skipped++;
    } else if (!existingByContent && hasAnyForRecipe && !fillRelated) {
      stats.recipeProperties.skipped++;
    } else if (!apply) {
      recordExistingOrCreated(stats.recipeProperties, Boolean(existingByContent));
    } else if (existingByContent) {
      await prisma.recipeProperty.update({
        where: { id: existingByContent.id },
        data,
      });
      stats.recipeProperties.updated++;
    } else {
      await prisma.recipeProperty.create({ data: { id: cleanId(row.id), ...data } });
      stats.recipeProperties.created++;
    }
  }
}

async function seedRecipeSteps(rows: SqlRow[], recipeIdMap: Map<string, string>) {
  for (const row of rows) {
    const recipeId = recipeIdMap.get(cleanId(row.cook_id));
    if (!recipeId) {
      stats.recipeSteps.skipped++;
      continue;
    }

    const stepAr = cleanText(row.step_ar);
    const stepEn = cleanText(row.step_en) || stepAr;
    if (!stepAr && !stepEn) {
      stats.recipeSteps.skipped++;
      continue;
    }

    const existingById = await prisma.recipeStep.findUnique({ where: { id: cleanId(row.id) } });
    const existingByContent =
      existingById ??
      (await prisma.recipeStep.findFirst({
        where: { recipeId, stepAr, stepEn },
      }));
    const hasAnyForRecipe = existingByContent
      ? true
      : (await prisma.recipeStep.count({ where: { recipeId } })) > 0;

    if (existingByContent && !overwrite) {
      stats.recipeSteps.skipped++;
    } else if (!existingByContent && hasAnyForRecipe && !fillRelated) {
      stats.recipeSteps.skipped++;
    } else if (!apply) {
      recordExistingOrCreated(stats.recipeSteps, Boolean(existingByContent));
    } else if (existingByContent) {
      await prisma.recipeStep.update({
        where: { id: existingByContent.id },
        data: { recipeId, stepAr, stepEn },
      });
      stats.recipeSteps.updated++;
    } else {
      await prisma.recipeStep.create({ data: { id: cleanId(row.id), recipeId, stepAr, stepEn } });
      stats.recipeSteps.created++;
    }
  }
}

async function seedRecommendedRecipes(rows: SqlRow[], recipeIdMap: Map<string, string>) {
  for (const row of rows) {
    const productId = cleanId(row.product_id);
    const recipeId = recipeIdMap.get(cleanId(row.cook_id));

    if (!productId || !recipeId) {
      stats.recommendedRecipes.skipped++;
      continue;
    }

    const productExists = await prisma.product.findUnique({ where: { id: productId } });
    if (!productExists) {
      stats.recommendedRecipes.skipped++;
      continue;
    }

    const existing = await prisma.recommendedRecipe.findUnique({
      where: { productId_recipeId: { productId, recipeId } },
    });

    if (!apply) {
      recordSkippedOrCreated(stats.recommendedRecipes, Boolean(existing));
      continue;
    }

    if (existing) {
      stats.recommendedRecipes.skipped++;
    } else {
      await prisma.recommendedRecipe.create({ data: { productId, recipeId } });
      stats.recommendedRecipes.created++;
    }
  }
}

async function main() {
  if (!fs.existsSync(sqlPath)) {
    throw new Error(`SQL dump not found: ${sqlPath}`);
  }

  const sqlContent = fs.readFileSync(sqlPath, "utf8");
  const recipeCategories = parseSqlInserts(sqlContent, "recipes");
  const foods = parseSqlInserts(sqlContent, "food");
  const recipes = parseSqlInserts(sqlContent, "cooks");
  const recipeFoods = parseSqlInserts(sqlContent, "food_cooks");
  const recipeImages = parseSqlInserts(sqlContent, "cook_images");
  const recipeProperties = parseSqlInserts(sqlContent, "cook_props");
  const recipeSteps = parseSqlInserts(sqlContent, "food_steps");
  const recommendedRecipes = parseSqlInserts(sqlContent, "recommend_recipes");

  console.log(
    `Source rows: ${recipeCategories.length} categories, ${foods.length} foods, ${recipes.length} recipes, ${recipeFoods.length} recipe-food links, ${recipeImages.length} images, ${recipeProperties.length} properties, ${recipeSteps.length} steps, ${recommendedRecipes.length} recommended links.`,
  );

  const categoryIdMap = await seedRecipeCategories(recipeCategories);
  const foodIdMap = await seedFoods(foods, categoryIdMap);
  const recipeIdMap = await seedRecipes(recipes);

  await seedRecipeFoods(recipeFoods, recipeIdMap, foodIdMap);
  await seedRecipeImages(recipeImages, recipeIdMap);
  await seedRecipeProperties(recipeProperties, recipeIdMap);
  await seedRecipeSteps(recipeSteps, recipeIdMap);
  await seedRecommendedRecipes(recommendedRecipes, recipeIdMap);

  printStats();

  if (!apply) {
    console.log("No changes were written. Run with --apply to seed.");
    console.log("Optional flags: --overwrite, --fill-related, --include-placeholders.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
