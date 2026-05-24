import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Let's find out what's in the DB for Molokhia (Recipe 49 or what is it really?)
  const recipes = await prisma.recipe.findMany({
    where: { nameAr: { contains: 'ملوخية' } }
  });
  console.log(JSON.stringify(recipes, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
