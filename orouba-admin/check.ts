import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const recipes = await prisma.recipe.findMany({ select: { nameEn: true, descriptionAr: true, descriptionEn: true } });
  const manual = recipes.filter(r => r.descriptionAr && r.descriptionAr.includes('<p>')).map(r => r.nameEn);
  console.log('Manually fixed count:', manual.length);
  console.log('Some manual:', manual.slice(0, 5));
  const all = recipes.length;
  console.log('Total recipes:', all);
}
main().finally(() => prisma.$disconnect());
