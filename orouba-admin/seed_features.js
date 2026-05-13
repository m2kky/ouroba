const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.feature.deleteMany();

  const featureImages = [
    'https://camp-coding.site/eloroba/storage/app/images/0e9Yy5j3FdbU0DFTOXTWgrIeSaDRtunarfPxFmPh.png',
    'https://camp-coding.site/eloroba/storage/app/images/vGmUdMMJnlqBDY7kiOhfibwQDMUjWlG019c6Z7hZ.png',
    'https://camp-coding.site/eloroba/storage/app/images/4d4nAa9sK4dB1xOtha56c8VIpjO3sxyWxfJtv3n6.png',
    'https://camp-coding.site/eloroba/storage/app/images/YFrh6569OO6wE3mYThl0q1bb7L5zJqDOhoViwi71.png',
    'https://camp-coding.site/eloroba/storage/app/images/dcqw4l4DMEZsoL3P4rLPzBqJPGRIstkT5BdxiabT.png'
  ];

  await prisma.feature.create({
    data: {
      titleEn: 'Area',
      titleAr: 'المساحة',
      descriptionEn: 'The total area of our factory is more than 20,000 square meters.',
      descriptionAr: 'تبلغ المساحة الإجمالية لمصنعنا أكثر من ٢٠,٠٠٠ متر مربع.',
      image: featureImages[0]
    }
  });

  await prisma.feature.create({
    data: {
      titleEn: 'Employees',
      titleAr: 'الموظفون',
      descriptionEn: 'More than 700 dedicated employees contribute to our company success.',
      descriptionAr: 'أكثر من ٧٠٠ موظف متخصص يساهمون في نجاح شركتنا.',
      image: featureImages[1]
    }
  });

  await prisma.feature.create({
    data: {
      titleEn: 'Capacity',
      titleAr: 'السعة',
      descriptionEn: 'Our production volume of IQF frozen vegetables is about 25,000 tons annually.',
      descriptionAr: 'يبلغ حجم انتاجنا من الخضروات المجمدة تجميدا سريعا IQF حوالى ٢٥٠٠٠ طن سنويا.',
      image: featureImages[2]
    }
  });

  await prisma.feature.create({
    data: {
      titleEn: 'Half-Cooked Storage',
      titleAr: 'السعة التخزينية للمنتجات النصف مطهية',
      descriptionEn: 'Our storage capacity for half-cooked products is about 1,800 tons annually.',
      descriptionAr: 'تبلغ سعتنا التخزينية للمنتجات االنصف مطهية حوالي ١٨٠٠ طن سنويًا.',
      image: featureImages[3]
    }
  });

  await prisma.feature.create({
    data: {
      titleEn: 'Total Cold Storage',
      titleAr: 'السعة الإجمالية لمخازن التبريد',
      descriptionEn: 'Our cold storage capacity is 10,000 tons annually, 5,000 square meters.',
      descriptionAr: 'تبلغ سعة التخزين البارد لدينا ١٠٠٠٠ طن سنويًا، ٥٠٠٠ متر مربع.',
      image: featureImages[4]
    }
  });

  console.log("5 features seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
