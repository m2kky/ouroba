import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipe = await prisma.recipe.findFirst({
    where: { nameEn: "Molokhia Taklia" },
    include: { foods: { include: { food: true } } }
  });
  console.dir(recipe?.foods, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
