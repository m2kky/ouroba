const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const steps = await prisma.productionStep.findMany({
    orderBy: { number: 'asc' },
    select: { id: true, number: true, isHidden: true, textEn: true }
  });
  console.log(JSON.stringify(steps, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
