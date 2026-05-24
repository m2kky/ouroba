import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(await prisma.recipe.findUnique({where:{id:'60'}}).then(r=>r?.descriptionAr));
}

main().catch(console.error).finally(() => prisma.$disconnect());
