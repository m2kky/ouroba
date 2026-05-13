const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Set about_image
  const aboutImgUrl = 'https://camp-coding.site/eloroba/storage/app/images/pZHaEck6Myx1R5XKJTICq0AZFn15lMRTC6kT1Yp0.png';
  
  await prisma.siteSetting.upsert({
    where: { key: 'about_image' },
    update: { valueEn: aboutImgUrl, valueAr: aboutImgUrl },
    create: { key: 'about_image', valueEn: aboutImgUrl, valueAr: aboutImgUrl }
  });

  // 2. Remove building images
  await prisma.building.updateMany({
    data: { image: '' }
  });

  // 3. Update features
  const featureImages = [
    'https://camp-coding.site/eloroba/storage/app/images/0e9Yy5j3FdbU0DFTOXTWgrIeSaDRtunarfPxFmPh.png',
    'https://camp-coding.site/eloroba/storage/app/images/vGmUdMMJnlqBDY7kiOhfibwQDMUjWlG019c6Z7hZ.png',
    'https://camp-coding.site/eloroba/storage/app/images/4d4nAa9sK4dB1xOtha56c8VIpjO3sxyWxfJtv3n6.png',
    'https://camp-coding.site/eloroba/storage/app/images/YFrh6569OO6wE3mYThl0q1bb7L5zJqDOhoViwi71.png'
  ];

  const existingFeatures = await prisma.feature.findMany({ orderBy: { createdAt: 'asc' } });
  
  for (let i = 0; i < existingFeatures.length; i++) {
    if (featureImages[i]) {
      await prisma.feature.update({
        where: { id: existingFeatures[i].id },
        data: { image: featureImages[i] }
      });
    }
  }

  if (existingFeatures.length < 4) {
      await prisma.feature.create({
          data: {
              titleEn: 'Total Cold Storage',
              titleAr: 'السعة الإجمالية لمخازن التبريد',
              descriptionEn: 'Cold storage capacity',
              descriptionAr: 'تبلغ سعة التخزين البارد لدينا 10000 طن سنوياً',
              image: featureImages[2]
          }
      });
      await prisma.feature.create({
          data: {
              titleEn: 'Half-Cooked Storage',
              titleAr: 'السعة التخزينية للمنتجات النصف مطهية',
              descriptionEn: 'Storage for half-cooked products',
              descriptionAr: 'تبلغ سعتنا التخزينية للمنتجات النصف مطهية 1800 طن سنوياً',
              image: featureImages[3]
          }
      });
  }

  // 4. Update production steps
  const stepImages = [
    'https://camp-coding.site/eloroba/storage/app/images/5tz9Goi65jI0n7knjNHANWIqZFSsTprXkUjtQk2n.jpg',
    'https://camp-coding.site/eloroba/storage/app/images/ME5PsY3BANJYZ2lXAeWT3EvMyEayD7JXEDe3MTLs.jpg',
    'https://camp-coding.site/eloroba/storage/app/images/GZYwpePjLVTL8N0joypNaPT376VWeDKb1U8PJp5w.png',
    'https://camp-coding.site/eloroba/storage/app/images/yKuNkoSWTgZnprvyxjZkUQgo83ezeMSvJQcPfqBV.jpg',
    'https://camp-coding.site/eloroba/storage/app/images/WofP00IOLY9fy5xHjywcHewnDHXCKRqMfIXPwBra.jpg',
    'https://camp-coding.site/eloroba/storage/app/images/vm0x6DYiCFTgbVkAekwe2SBVAyMnx1MrvLAziapn.png'
  ];

  const existingSteps = await prisma.productionStep.findMany({ orderBy: { createdAt: 'asc' } });
  
  for (let i = 0; i < existingSteps.length; i++) {
    if (stepImages[i]) {
      await prisma.productionStep.update({
        where: { id: existingSteps[i].id },
        data: { image: stepImages[i] }
      });
    }
  }

  console.log("Database seeded successfully with official images!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
