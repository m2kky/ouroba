const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.product.findFirst({ include: { recommendedRecipes: true, images: true } })
  .then(p => console.log(JSON.stringify(p, null, 2)))
  .finally(() => prisma.$disconnect());
