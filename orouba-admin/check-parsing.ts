import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany();
  let issues = 0;
  
  for (const recipe of recipes) {
    let rawDescription = recipe.descriptionAr || '';
    let extractedIngredients = '';
    
    const splitKeyword = 'الخطوات:\n';
    const fallbackSplitKeyword = 'الخطوات:';

    if (rawDescription.includes(splitKeyword)) {
      const parts = rawDescription.split(splitKeyword);
      let ingPart = parts[0];
      const ingKeyword = 'المكونات:\n';
      if (ingPart.includes(ingKeyword)) {
        extractedIngredients = ingPart.split(ingKeyword)[1].trim();
      } else {
        extractedIngredients = ingPart.trim();
      }
    } else if (rawDescription.includes(fallbackSplitKeyword)) {
       const parts = rawDescription.split(fallbackSplitKeyword);
       let ingPart = parts[0];
       const ingKeyword = 'المكونات:';
       if (ingPart.includes(ingKeyword)) {
         extractedIngredients = ingPart.split(ingKeyword)[1].replace(/^<\/p>/, '').trim();
       } else {
         extractedIngredients = ingPart.replace(/<p>\s*$/, '').trim();
       }
    }

    if (extractedIngredients) {
      if (extractedIngredients.includes('-')) {
        const items = extractedIngredients.split('\n').filter(line => line.trim().startsWith('-') || line.trim().length > 0);
        // If items length is weird or not parsed well
        if (items.length === 1 && items[0].length > 100) {
           console.log(`Recipe ${recipe.id} (${recipe.nameAr}) might have formatting issues:`);
           console.log(extractedIngredients);
           console.log('---');
           issues++;
        }
      }
      
      // If it has HTML tags that shouldn't be there?
      if (extractedIngredients.includes('<p>') && extractedIngredients.includes('-')) {
         console.log(`Recipe ${recipe.id} (${recipe.nameAr}) has HTML mixed with hyphens:`);
         console.log(extractedIngredients);
         console.log('---');
         issues++;
      }
    }
  }
  
  console.log(`Checked all recipes. Found ${issues} potential issues.`);
}

main().finally(() => prisma.$disconnect());
