import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany();
  console.log(recipes.map(r => ({id: r.id, name: r.nameEn, img: r.internalImage})));
}

main().finally(() => prisma.$disconnect());
