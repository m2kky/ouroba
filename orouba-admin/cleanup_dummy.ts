import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanUp() {
  await prisma.recipe.deleteMany({
    where: {
      nameEn: {
        in: ['# Orouba Recipes / وصفات العروبة', '.']
      }
    }
  });
  console.log('Cleaned up dummy recipes.');
}

cleanUp()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
