import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.categoryType.deleteMany({
    where: { titleEn: 'By Cooking Method' }
  });
  console.log("Deleted 'By Cooking Method' successfully!");
}

main().finally(() => prisma.$disconnect());
