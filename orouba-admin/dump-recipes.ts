import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const allRecipes = await prisma.recipe.findMany({ 
    select: { id: true, nameEn: true, nameAr: true, descriptionEn: true, descriptionAr: true, foods: { include: { food: true } } }
  });
  
  const toFix = [];
  for (const r of allRecipes) {
    // If description starts with <ol> or doesn't have words like "كوب", "ملعقة", "كيس", "جرام", "cup", "spoon", "pack", "gram" 
    // it's likely missing ingredients. Or if it's very short.
    const isMissingAr = r.descriptionAr && r.descriptionAr.trim().startsWith('<ol>');
    const isMissingEn = r.descriptionEn && r.descriptionEn.trim().startsWith('<ol>');
    
    // We'll just export all of them to let the AI decide, but to save space we only export ones that seem suspicious.
    // Let's just export all 58 so the AI can read them.
    toFix.push({
      id: r.id,
      nameEn: r.nameEn,
      nameAr: r.nameAr,
      descEn: r.descriptionEn,
      descAr: r.descriptionAr,
      foods: r.foods.map(f => f.food.nameEn + ' / ' + f.food.nameAr).join(', ')
    });
  }
  
  fs.writeFileSync('recipes-to-fix.json', JSON.stringify(toFix, null, 2));
  console.log('Saved to recipes-to-fix.json');
}

main().catch(console.error).finally(() => prisma.$disconnect());
