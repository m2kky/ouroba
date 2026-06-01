import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({where:{id:'60'}});
  for (const recipe of recipes) {
    let raw = recipe.descriptionAr || '';
    let extracted = raw.split('الخطوات:\n')[0].split('المكونات:\n')[1]?.trim();
    if (extracted) {
      const items = extracted.split('\n').filter(l => l.trim().startsWith('-') || l.trim().length > 0);
      console.log(items.map(i => i.replace(/^- /, '').trim()));
    }
  }
}
main().finally(() => prisma.$disconnect());
