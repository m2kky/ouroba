const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log('TOTAL_PRODUCTS_IN_DB: ' + count);
  
  // also let's check legacy DB if there is a dump somewhere
}

main().finally(() => prisma.$disconnect());
