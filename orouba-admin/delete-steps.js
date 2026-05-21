const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.productionStep.deleteMany({
    where: {
      id: { in: ["3", "4"] }
    }
  });
  console.log("Deleted records with id 3 and 4.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
