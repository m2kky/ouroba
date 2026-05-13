import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.categoryType.updateMany({
    where: { titleEn: 'Products' },
    data: { image: 'https://camp-coding.site/eloroba/storage/app/images/icIeuiVnOAuVtHTPzWDN8D16X8aLOQ7wpGZoRIOD.png' }
  });
  
  await prisma.categoryType.updateMany({
    where: { titleEn: 'By Cooking Method' },
    data: { image: 'https://camp-coding.site/eloroba/storage/app/images/GTqYDNVWPuIlNYMzniHuxRmdwslPpj0W9bjhRGAI.png' }
  });
  
  console.log("Updated images successfully!");
}

main().finally(() => prisma.$disconnect());
