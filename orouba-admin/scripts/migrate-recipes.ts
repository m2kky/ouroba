import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A simple function to parse SQL INSERT VALUES blocks into an array of objects
function parseSqlInserts(sqlContent: string, tableName: string) {
  // Find all INSERT INTO `tableName` blocks
  const regex = new RegExp(`INSERT INTO \\\`${tableName}\\\` \\((.*?)\\) VALUES([\\s\\S]*?);\\r?\\n`, 'g');
  const results = [];
  
  let match;
  while ((match = regex.exec(sqlContent)) !== null) {
    const columnsStr = match[1];
    const columns = columnsStr.split(',').map(c => c.trim().replace(/`/g, ''));
    
    let valuesStr = match[2];
    
    // Simple state machine to parse tuples
    let inString = false;
    let escape = false;
    let currentTuple = [];
    let currentValue = '';
    
    for (let i = 0; i < valuesStr.length; i++) {
      const char = valuesStr[i];
      
      if (escape) {
        currentValue += char;
        escape = false;
        continue;
      }
      
      if (char === '\\') {
        escape = true;
        // Keep the backslash if you want, but usually SQL dumps escape quotes like \'
        continue;
      }
      
      if (char === "'") {
        inString = !inString;
        continue; // skip the quote character itself
      }
      
      if (!inString) {
        if (char === '(' && currentValue.trim() === '') {
          currentTuple = [];
          currentValue = '';
          continue;
        }
        if (char === ',' || char === ')') {
          currentTuple.push(currentValue.trim());
          currentValue = '';
          
          if (char === ')') {
            // End of tuple
            const obj: any = {};
            columns.forEach((col, idx) => {
              let val = currentTuple[idx];
              if (val === 'NULL') val = null;
              obj[col] = val;
            });
            results.push(obj);
            currentTuple = [];
            // Skip the comma after the tuple if there is one
            while (i + 1 < valuesStr.length && (valuesStr[i + 1] === ',' || valuesStr[i + 1] === ' ' || valuesStr[i + 1] === '\n' || valuesStr[i + 1] === '\r')) {
              i++;
            }
          }
          continue;
        }
      }
      
      currentValue += char;
    }
  }
  
  return results;
}

async function main() {
  const sqlPath = path.resolve(__dirname, '../../campcod3_eloroba.sql');
  console.log(`Reading SQL file from ${sqlPath}...`);
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log('Parsing recipes (RecipeCategory)...');
  const recipes = parseSqlInserts(sqlContent, 'recipes');
  
  console.log('Parsing food (Food)...');
  const foods = parseSqlInserts(sqlContent, 'food');
  
  console.log('Parsing cooks (Recipe)...');
  const cooks = parseSqlInserts(sqlContent, 'cooks');
  
  console.log('Parsing food_cooks (RecipeFood)...');
  const food_cooks = parseSqlInserts(sqlContent, 'food_cooks');
  
  console.log('Parsing cook_images (RecipeImage)...');
  const cook_images = parseSqlInserts(sqlContent, 'cook_images');
  
  console.log('Parsing cook_props (RecipeProperty)...');
  const cook_props = parseSqlInserts(sqlContent, 'cook_props');
  
  console.log('Parsing food_steps (RecipeStep)...');
  const food_steps = parseSqlInserts(sqlContent, 'food_steps');
  
  console.log('Parsing recommend_recipes (RecommendedRecipe)...');
  const recommend_recipes = parseSqlInserts(sqlContent, 'recommend_recipes');

  console.log(`Found ${recipes.length} recipes (categories), ${foods.length} foods, ${cooks.length} cooks (recipes)`);

  // Start Transaction or sequentially create
  console.log('Migrating RecipeCategory...');
  for (const cat of recipes) {
    await prisma.recipeCategory.upsert({
      where: { id: cat.id.toString() },
      update: {},
      create: {
        id: cat.id.toString(),
        nameAr: cat.name_ar || '',
        nameEn: cat.name_en || cat.name_ar || '',
        image: cat.image,
        number: parseInt(cat.number) || 999,
        isHidden: cat.hidden === '1',
      }
    });
  }

  console.log('Migrating Food...');
  for (const f of foods) {
    await prisma.food.upsert({
      where: { id: f.id.toString() },
      update: {},
      create: {
        id: f.id.toString(),
        nameAr: f.name_ar || '',
        nameEn: f.name_en || f.name_ar || '',
        image: f.image,
        number: parseInt(f.number) || 999,
        isHidden: f.hidden === '1',
        recipeCategories: {
          create: {
            recipeCategoryId: f.recipe_id.toString()
          }
        }
      }
    });
  }

  console.log('Migrating Recipes (cooks)...');
  for (const cook of cooks) {
    await prisma.recipe.upsert({
      where: { id: cook.id.toString() },
      update: {},
      create: {
        id: cook.id.toString(),
        nameAr: cook.name_ar || '',
        nameEn: cook.name_en || cook.name_ar || '',
        descriptionAr: cook.description_ar,
        descriptionEn: cook.description_en,
        videoLink: cook.video_link,
        internalImage: cook.internal_image,
        number: parseInt(cook.number) || 999,
        isHidden: cook.hidden === '1',
      }
    });
  }

  console.log('Migrating RecipeFood (food_cooks)...');
  for (const fc of food_cooks) {
    try {
      await prisma.recipeFood.upsert({
        where: {
          recipeId_foodId: {
            recipeId: fc.cook_id.toString(),
            foodId: fc.food_id.toString(),
          }
        },
        update: {},
        create: {
          recipeId: fc.cook_id.toString(),
          foodId: fc.food_id.toString(),
        }
      });
    } catch (err) {
      console.warn(`Failed to link recipe ${fc.cook_id} to food ${fc.food_id} - it may not exist.`);
    }
  }

  console.log('Migrating RecipeImage (cook_images)...');
  for (const img of cook_images) {
    await prisma.recipeImage.create({
      data: {
        id: img.id.toString(),
        recipeId: img.cook_id.toString(),
        url: img.url,
      }
    }).catch(() => {});
  }

  console.log('Migrating RecipeProperty (cook_props)...');
  for (const prop of cook_props) {
    await prisma.recipeProperty.create({
      data: {
        id: prop.id.toString(),
        recipeId: prop.cook_id.toString(),
        icon: prop.icon,
        titleAr: prop.title_ar || '',
        titleEn: prop.title_en || prop.title_ar || '',
        textAr: prop.text_ar || '',
        textEn: prop.text_en || prop.text_ar || '',
      }
    }).catch(() => {});
  }

  console.log('Migrating RecipeStep (food_steps)...');
  for (const step of food_steps) {
    await prisma.recipeStep.create({
      data: {
        id: step.id.toString(),
        recipeId: step.cook_id.toString(),
        stepAr: step.step_ar || '',
        stepEn: step.step_en || step.step_ar || '',
      }
    }).catch(() => {});
  }

  console.log('Migrating RecommendedRecipe (recommend_recipes)...');
  for (const rec of recommend_recipes) {
    try {
      // Check if product exists first because we didn't migrate products in this script
      // Assuming products were already migrated and their IDs match.
      await prisma.recommendedRecipe.upsert({
        where: {
          productId_recipeId: {
            productId: rec.product_id.toString(),
            recipeId: rec.cook_id.toString(),
          }
        },
        update: {},
        create: {
          productId: rec.product_id.toString(),
          recipeId: rec.cook_id.toString(),
        }
      });
    } catch (err) {
      console.warn(`Failed to link recommended recipe ${rec.cook_id} to product ${rec.product_id}`);
    }
  }

  console.log('Migration Complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
