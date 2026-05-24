import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({
    select: { id: true, nameAr: true, descriptionAr: true, foods: { include: { food: true } } }
  });
  
  let emptyDesc = 0;
  for (const r of recipes) {
    if (!r.descriptionAr || r.descriptionAr.trim() === '') {
      emptyDesc++;
    }
  }
  
  console.log(`Recipes with empty descriptionAr: ${emptyDesc}`);
  console.log(`Total recipes: ${recipes.length}`);
  
  // Show a couple of recipes with description
  const withDesc = recipes.filter(r => r.descriptionAr);
  console.log('Sample descriptionAr:');
  if (withDesc.length > 0) {
     console.log(withDesc[0].nameAr);
     console.log(withDesc[0].descriptionAr);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
