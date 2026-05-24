import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRecipeImages() {
  const recipes = await prisma.recipe.findMany({
    include: { images: true }
  });

  let updated = 0;

  for (const recipe of recipes) {
    if (recipe.internalImage && recipe.internalImage.includes('r2.dev') && recipe.images.length === 0) {
      await prisma.recipeImage.create({
        data: {
          url: recipe.internalImage,
          recipeId: recipe.id
        }
      });
      updated++;
      console.log(`Added RecipeImage for ${recipe.nameEn || recipe.nameAr}`);
    }
  }

  console.log(`Successfully added ${updated} RecipeImage records.`);
}

fixRecipeImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
