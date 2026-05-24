import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const fileData = JSON.parse(fs.readFileSync('New folder/س', 'utf-8'));
  
  for (const jsonR of fileData) {
    if (jsonR.foods && jsonR.foods.length > 0) {
      for (const rf of jsonR.foods) {
        if (rf.food) {
          const dbFood = await prisma.food.findUnique({ where: { id: rf.food.id } });
          if (dbFood && (dbFood.nameAr !== rf.food.nameAr || dbFood.nameEn !== rf.food.nameEn)) {
             console.log(`Food mismatch for ID ${rf.food.id}:`);
             console.log(`  JSON: ${rf.food.nameAr}`);
             console.log(`  DB: ${dbFood.nameAr}`);
          }
        }
      }
    }
  }
  console.log("Done checking food names.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
