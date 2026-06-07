const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  const recipes = await prisma.recipe.findMany({ select: { id: true, nameEn: true, nameAr: true } });
  const categories = await prisma.recipeCategory.findMany({ select: { id: true, nameEn: true, nameAr: true } });
  const foods = await prisma.food.findMany({ select: { id: true, nameEn: true, nameAr: true } });

  console.log('--- Recipes ---');
  console.log(recipes.slice(0, 10));
  console.log(`Total recipes: ${recipes.length}`);
  
  console.log('\n--- Recipe Categories ---');
  console.log(categories);
  
  console.log('\n--- Foods ---');
  console.log(foods.slice(0, 10));
}

checkDb()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
