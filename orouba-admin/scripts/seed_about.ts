import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('Reading about_page.json...');
  const data = JSON.parse(fs.readFileSync('./about_page.json', 'utf8')).result;

  console.log('Seeding SiteSettings...');
  const settings = [
    { key: 'about_image', valueEn: data.siteinfo.about_image, valueAr: data.siteinfo.about_image },
    { key: 'small_about_img', valueEn: data.siteinfo.small_about_img, valueAr: data.siteinfo.small_about_img },
    { key: 'quotation_en', valueEn: data.siteinfo.quotation_en, valueAr: data.siteinfo.quotation_en },
    { key: 'quotation_ar', valueEn: data.siteinfo.quotation_ar, valueAr: data.siteinfo.quotation_ar },
    { key: 'how_we_are_en', valueEn: data.siteinfo.how_we_are_en, valueAr: data.siteinfo.how_we_are_en },
    { key: 'how_we_are_ar', valueEn: data.siteinfo.how_we_are_ar, valueAr: data.siteinfo.how_we_are_ar },
    { key: 'production_steps_en', valueEn: data.siteinfo.production_steps_en, valueAr: data.siteinfo.production_steps_en },
    { key: 'production_steps_ar', valueEn: data.siteinfo.production_steps_ar, valueAr: data.siteinfo.production_steps_ar },
  ];

  for (const s of settings) {
    if (s.valueEn || s.valueAr) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { valueEn: s.valueEn, valueAr: s.valueAr },
        create: { key: s.key, valueEn: s.valueEn, valueAr: s.valueAr },
      });
    }
  }

  console.log('Seeding Buildings...');
  await prisma.building.deleteMany();
  for (const b of data.buildings) {
    await prisma.building.create({
      data: {
        titleEn: b.title_en,
        titleAr: b.title_ar,
        descriptionEn: b.description_en,
        descriptionAr: b.description_ar,
        image: b.image,
      }
    });
  }

  console.log('Seeding Features...');
  await prisma.feature.deleteMany();
  for (const f of data.features) {
    await prisma.feature.create({
      data: {
        titleEn: f.title_en,
        titleAr: f.title_ar,
        descriptionEn: f.description_en,
        descriptionAr: f.description_ar,
        image: f.image,
      }
    });
  }

  console.log('Seeding SectionTexts...');
  await prisma.sectionText.deleteMany();
  for (const s of data.section_texts) {
    await prisma.sectionText.create({
      data: {
        titleEn: s.title_en,
        titleAr: s.title_ar,
        textEn: s.text_en,
        textAr: s.text_ar,
        number: s.number,
      }
    });
  }

  console.log('Seeding ProductionSteps...');
  await prisma.productionStep.deleteMany();
  for (const p of data.productionSteps) {
    await prisma.productionStep.create({
      data: {
        textEn: p.text_en,
        textAr: p.text_ar,
        number: p.number,
        image: p.image,
      }
    });
  }

  console.log('Done seeding about page data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
