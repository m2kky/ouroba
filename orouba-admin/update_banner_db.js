const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const banners = await prisma.banner.findMany({ where: { isHidden: false }, orderBy: { number: 'asc' } });
  
  if (banners.length > 0) {
    const banner = banners[0];
    await prisma.banner.update({
      where: { id: banner.id },
      data: {
        videoLinkEn: 'https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/1_en.mp4'
      }
    });
    console.log('Updated banner videoLinkEn to 1_en.mp4 for banner id:', banner.id);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
