import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const fileData = JSON.parse(fs.readFileSync('New folder/س', 'utf-8'));
  let missingFoods = 0;
  
  for (const jsonR of fileData) {
    if (jsonR.foods && jsonR.foods.length > 0) {
      for (const rf of jsonR.foods) {
        if (rf.food) {
          const dbFood = await prisma.food.findUnique({ where: { id: rf.food.id } });
          if (!dbFood) {
             console.log(`Food missing entirely from DB: ID ${rf.food.id}, Name: ${rf.food.nameAr}`);
             missingFoods++;
          }
        }
      }
    }
  }
  console.log(`Total missing foods: ${missingFoods}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
