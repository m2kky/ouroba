import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const fileData = JSON.parse(fs.readFileSync('New folder/س', 'utf-8'));
  
  // Let's check the first recipe in fileData and compare its foods with DB
  const sampleJson = fileData[0];
  console.log('Sample JSON Recipe Foods:', JSON.stringify(sampleJson.foods, null, 2));

  const dbRecipe = await prisma.recipe.findUnique({
    where: { id: sampleJson.id },
    include: { foods: { include: { food: true } } }
  });

  console.log('Sample DB Recipe Foods:', JSON.stringify(dbRecipe?.foods, null, 2));

  // Check how many recipes have no foods in DB vs JSON
  let jsonHasMoreFoods = 0;
  for (const jsonR of fileData) {
    const dbR = await prisma.recipe.findUnique({
      where: { id: jsonR.id },
      include: { foods: true, steps: true, properties: true }
    });
    if (dbR) {
      if (jsonR.foods.length > dbR.foods.length) {
        jsonHasMoreFoods++;
      }
    }
  }
  
  console.log(`Recipes where JSON has more food links than DB: ${jsonHasMoreFoods}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
