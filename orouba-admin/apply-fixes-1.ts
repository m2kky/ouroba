import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const fixes = JSON.parse(fs.readFileSync('fixes-1.json', 'utf-8'));
  
  for (const fix of fixes) {
    const existing = await prisma.recipe.findUnique({ where: { id: fix.id } });
    if (existing) {
      await prisma.recipe.update({
        where: { id: fix.id },
        data: {
          descriptionEn: fix.descEn,
          descriptionAr: fix.descAr
        }
      });
      console.log(`Updated recipe ${fix.id}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
