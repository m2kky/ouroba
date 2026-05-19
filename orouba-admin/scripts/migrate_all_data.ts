import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
const dnsLookupOriginal = dns.lookup;
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']);

(dns as any).lookup = function (hostname: string, options: any, callback: any) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const isAll = options && options.all;
  resolver.resolve4(hostname, (err, addresses) => {
    if (err || !addresses || addresses.length === 0) {
      dnsLookupOriginal(hostname, options, callback);
    } else {
      if (isAll) {
        callback(null, addresses.map(addr => ({ address: addr, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    }
  });
};

import { uploadFile } from '../src/lib/upload'; // Use the internal Next.js upload helper


const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '..', 'ectracted data');
const PROCESSED_DIR = path.join(__dirname, '..', 'processed_media');

// Helper to check and upload media
async function uploadMedia(oldUrl: string | null | undefined, folder: string): Promise<string | null> {
  if (!oldUrl) return null;
  if (oldUrl.includes('r2.dev') || oldUrl.includes('cloudflarestorage')) {
    return oldUrl;
  }

  // Get file name and extension
  const parts = oldUrl.split('/');
  const fileName = parts[parts.length - 1];
  const ext = path.extname(fileName).toLowerCase();
  const base = path.basename(fileName, ext);

  // If it was an image that got converted, the new extension is .webp
  const isImg = ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  const targetName = isImg ? `${base}.webp` : fileName;
  const filePath = path.join(PROCESSED_DIR, targetName);

  if (fs.existsSync(filePath)) {
    try {
      const buffer = fs.readFileSync(filePath);
      console.log(`Uploading ${targetName} to R2 (${folder})...`);
      const r2Url = await uploadFile(buffer, targetName, folder);
      return r2Url;
    } catch (err: any) {
      console.error(`Failed to upload ${targetName}:`, err.message);
      return null;
    }
  } else {
    console.warn(`File not found locally in processed_media: ${targetName}`);
    return null;
  }
}

function loadJson(file: string) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.error(`JSON File not found: ${filePath}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function main() {
  console.log('--- STARTING COMPREHENSIVE DATA & MEDIA MIGRATION ---');

  // Verify R2 configuration exists
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('ERROR: Missing Cloudflare R2 Credentials in .env file!');
    console.error('Please add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL to your .env file.');
    process.exit(1);
  }

  // 1. Migrate Brands
  console.log('\n--- Migrating Brands ---');
  const brands = loadJson('data_brands.json');
  for (const b of brands) {
    const img = await uploadMedia(b.image, 'brands');
    const imgMain = await uploadMedia(b.image_main, 'brands');
    const video = await uploadMedia(b.video_url, 'brands');
    const videoEn = await uploadMedia(b.video_url_en, 'brands');

    await prisma.brand.upsert({
      where: { id: b.id },
      update: {
        nameAr: b.name_ar,
        nameEn: b.name_en,
        descriptionAr: b.description_ar,
        descriptionEn: b.description_en,
        brandTextAr: b.brand_text_ar,
        brandTextEn: b.brand_text_en,
        colorBrand: b.color_brand,
        colorHover: b.color_hover,
        number: parseInt(b.number) || 999,
        isHidden: b.hidden === '1',
        image: img,
        imageMain: imgMain,
        videoUrl: video,
        videoUrlEn: videoEn,
      },
      create: {
        id: b.id,
        nameAr: b.name_ar,
        nameEn: b.name_en,
        descriptionAr: b.description_ar,
        descriptionEn: b.description_en,
        brandTextAr: b.brand_text_ar,
        brandTextEn: b.brand_text_en,
        colorBrand: b.color_brand,
        colorHover: b.color_hover,
        number: parseInt(b.number) || 999,
        isHidden: b.hidden === '1',
        image: img,
        imageMain: imgMain,
        videoUrl: video,
        videoUrlEn: videoEn,
      }
    });
  }
  console.log(`Migrated ${brands.length} Brands.`);

  // 2. Migrate Recipe Categories (stored as recipes in Laravel)
  console.log('\n--- Migrating Recipe Categories ---');
  const recipeCats = loadJson('data_recipes.json');
  for (const rc of recipeCats) {
    const img = await uploadMedia(rc.image, 'recipes');
    await prisma.recipeCategory.upsert({
      where: { id: rc.id },
      update: {
        nameAr: rc.name_ar,
        nameEn: rc.name_en,
        image: img,
        number: parseInt(rc.number) || 999,
        isHidden: rc.hidden === '1',
      },
      create: {
        id: rc.id,
        nameAr: rc.name_ar,
        nameEn: rc.name_en,
        image: img,
        number: parseInt(rc.number) || 999,
        isHidden: rc.hidden === '1',
      }
    });
  }
  console.log(`Migrated ${recipeCats.length} Recipe Categories.`);

  // 3. Migrate Foods (Ingredients)
  console.log('\n--- Migrating Foods ---');
  const foods = loadJson('data_food.json');
  for (const f of foods) {
    const img = await uploadMedia(f.image, 'foods');
    // Ensure brand exists if referenced
    const brandId = f.brand_id && f.brand_id !== '0' ? f.brand_id : null;
    await prisma.food.upsert({
      where: { id: f.id },
      update: {
        nameAr: f.name_ar,
        nameEn: f.name_en,
        image: img,
        number: parseInt(f.number) || 999,
        isHidden: f.hidden === '1',
        brandId: brandId,
      },
      create: {
        id: f.id,
        nameAr: f.name_ar,
        nameEn: f.name_en,
        image: img,
        number: parseInt(f.number) || 999,
        isHidden: f.hidden === '1',
        brandId: brandId,
      }
    });

    // Handle RecipeCategoryFood relation
    if (f.recipe_id && f.recipe_id !== '0') {
      await prisma.recipeCategoryFood.upsert({
        where: { recipeCategoryId_foodId: { recipeCategoryId: f.recipe_id, foodId: f.id } },
        update: {},
        create: {
          recipeCategoryId: f.recipe_id,
          foodId: f.id,
        }
      });
    }
  }
  console.log(`Migrated ${foods.length} Foods.`);

  // 4. Migrate Recipes (stored as cooks in Laravel)
  console.log('\n--- Migrating Recipes (Cooks) ---');
  const cooks = loadJson('data_cooks.json');
  for (const c of cooks) {
    const img = await uploadMedia(c.internal_image, 'recipes');
    const vid = await uploadMedia(c.video_link, 'recipes');

    await prisma.recipe.upsert({
      where: { id: c.id },
      update: {
        nameAr: c.name_ar,
        nameEn: c.name_en,
        descriptionAr: c.description_ar,
        descriptionEn: c.description_en,
        internalImage: img,
        videoLink: vid,
        number: parseInt(c.number) || 999,
        isHidden: c.hidden === '1',
      },
      create: {
        id: c.id,
        nameAr: c.name_ar,
        nameEn: c.name_en,
        descriptionAr: c.description_ar,
        descriptionEn: c.description_en,
        internalImage: img,
        videoLink: vid,
        number: parseInt(c.number) || 999,
        isHidden: c.hidden === '1',
      }
    });
  }
  console.log(`Migrated ${cooks.length} Recipes.`);

  // 5. Migrate Recipe Foods (Ingredients links)
  console.log('\n--- Migrating Recipe Foods ---');
  const recipeFoods = loadJson('data_food_cooks.json');
  for (const rf of recipeFoods) {
    if (!rf.cook_id || !rf.food_id) continue;
    try {
      await prisma.recipeFood.upsert({
      where: { recipeId_foodId: { recipeId: rf.cook_id, foodId: rf.food_id } },
      update: {},
      create: {
        recipeId: rf.cook_id,
        foodId: rf.food_id,
      }
    });
    } catch (err) {
      console.warn('Skipping record due to constraint error');
    }
  }

  // 6. Migrate Recipe Steps
  console.log('\n--- Migrating Recipe Steps ---');
  const steps = loadJson('data_food_steps.json');
  // First clear existing steps for safety to avoid duplicate step records since we recreate them
  await prisma.recipeStep.deleteMany({});
  for (const s of steps) {
    if (!s.cook_id) continue;
    try {
      await prisma.recipeStep.create({
        data: {
          recipeId: s.cook_id,
          stepAr: s.description_ar || '',
          stepEn: s.description_en || '',
        }
      });
    } catch (e) {}
  }

  // 7. Migrate Recipe Properties
  console.log('\n--- Migrating Recipe Properties ---');
  const props = loadJson('data_cook_props.json');
  await prisma.recipeProperty.deleteMany({});
  for (const p of props) {
    if (!p.cook_id) continue;
    const icon = await uploadMedia(p.icon, 'recipe-properties');
    try {
      await prisma.recipeProperty.create({
        data: {
          recipeId: p.cook_id,
          icon: icon,
          titleAr: p.title_ar || '',
          titleEn: p.title_en || '',
          textAr: p.text_ar || '',
          textEn: p.text_en || '',
        }
      });
    } catch (e) {}
  }

  // 8. Migrate Recipe Images
  console.log('\n--- Migrating Recipe Images ---');
  const recipeImgs = loadJson('data_cook_images.json');
  await prisma.recipeImage.deleteMany({});
  for (const ri of recipeImgs) {
    if (!ri.cook_id) continue;
    const img = await uploadMedia(ri.image, 'recipes');
    if (img) {
      try {
        await prisma.recipeImage.create({
          data: {
            recipeId: ri.cook_id,
            url: img,
          }
        });
      } catch (e) {}
    }
  }

  // 9. Migrate Product Categories
  console.log('\n--- Migrating Categories ---');
  const categories = loadJson('data_categories.json');
  for (const cat of categories) {
    const img = await uploadMedia(cat.image, 'categories');
    const imgEn = await uploadMedia(cat.image_en, 'categories');
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        nameAr: cat.name_ar,
        nameEn: cat.name_en,
        descriptionAr: cat.description_ar,
        descriptionEn: cat.description_en,
        image: img,
        imageEn: imgEn,
        number: parseInt(cat.number) || 999,
        isHidden: cat.hidden === '1',
        brandId: cat.brand_id,
      },
      create: {
        id: cat.id,
        nameAr: cat.name_ar,
        nameEn: cat.name_en,
        descriptionAr: cat.description_ar,
        descriptionEn: cat.description_en,
        image: img,
        imageEn: imgEn,
        number: parseInt(cat.number) || 999,
        isHidden: cat.hidden === '1',
        brandId: cat.brand_id,
      }
    });
  }

  // 10. Migrate Category Types
  console.log('\n--- Migrating Category Types ---');
  const catTypes = loadJson('data_category_types.json');
  for (const ct of catTypes) {
    const img = await uploadMedia(ct.image, 'category-types');
    await prisma.categoryType.upsert({
      where: { id: ct.id },
      update: {
        titleAr: ct.title_ar,
        titleEn: ct.title_en,
        descriptionAr: ct.description_ar,
        descriptionEn: ct.description_en,
        image: img,
        number: parseInt(ct.number) || 999,
        isHidden: ct.hidden === '1',
      },
      create: {
        id: ct.id,
        titleAr: ct.title_ar,
        titleEn: ct.title_en,
        descriptionAr: ct.description_ar,
        descriptionEn: ct.description_en,
        image: img,
        number: parseInt(ct.number) || 999,
        isHidden: ct.hidden === '1',
      }
    });
  }

  // 11. CategoryTypeCategory (join table)
  console.log('\n--- Migrating Category Type Categories ---');
  const ctcList = loadJson('data_category_type_categories.json');
  for (const ctc of ctcList) {
    if (!ctc.category_id || !ctc.category_type_id) continue;
    const img = await uploadMedia(ctc.image, 'category-types');
    try {
      await prisma.categoryTypeCategory.upsert({
      where: { categoryId_categoryTypeId: { categoryId: ctc.category_id, categoryTypeId: ctc.category_type_id } },
      update: {
        image: img,
        number: parseInt(ctc.number) || 999,
      },
      create: {
        categoryId: ctc.category_id,
        categoryTypeId: ctc.category_type_id,
        image: img,
        number: parseInt(ctc.number) || 999,
      }
    });
    } catch (err) {
      console.warn('Skipping record due to constraint error');
    }
  }

  // 12. Product Types
  console.log('\n--- Migrating Product Types ---');
  const prodTypes = loadJson('data_types.json');
  for (const pt of prodTypes) {
    await prisma.productType.upsert({
      where: { id: pt.id },
      update: {
        nameAr: pt.name_ar,
        nameEn: pt.name_en,
        number: parseInt(pt.number) || 999,
        brandId: pt.brand_id && pt.brand_id !== '0' ? pt.brand_id : null,
        isHidden: pt.hidden === '1',
      },
      create: {
        id: pt.id,
        nameAr: pt.name_ar,
        nameEn: pt.name_en,
        number: parseInt(pt.number) || 999,
        brandId: pt.brand_id && pt.brand_id !== '0' ? pt.brand_id : null,
        isHidden: pt.hidden === '1',
      }
    });
  }

  // 13. Products
  console.log('\n--- Migrating Products ---');
  const products = loadJson('data_products.json');
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        nameAr: p.name_ar,
        nameEn: p.name_en,
        descriptionAr: p.description_ar,
        descriptionEn: p.description_en,
        color: p.color || '#ffffff',
        number: parseInt(p.number) || 999,
        isHidden: p.hidden === '1',
        typeId: p.type_id && p.type_id !== '0' ? p.type_id : null,
      },
      create: {
        id: p.id,
        nameAr: p.name_ar,
        nameEn: p.name_en,
        descriptionAr: p.description_ar,
        descriptionEn: p.description_en,
        color: p.color || '#ffffff',
        number: parseInt(p.number) || 999,
        isHidden: p.hidden === '1',
        typeId: p.type_id && p.type_id !== '0' ? p.type_id : null,
      }
    });
  }

  // 14. Product Category links
  console.log('\n--- Migrating Category Products ---');
  const catProds = loadJson('data_category_products.json');
  for (const cp of catProds) {
    if (!cp.category_id || !cp.product_id) continue;
    try {
      await prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: cp.category_id, productId: cp.product_id } },
      update: {
        isHidden: cp.hidden === '1',
      },
      create: {
        categoryId: cp.category_id,
        productId: cp.product_id,
        isHidden: cp.hidden === '1',
      }
    });
    } catch (err) {
      console.warn('Skipping record due to constraint error');
    }
  }

  // 15. Product Images
  console.log('\n--- Migrating Product Images ---');
  const prodImgs = loadJson('data_product_images.json');
  await prisma.productImage.deleteMany({});
  for (const pi of prodImgs) {
    if (!pi.product_id) continue;
    const img = await uploadMedia(pi.image, 'products');
    if (img) {
      try {
        await prisma.productImage.create({
          data: {
            productId: pi.product_id,
            url: img,
          }
        });
      } catch (e) {}
    }
  }

  // 16. Banners
  console.log('\n--- Migrating Banners ---');
  const banners = loadJson('data_banners.json');
  for (const b of banners) {
    const img = await uploadMedia(b.image, 'banners');
    const imgEn = await uploadMedia(b.image_en, 'banners');
    const vid = await uploadMedia(b.video_link, 'banners');
    const vidEn = await uploadMedia(b.video_link_en, 'banners');
    const smImg = await uploadMedia(b.small_img, 'banners');
    const smImgEn = await uploadMedia(b.small_img_en, 'banners');
    const smVid = await uploadMedia(b.small_video, 'banners');
    const smVidEn = await uploadMedia(b.small_video_en, 'banners');

    await prisma.banner.upsert({
      where: { id: b.id },
      update: {
        titleAr: b.title_ar || '',
        titleEn: b.title_en || '',
        type: b.type === 'video' ? 'video' : 'image',
        image: img,
        imageEn: imgEn,
        videoLink: vid,
        videoLinkEn: vidEn,
        smallImg: smImg,
        smallImgEn: smImgEn,
        smallVideo: smVid,
        smallVideoEn: smVidEn,
        number: parseInt(b.number) || 999,
        isHidden: b.hidden === '1',
      },
      create: {
        id: b.id,
        titleAr: b.title_ar || '',
        titleEn: b.title_en || '',
        type: b.type === 'video' ? 'video' : 'image',
        image: img,
        imageEn: imgEn,
        videoLink: vid,
        videoLinkEn: vidEn,
        smallImg: smImg,
        smallImgEn: smImgEn,
        smallVideo: smVid,
        smallVideoEn: smVidEn,
        number: parseInt(b.number) || 999,
        isHidden: b.hidden === '1',
      }
    });
  }

  // 17. Certificates
  console.log('\n--- Migrating Certificates ---');
  const certs = loadJson('data_certifications.json');
  for (const c of certs) {
    const img = await uploadMedia(c.image, 'certificates');
    if (!img) continue;
    await prisma.certificate.upsert({
      where: { id: c.id },
      update: {
        image: img,
        isHidden: c.hidden === '1',
      },
      create: {
        id: c.id,
        image: img,
        isHidden: c.hidden === '1',
      }
    });
  }

  // 18. Standards
  console.log('\n--- Migrating Standards ---');
  const standards = loadJson('data_standers.json');
  for (const s of standards) {
    const img = await uploadMedia(s.image, 'standards');
    await prisma.standard.upsert({
      where: { id: s.id },
      update: {
        descriptionAr: s.description_ar || '',
        descriptionEn: s.description_en || '',
        image: img,
        isHidden: s.hidden === '1',
      },
      create: {
        id: s.id,
        descriptionAr: s.description_ar || '',
        descriptionEn: s.description_en || '',
        image: img,
        isHidden: s.hidden === '1',
      }
    });
  }

  // 19. Values
  console.log('\n--- Migrating Values ---');
  const values = loadJson('data_values.json');
  for (const v of values) {
    const img = await uploadMedia(v.image, 'values');
    await prisma.value.upsert({
      where: { id: v.id },
      update: {
        titleAr: v.title_ar,
        titleEn: v.title_en,
        descriptionAr: v.description_ar,
        descriptionEn: v.description_en,
        image: img,
        isHidden: v.hidden === '1',
      },
      create: {
        id: v.id,
        titleAr: v.title_ar,
        titleEn: v.title_en,
        descriptionAr: v.description_ar,
        descriptionEn: v.description_en,
        image: img,
        isHidden: v.hidden === '1',
      }
    });
  }

  // 20. Why Choose Us
  console.log('\n--- Migrating Why Choose Us ---');
  const wcu = loadJson('data_why_chooses.json');
  for (const w of wcu) {
    await prisma.whyChooseUs.upsert({
      where: { id: w.id },
      update: {
        descriptionAr: w.description_ar || '',
        descriptionEn: w.description_en || '',
        isHidden: w.hidden === '1',
      },
      create: {
        id: w.id,
        descriptionAr: w.description_ar || '',
        descriptionEn: w.description_en || '',
        isHidden: w.hidden === '1',
      }
    });
  }

  // 21. Buildings
  console.log('\n--- Migrating Buildings ---');
  const buildings = loadJson('data_buildings.json');
  for (const b of buildings) {
    const img = await uploadMedia(b.image, 'buildings');
    await prisma.building.upsert({
      where: { id: b.id },
      update: {
        titleAr: b.title_ar,
        titleEn: b.title_en,
        descriptionAr: b.description_ar,
        descriptionEn: b.description_en,
        image: img,
        isHidden: b.hidden === '1',
      },
      create: {
        id: b.id,
        titleAr: b.title_ar,
        titleEn: b.title_en,
        descriptionAr: b.description_ar,
        descriptionEn: b.description_en,
        image: img,
        isHidden: b.hidden === '1',
      }
    });
  }

  // 22. Features
  console.log('\n--- Migrating Features ---');
  const features = loadJson('data_features.json');
  for (const f of features) {
    const img = await uploadMedia(f.image, 'features');
    await prisma.feature.upsert({
      where: { id: f.id },
      update: {
        titleAr: f.title_ar,
        titleEn: f.title_en,
        descriptionAr: f.description_ar,
        descriptionEn: f.description_en,
        image: img,
        isHidden: f.hidden === '1',
      },
      create: {
        id: f.id,
        titleAr: f.title_ar,
        titleEn: f.title_en,
        descriptionAr: f.description_ar,
        descriptionEn: f.description_en,
        image: img,
        isHidden: f.hidden === '1',
      }
    });
  }

  // 23. Continents & Countries
  console.log('\n--- Migrating Continents & Countries ---');
  const continents = loadJson('data_continents.json');
  for (const c of continents) {
    await prisma.continent.upsert({
      where: { id: c.id },
      update: {
        nameAr: c.name_ar,
        nameEn: c.name_en,
        isHidden: c.hidden === '1',
      },
      create: {
        id: c.id,
        nameAr: c.name_ar,
        nameEn: c.name_en,
        isHidden: c.hidden === '1',
      }
    });
  }

  const countries = loadJson('data_contiries.json');
  for (const c of countries) {
    await prisma.country.upsert({
      where: { id: c.id },
      update: {
        nameAr: c.name_ar,
        nameEn: c.name_en,
        continentId: c.continent_id,
        isHidden: c.hidden === '1',
      },
      create: {
        id: c.id,
        nameAr: c.name_ar,
        nameEn: c.name_en,
        continentId: c.continent_id,
        isHidden: c.hidden === '1',
      }
    });
  }

  // 24. Contact Requests
  console.log('\n--- Migrating Contact Requests ---');
  const contacts = loadJson('data_contacts.json');
  for (const c of contacts) {
    await prisma.contactRequest.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        message: c.message,
        status: c.status === '1' ? 'READ' : 'UNREAD',
      },
      create: {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        message: c.message,
        status: c.status === '1' ? 'READ' : 'UNREAD',
      }
    });
  }

  // 25. Collaborate Requests
  console.log('\n--- Migrating Collaborate Requests ---');
  const collaborates = loadJson('data_collaborates.json');
  for (const c of collaborates) {
    await prisma.collaborateRequest.upsert({
      where: { id: c.id },
      update: {
        firstName: c.first_name,
        lastName: c.last_name,
        name: c.name,
        email: c.email,
        phone: c.phone,
        message: c.message,
        status: c.status === '1' ? 'READ' : 'UNREAD',
      },
      create: {
        id: c.id,
        firstName: c.first_name,
        lastName: c.last_name,
        name: c.name,
        email: c.email,
        phone: c.phone,
        message: c.message,
        status: c.status === '1' ? 'READ' : 'UNREAD',
      }
    });
  }

  // 26. Socials & Social Parents
  console.log('\n--- Migrating Socials ---');
  const socials = loadJson('data_socials.json');
  for (const s of socials) {
    const img = await uploadMedia(s.image, 'socials');
    await prisma.social.upsert({
      where: { id: s.id },
      update: {
        image: img,
        link: s.link || '',
        isHidden: s.hidden === '1',
      },
      create: {
        id: s.id,
        image: img,
        link: s.link || '',
        isHidden: s.hidden === '1',
      }
    });
  }

  const socialParents = loadJson('data_social_parents.json');
  for (const sp of socialParents) {
    const img = await uploadMedia(sp.image, 'socials');
    if (!img) continue;
    await prisma.socialParent.upsert({
      where: { id: sp.id },
      update: {
        image: img,
      },
      create: {
        id: sp.id,
        image: img,
      }
    });
  }

  // 27. Production Steps
  console.log('\n--- Migrating Production Steps ---');
  const prodSteps = loadJson('data_production_steps.json');
  for (const ps of prodSteps) {
    const img = await uploadMedia(ps.image, 'production-steps');
    await prisma.productionStep.upsert({
      where: { id: ps.id },
      update: {
        textAr: ps.text_ar || '',
        textEn: ps.text_en || '',
        number: parseInt(ps.number) || 999,
        image: img,
        isHidden: ps.hidden === '1',
      },
      create: {
        id: ps.id,
        textAr: ps.text_ar || '',
        textEn: ps.text_en || '',
        number: parseInt(ps.number) || 999,
        image: img,
        isHidden: ps.hidden === '1',
      }
    });
  }

  // 28. Section Texts
  console.log('\n--- Migrating Section Texts ---');
  const sectTexts = loadJson('data_section_texts.json');
  for (const st of sectTexts) {
    await prisma.sectionText.upsert({
      where: { id: st.id },
      update: {
        titleAr: st.title_ar,
        titleEn: st.title_en,
        textAr: st.text_ar,
        textEn: st.text_en,
        number: parseInt(st.number) || 999,
        isHidden: st.hidden === '1',
      },
      create: {
        id: st.id,
        titleAr: st.title_ar,
        titleEn: st.title_en,
        textAr: st.text_ar,
        textEn: st.text_en,
        number: parseInt(st.number) || 999,
        isHidden: st.hidden === '1',
      }
    });
  }

  // 29. Site Settings
  console.log('\n--- Migrating Site Settings ---');
  const siteInfos = loadJson('data_site_infos.json');
  for (const si of siteInfos) {
    if (!si.key) continue;
    await prisma.siteSetting.upsert({
      where: { key: si.key },
      update: {
        valueAr: si.value_ar,
        valueEn: si.value_en,
        description: si.description,
      },
      create: {
        key: si.key,
        valueAr: si.value_ar,
        valueEn: si.value_en,
        description: si.description,
      }
    });
  }

  // 30. Recommended Recipes (Product to Recipe links)
  console.log('\n--- Migrating Recommended Recipes ---');
  const recRecipes = loadJson('data_recommend_recipes.json');
  for (const rr of recRecipes) {
    if (!rr.product_id || !rr.recipe_id) continue;
    // Check if the recipe and product actually exist in our DB
    const pExists = await prisma.product.findUnique({ where: { id: rr.product_id } });
    const rExists = await prisma.recipe.findUnique({ where: { id: rr.recipe_id } });
    if (pExists && rExists) {
      await prisma.recommendedRecipe.upsert({
        where: { productId_recipeId: { productId: rr.product_id, recipeId: rr.recipe_id } },
        update: {},
        create: {
          productId: rr.product_id,
          recipeId: rr.recipe_id,
        }
      });
    }
  }

  console.log('\n--- MIGRATION PROCESS COMPLETE ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
