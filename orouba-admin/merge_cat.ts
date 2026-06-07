import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function mergeAirfryer() {
  const cat1 = await prisma.recipeCategory.findFirst({ where: { nameEn: 'Airfryer' } });
  const cat2 = await prisma.recipeCategory.findFirst({ where: { nameEn: 'إيرفراير' } });

  if (cat1 && cat2) {
    const rcFoods = await prisma.recipeCategoryFood.findMany({ where: { recipeCategoryId: cat2.id } });
    for (const rcf of rcFoods) {
      const exists = await prisma.recipeCategoryFood.findUnique({
        where: { recipeCategoryId_foodId: { recipeCategoryId: cat1.id, foodId: rcf.foodId } }
      });
      if (!exists) {
        await prisma.recipeCategoryFood.update({ where: { id: rcf.id }, data: { recipeCategoryId: cat1.id } });
      } else {
        await prisma.recipeCategoryFood.delete({ where: { id: rcf.id } });
      }
    }
    await prisma.recipeCategory.delete({ where: { id: cat2.id } });
    console.log('Merged Airfryer categories.');
  }
}

mergeAirfryer()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
