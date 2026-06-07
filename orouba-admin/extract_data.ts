import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({
    include: {
      steps: true,
      foods: {
        include: {
          food: true
        }
      }
    }
  });

  const output = recipes.map(recipe => {
    return {
      id: recipe.id,
      nameAr: recipe.nameAr || '',
      nameEn: recipe.nameEn || '',
      descriptionAr: recipe.descriptionAr || '',
      descriptionEn: recipe.descriptionEn || '',
      ingredients: recipe.foods.map(f => ({
        nameAr: f.food.nameAr || '',
        nameEn: f.food.nameEn || '',
      })),
      steps: recipe.steps.map(s => ({
        stepAr: s.stepAr || '',
        stepEn: s.stepEn || '',
      }))
    };
  });

  fs.writeFileSync('extracted_recipes.json', JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Extracted ${output.length} recipes successfully.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
