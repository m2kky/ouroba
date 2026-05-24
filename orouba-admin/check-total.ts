import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allRecipes = await prisma.recipe.findMany({ select: { id: true, nameAr: true, descriptionAr: true }});
  console.log(`Total recipes in DB: ${allRecipes.length}`);
  
  let empty = 0;
  for (const r of allRecipes) {
    if (!r.descriptionAr || r.descriptionAr.trim() === '') {
      empty++;
    }
  }
  console.log(`Total recipes with empty descriptionAr: ${empty}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
