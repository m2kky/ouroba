import { PrismaClient } from '@prisma/client';
import { uploadFile } from './src/lib/upload';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const imagesDir = path.join(__dirname, '..', 'recovered_recipe_images');
  if (!fs.existsSync(imagesDir)) {
    console.error(`Images directory not found: ${imagesDir}`);
    return;
  }

  // Get old recipes map to match names to the safe names generated during download
  const oldRecipesRaw = fs.readFileSync('recipes_to_download.json', 'utf8');
  const oldRecipes = JSON.parse(oldRecipesRaw);
  
  const recipes = await prisma.recipe.findMany();
  console.log(`Found ${recipes.length} recipes in database. Checking for images...`);

  let updatedCount = 0;

  for (const recipe of recipes) {
    if (!recipe.nameEn && !recipe.nameAr) continue;
    
    // Find the matching old recipe to get the correct name_en used for safeName
    // Sometimes Prisma recipes might have slightly different names if they were manually edited,
    // but they should match.
    const oldRecipeMatch = oldRecipes.find(r => 
        (r.name_en && recipe.nameEn && r.name_en.toLowerCase().trim() === recipe.nameEn.toLowerCase().trim()) ||
        (r.name_ar && recipe.nameAr && r.name_ar.toLowerCase().trim() === recipe.nameAr.toLowerCase().trim())
    );

    if (!oldRecipeMatch) continue;

    const baseName = oldRecipeMatch.name_en;
    if (!baseName) continue;

    let safeName = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Check possible extensions
    const extensions = ['.jpg', '.webp', '.png', '.jpeg', '.mp4'];
    let filePath = null;
    let fileName = null;

    for (const ext of extensions) {
      const testPath = path.join(imagesDir, `${safeName}${ext}`);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        fileName = `${safeName}${ext}`;
        break;
      }
    }

    if (filePath && fileName) {
      console.log(`Uploading ${fileName} for recipe "${recipe.nameEn || recipe.nameAr}"...`);
      try {
        const fileBuffer = fs.readFileSync(filePath);
        
        // Upload to R2 using the provided uploadFile utility
        const publicUrl = await uploadFile(fileBuffer, fileName, 'recipes');
        
        // Update database
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { internalImage: publicUrl }
        });
        
        console.log(`  -> Success! New URL: ${publicUrl}`);
        updatedCount++;
      } catch (err) {
        console.error(`  -> Failed to upload for ${recipe.nameEn}:`, err);
      }
    }
  }

  console.log(`\nFinished! Successfully uploaded and updated ${updatedCount} recipes.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
