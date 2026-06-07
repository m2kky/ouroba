import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deduplicateRecipeCategories() {
  const categories = await prisma.recipeCategory.findMany();
  const grouped = new Map<string, typeof categories[0][]>();

  for (const cat of categories) {
    const key = cat.nameEn.toLowerCase().trim();
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(cat);
  }

  for (const [key, cats] of grouped.entries()) {
    if (cats.length > 1) {
      // Sort by id to keep the oldest
      cats.sort((a, b) => a.id.localeCompare(b.id));
      const kept = cats[0];
      const duplicates = cats.slice(1);

      console.log(`Deduplicating Category: ${key}. Keeping ${kept.id}`);

      for (const dup of duplicates) {
        const rcFoods = await prisma.recipeCategoryFood.findMany({
          where: { recipeCategoryId: dup.id }
        });

        for (const rcf of rcFoods) {
          // Check if already exists for kept category
          const exists = await prisma.recipeCategoryFood.findUnique({
            where: {
              recipeCategoryId_foodId: {
                recipeCategoryId: kept.id,
                foodId: rcf.foodId
              }
            }
          });

          if (!exists) {
            await prisma.recipeCategoryFood.update({
              where: { id: rcf.id },
              data: { recipeCategoryId: kept.id }
            });
          } else {
            await prisma.recipeCategoryFood.delete({
              where: { id: rcf.id }
            });
          }
        }
        await prisma.recipeCategory.delete({ where: { id: dup.id } });
        console.log(`Deleted duplicate category ${dup.id}`);
      }
    }
  }
}

async function deduplicateRecipes() {
  const recipes = await prisma.recipe.findMany();
  const grouped = new Map<string, typeof recipes[0][]>();

  for (const rec of recipes) {
    if (!rec.nameEn) continue;
    const key = rec.nameEn.toLowerCase().trim();
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(rec);
  }

  for (const [key, recs] of grouped.entries()) {
    if (recs.length > 1) {
      // Keep the oldest by id
      recs.sort((a, b) => a.id.localeCompare(b.id));
      const kept = recs[0];
      const duplicates = recs.slice(1);

      console.log(`Deduplicating Recipe: ${key}. Keeping ${kept.id}`);

      for (const dup of duplicates) {
        // RecipeFood
        const rFoods = await prisma.recipeFood.findMany({ where: { recipeId: dup.id } });
        for (const rf of rFoods) {
          const exists = await prisma.recipeFood.findUnique({
            where: { recipeId_foodId: { recipeId: kept.id, foodId: rf.foodId } }
          });
          if (!exists) {
            await prisma.recipeFood.update({ where: { id: rf.id }, data: { recipeId: kept.id } });
          } else {
            await prisma.recipeFood.delete({ where: { id: rf.id } });
          }
        }

        // RecipeImage
        await prisma.recipeImage.updateMany({ where: { recipeId: dup.id }, data: { recipeId: kept.id } });
        
        // RecipeProperty
        await prisma.recipeProperty.updateMany({ where: { recipeId: dup.id }, data: { recipeId: kept.id } });

        // RecipeStep
        await prisma.recipeStep.updateMany({ where: { recipeId: dup.id }, data: { recipeId: kept.id } });

        // RecommendedRecipe (as recipe)
        const asRec = await prisma.recommendedRecipe.findMany({ where: { recipeId: dup.id } });
        for (const rr of asRec) {
          const exists = await prisma.recommendedRecipe.findUnique({
            where: { productId_recipeId: { productId: rr.productId, recipeId: kept.id } }
          });
          if (!exists) {
            await prisma.recommendedRecipe.update({ where: { id: rr.id }, data: { recipeId: kept.id } });
          } else {
            await prisma.recommendedRecipe.delete({ where: { id: rr.id } });
          }
        }

        await prisma.recipe.delete({ where: { id: dup.id } });
        console.log(`Deleted duplicate recipe ${dup.id}`);
      }
    }
  }
}

async function main() {
  await deduplicateRecipeCategories();
  await deduplicateRecipes();
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
