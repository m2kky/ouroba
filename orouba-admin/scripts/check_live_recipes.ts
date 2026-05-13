import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany();
  console.log("Total recipes:", recipes.length);
  const visible = recipes.filter(r => !r.isHidden);
  console.log("Visible recipes:", visible.length);
  console.log("First visible recipe:", visible[0]);
}

main().finally(() => prisma.$disconnect());
