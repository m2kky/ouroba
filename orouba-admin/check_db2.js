const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const recipes = await prisma.recipe.findMany();
  console.log('Total recipes:', recipes.length);
  if (recipes.length > 0) {
    console.log('First recipe:', recipes[0]);
    console.log('Recipes with internalImage:', recipes.filter(r => r.internalImage).length);
    console.log('Recipes with internalImage containing camp-coding:', recipes.filter(r => r.internalImage && r.internalImage.includes('camp-coding')).length);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
