import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { uploadFile } from '../src/lib/upload'; // Using Next.js R2 upload config

const prisma = new PrismaClient();
const PROCESSED_DIR = path.join(__dirname, '..', 'processed_media');

// Helper to determine processed filename
function getProcessedFileName(oldUrl: string) {
  const parts = oldUrl.split('/');
  const fileName = parts[parts.length - 1];
  const ext = path.extname(fileName).toLowerCase();
  const base = path.basename(fileName, ext);

  // If it was an image that got converted, the new ext is .webp
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    return `${base}.webp`;
  }
  return fileName; // For .mp4, .svg, etc.
}

async function processUrl(oldUrl: string | null | undefined): Promise<string | null> {
  if (!oldUrl) return null;
  // If already on our R2, leave it alone
  if (oldUrl.includes('r2.dev') || oldUrl.includes('cloudflarestorage')) {
    return oldUrl;
  }

  // If it's the old site
  if (oldUrl.includes('camp-coding.site') || oldUrl.includes('/storage/app/images')) {
    const fileName = getProcessedFileName(oldUrl);
    const filePath = path.join(PROCESSED_DIR, fileName);

    if (fs.existsSync(filePath)) {
      try {
        const buffer = fs.readFileSync(filePath);
        console.log(`Uploading ${fileName} to R2...`);
        // Upload to R2
        const r2Url = await uploadFile(buffer, fileName, 'unified');
        return r2Url;
      } catch (err: any) {
        console.error(`Failed to upload ${fileName}:`, err.message);
      }
    } else {
      console.log(`File not found locally: ${fileName}`);
    }
  }

  return oldUrl;
}

async function main() {
  console.log('Starting Media Unification...');

  // 1. Products
  const products = await prisma.product.findMany();
  let updated = 0;
  for (const p of products) {
    // Only products have images in productImages, but wait some have direct images maybe?
    // The model says Product does not have direct image, but let's check ProductImage
  }

  const productImages = await prisma.productImage.findMany();
  for (const pi of productImages) {
    const newUrl = await processUrl(pi.url);
    if (newUrl && newUrl !== pi.url) {
      await prisma.productImage.update({
        where: { id: pi.id },
        data: { url: newUrl }
      });
      updated++;
    }
  }

  // 2. Recipes
  const recipes = await prisma.recipe.findMany();
  for (const r of recipes) {
    let changed = false;
    const data: any = {};
    const newImg = await processUrl(r.internalImage);
    if (newImg && newImg !== r.internalImage) {
      data.internalImage = newImg;
      changed = true;
    }
    const newVid = await processUrl(r.videoLink);
    if (newVid && newVid !== r.videoLink) {
      data.videoLink = newVid;
      changed = true;
    }
    if (changed) {
      await prisma.recipe.update({ where: { id: r.id }, data });
      updated++;
    }
  }

  const recipeImages = await prisma.recipeImage.findMany();
  for (const ri of recipeImages) {
    const newUrl = await processUrl(ri.url);
    if (newUrl && newUrl !== ri.url) {
      await prisma.recipeImage.update({
        where: { id: ri.id },
        data: { url: newUrl }
      });
      updated++;
    }
  }

  // 3. Brands
  const brands = await prisma.brand.findMany();
  for (const b of brands) {
    let changed = false;
    const data: any = {};
    if (b.image) { const u = await processUrl(b.image); if (u !== b.image) { data.image = u; changed = true; } }
    if (b.imageMain) { const u = await processUrl(b.imageMain); if (u !== b.imageMain) { data.imageMain = u; changed = true; } }
    
    if (changed) {
      await prisma.brand.update({ where: { id: b.id }, data });
      updated++;
    }
  }

  // Add more tables (Categories, CategoriesTypes, etc.)
  console.log(`Unification complete. Updated ${updated} records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
