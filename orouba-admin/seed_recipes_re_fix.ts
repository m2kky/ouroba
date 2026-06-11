import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const reContent = fs.readFileSync('d:/Codes_Projects/oruba rep/re', 'utf8');
  const recipesBlocks = reContent.split(/^##\s+/m).filter(b => b.trim().length > 0);

  const parsedRecipes: any[] = [];

  for (const block of recipesBlocks) {
    const lines = block.split('\n');
    const titleLine = lines[0].trim();
    
    // Extract title
    const titleMatch = titleLine.match(/^\d+\.\s*(.*?)\s*\/\s*(.*)$/);
    let nameAr = '';
    let nameEn = '';
    if (titleMatch) {
      nameAr = titleMatch[1].trim();
      nameEn = titleMatch[2].trim();
    } else {
      nameAr = titleLine.replace(/^\d+\.\s*/, '').trim();
      nameEn = nameAr;
    }

    // Filter out long ingredients descriptions
    const ingredientsBlockMatch = block.match(/### Ingredients \/ المكونات:([\s\S]*?)###/);
    const foods: string[] = [];
    if (ingredientsBlockMatch) {
      const ingredientsLines = ingredientsBlockMatch[1].trim().split('\n');
      for (const line of ingredientsLines) {
        if (line.trim().startsWith('-')) {
          const item = line.replace(/^-/, '').trim();
          // Filter if item is too long (likely a paragraph mistakenly pasted)
          if (item.length < 50 && item.includes(' / ')) {
            foods.push(item);
          }
        }
      }
    }

    let ingredientsAr: string[] = [];
    let instructionsAr = '';
    let ingredientsEn: string[] = [];
    let instructionsEn = '';

    const arabicMatch = block.match(/\*\*Arabic \/ عربي:\*\*([\s\S]*?)(\*\*English \/ إنجليزي:\*\*|---|$)/);
    if (arabicMatch) {
      const arabicText = arabicMatch[1].trim();
      const stepsSplit = arabicText.split(/الخطوات:/);
      if (stepsSplit.length > 1) {
        const ingText = stepsSplit[0].replace(/المكونات:/, '').trim();
        ingredientsAr = ingText.split('\n').map(s => s.trim().replace(/^-/, '').trim()).filter(s => s.length > 0);
        
        instructionsAr = stepsSplit[1].trim();
      } else {
        instructionsAr = arabicText.trim();
      }
    }

    const englishMatch = block.match(/\*\*English \/ إنجليزي:\*\*([\s\S]*?)(---|$)/);
    if (englishMatch) {
      const englishText = englishMatch[1].trim();
      // Sometimes "Steps:" sometimes "Instructions:"
      const stepsSplit = englishText.split(/Steps:|Instructions:/);
      if (stepsSplit.length > 1) {
        const ingText = stepsSplit[0].replace(/Ingredients:/, '').trim();
        ingredientsEn = ingText.split('\n').map(s => s.trim().replace(/^-/, '').trim()).filter(s => s.length > 0);
        
        instructionsEn = stepsSplit[1].trim();
      } else {
        instructionsEn = englishText.trim();
      }
    }

    parsedRecipes.push({
      nameAr,
      nameEn,
      foods,
      ingredientsAr,
      ingredientsEn,
      instructionsAr,
      instructionsEn
    });
  }

  // Deduplicate on script side
  const uniqueRecipes = new Map<string, any>();
  for (const r of parsedRecipes) {
    const key = r.nameEn.toLowerCase();
    if (!uniqueRecipes.has(key)) {
      uniqueRecipes.set(key, r);
    } else {
      // If the new one has more details, keep it
      const existing = uniqueRecipes.get(key);
      if (r.ingredientsEn.length > existing.ingredientsEn.length) {
        uniqueRecipes.set(key, r);
      }
    }
  }

  console.log(`Unique recipes to process: ${uniqueRecipes.size}`);

  // Upsert
  for (const r of Array.from(uniqueRecipes.values())) {
    
    // Check if recipe exists and was manually modified
    let recipe = await prisma.recipe.findFirst({
      where: { nameEn: { equals: r.nameEn, mode: 'insensitive' } }
    });

    const isManuallyFixed = recipe && recipe.descriptionAr && recipe.descriptionAr.includes('<p>');

    if (isManuallyFixed) {
      console.log(`Skipping manually fixed recipe: ${r.nameEn}`);
      continue;
    }

    console.log(`Seeding unedited recipe: ${r.nameEn}`);
    
    // Process Foods (the top level ingredients that map to products)
    const foodIds: string[] = [];
    for (const food of r.foods) {
      const parts = food.split(' / ');
      const fAr = parts[0].trim();
      const fEn = parts[1] ? parts[1].trim() : fAr;
      
      let dbFood = await prisma.food.findFirst({
        where: { nameEn: { equals: fEn, mode: 'insensitive' } }
      });
      if (!dbFood) {
        dbFood = await prisma.food.create({
          data: { nameAr: fAr, nameEn: fEn }
        });
      }
      foodIds.push(dbFood.id);
    }

    const htmlDescAr = r.instructionsAr.split('\n').filter((s: string) => s.trim()).map((s: string) => `<p>${s.trim()}</p>`).join('');
    const htmlDescEn = r.instructionsEn.split('\n').filter((s: string) => s.trim()).map((s: string) => `<p>${s.trim()}</p>`).join('');

    if (recipe) {
      // Update
      recipe = await prisma.recipe.update({
        where: { id: recipe.id },
        data: {
          nameAr: r.nameAr,
          descriptionAr: htmlDescAr,
          descriptionEn: htmlDescEn,
        }
      });
    } else {
      // Create
      recipe = await prisma.recipe.create({
        data: {
          nameEn: r.nameEn,
          nameAr: r.nameAr,
          descriptionAr: htmlDescAr,
          descriptionEn: htmlDescEn,
        }
      });
    }

    // Link foods
    for (const fid of foodIds) {
      const exists = await prisma.recipeFood.findUnique({
        where: { recipeId_foodId: { recipeId: recipe.id, foodId: fid } }
      });
      if (!exists) {
        await prisma.recipeFood.create({
          data: { recipeId: recipe.id, foodId: fid }
        });
      }
    }

    // Recreate steps (which are now properly Ingredients)
    await prisma.recipeStep.deleteMany({
      where: { recipeId: recipe.id }
    });

    const maxSteps = Math.max(r.ingredientsAr.length, r.ingredientsEn.length);
    for (let i = 0; i < maxSteps; i++) {
      const sAr = r.ingredientsAr[i] || '';
      const sEn = r.ingredientsEn[i] || '';
      if (sAr || sEn) {
        await prisma.recipeStep.create({
          data: {
            recipeId: recipe.id,
            stepAr: sAr,
            stepEn: sEn
          }
        });
      }
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
