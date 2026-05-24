const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.recipe.findMany({ select: { id: true, nameAr: true, internalImage: true }});
  console.log(all.slice(0, 5));
  await prisma.$disconnect();
}
main();
