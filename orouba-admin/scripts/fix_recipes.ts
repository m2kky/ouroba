import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.recipe.updateMany({
    data: {
      internalImage: 'https://camp-coding.site/eloroba/storage/app/images/wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.png'
    }
  });

  // Create 2 more dummy recipes for testing if less than 3
  const count = await prisma.recipe.count();
  if (count < 3) {
    await prisma.recipe.create({
      data: {
        nameEn: 'Delicious Spinach Pasta',
        nameAr: 'مكرونة السبانخ اللذيذة',
        internalImage: 'https://camp-coding.site/eloroba/storage/app/images/1.jpg',
        descriptionEn: 'Amazing recipe',
        descriptionAr: 'وصفة رائعة',
        ingredientsEn: 'Pasta, Spinach',
        ingredientsAr: 'مكرونة، سبانخ',
        stepsEn: 'Boil, Mix',
        stepsAr: 'اغلي، اخلط',
        cookingTime: '20 mins',
        difficulty: 'Easy'
      }
    });
    
    await prisma.recipe.create({
      data: {
        nameEn: 'Golden French Fries',
        nameAr: 'بطاطس مقلية ذهبية',
        internalImage: 'https://camp-coding.site/eloroba/storage/app/images/icIeuiVnOAuVtHTPzWDN8D16X8aLOQ7wpGZoRIOD.png',
        descriptionEn: 'Crispy fries',
        descriptionAr: 'بطاطس مقرمشة',
        ingredientsEn: 'Potatoes, Oil',
        ingredientsAr: 'بطاطس، زيت',
        stepsEn: 'Fry',
        stepsAr: 'اقلي',
        cookingTime: '15 mins',
        difficulty: 'Easy'
      }
    });
  }
}

main().finally(() => prisma.$disconnect());
