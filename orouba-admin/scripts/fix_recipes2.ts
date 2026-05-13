import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.recipe.count();
  if (count < 3) {
    await prisma.recipe.create({
      data: {
        nameEn: 'Delicious Spinach Pasta',
        nameAr: 'مكرونة السبانخ اللذيذة',
        internalImage: 'https://camp-coding.site/eloroba/storage/app/images/GTqYDNVWPuIlNYMzniHuxRmdwslPpj0W9bjhRGAI.png',
        descriptionEn: 'Amazing recipe for a healthy meal.',
        descriptionAr: 'وصفة رائعة لوجبة صحية ومفيدة.'
      }
    });
    
    await prisma.recipe.create({
      data: {
        nameEn: 'Golden French Fries',
        nameAr: 'بطاطس مقلية ذهبية ومقرمشة',
        internalImage: 'https://camp-coding.site/eloroba/storage/app/images/icIeuiVnOAuVtHTPzWDN8D16X8aLOQ7wpGZoRIOD.png',
        descriptionEn: 'Crispy and golden french fries.',
        descriptionAr: 'بطاطس مقلية مقرمشة وذهبية.'
      }
    });
  }
  console.log("Recipes added!");
}

main().finally(() => prisma.$disconnect());
