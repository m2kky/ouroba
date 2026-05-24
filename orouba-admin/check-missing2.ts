import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const fileData = JSON.parse(fs.readFileSync('New folder/س', 'utf-8'));
  
  let jsonHasMoreSteps = 0;
  let jsonHasMoreProps = 0;
  
  for (const jsonR of fileData) {
    const dbR = await prisma.recipe.findUnique({
      where: { id: jsonR.id },
      include: { steps: true, properties: true }
    });
    
    if (dbR) {
      if (jsonR.steps && jsonR.steps.length > dbR.steps.length) {
        jsonHasMoreSteps++;
      }
      if (jsonR.properties && jsonR.properties.length > dbR.properties.length) {
        jsonHasMoreProps++;
      }
    }
  }
  
  console.log(`Recipes where JSON has more steps than DB: ${jsonHasMoreSteps}`);
  console.log(`Recipes where JSON has more properties than DB: ${jsonHasMoreProps}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
