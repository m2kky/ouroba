import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function fixSeeding() {
  const reContent = fs.readFileSync('d:/Codes_Projects/oruba rep/re', 'utf8');
  const recipesBlocks = reContent.split(/^##\s+/m).filter(b => b.trim().length > 0);

  let updatedCount = 0;

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

    // Extract Description and Steps
    let descAr = ''; // Ingredients text (old)
    let descEn = '';
    let actualStepsAr: string[] = []; // Instructions text
    let actualStepsEn: string[] = [];
    
    let actualIngredientsAr: string[] = [];
    let actualIngredientsEn: string[] = [];

    const arabicMatch = block.match(/\*\*Arabic \/ عربي:\*\*([\s\S]*?)(\*\*English \/ إنجليزي:\*\*|---|$)/);
    if (arabicMatch) {
      const arabicText = arabicMatch[1].trim();
      const stepsSplit = arabicText.split(/الخطوات:/);
      if (stepsSplit.length > 1) {
        // Here: stepsSplit[0] is the ingredients text
        const ingredientsBlock = stepsSplit[0].replace(/المكونات:/, '').trim();
        actualIngredientsAr = ingredientsBlock.split('\n').map(s => s.trim().replace(/^-/, '').trim()).filter(s => s.length > 0);
        
        // stepsSplit[1] is the instructions text
        const stepsBlock = stepsSplit[1].trim();
        actualStepsAr = stepsBlock.split('\n').map(s => s.trim().replace(/^-/, '').trim()).filter(s => s.length > 0);
      }
    }

    const englishMatch = block.match(/\*\*English \/ إنجليزي:\*\*([\s\S]*?)(---|$)/);
    if (englishMatch) {
      const englishText = englishMatch[1].trim();
      const stepsSplit = englishText.split(/Steps:|Instructions:/);
      if (stepsSplit.length > 1) {
        const ingredientsBlock = stepsSplit[0].replace(/Ingredients:/, '').trim();
        actualIngredientsEn = ingredientsBlock.split('\n').map(s => s.trim().replace(/^-/, '').trim()).filter(s => s.length > 0);

        const stepsBlock = stepsSplit[1].trim();
        actualStepsEn = stepsBlock.split('\n').map(s => s.trim().replace(/^-/, '').trim()).filter(s => s.length > 0);
      }
    }

    // What the frontend expects:
    // data.descriptionAr -> INSTRUCTIONS
    // data.steps -> INGREDIENTS

    const newDescriptionAr = "طريقة التحضير\n" + actualStepsAr.map(s => `- ${s}`).join('\n');
    const newDescriptionEn = "Instructions\n" + actualStepsEn.map(s => `- ${s}`).join('\n');

    let recipe = await prisma.recipe.findFirst({
      where: { nameEn: { equals: nameEn, mode: 'insensitive' } }
    });

    if (recipe) {
      // Update the recipe descriptions to contain INSTRUCTIONS
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: {
          descriptionAr: newDescriptionAr,
          descriptionEn: newDescriptionEn,
        }
      });

      // Clear the old steps
      await prisma.recipeStep.deleteMany({
        where: { recipeId: recipe.id }
      });

      // Add the INGREDIENTS to RecipeStep
      const maxIngredients = Math.max(actualIngredientsAr.length, actualIngredientsEn.length);
      for (let i = 0; i < maxIngredients; i++) {
        const iAr = actualIngredientsAr[i] || '';
        const iEn = actualIngredientsEn[i] || '';
        if (iAr || iEn) {
          await prisma.recipeStep.create({
            data: {
              recipeId: recipe.id,
              stepAr: iAr,
              stepEn: iEn
            }
          });
        }
      }
      updatedCount++;
      console.log(`Fixed: ${nameEn}`);
    }
  }

  console.log(`Successfully fixed ${updatedCount} recipes.`);
}

fixSeeding()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
