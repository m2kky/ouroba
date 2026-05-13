import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.standard.deleteMany({});
  
  await prisma.standard.create({
    data: {
      descriptionEn: 'Products are frozen during manufacturing using IQF fast freezing tunnels and stored in freezing rooms at (-18°C) zero Fahrenheit.',
      descriptionAr: 'يتم تجميد المنتجات اثناء التصنيع على انفاق تجميد سريعة IQF تخزن المنتجات في غرف التجميد عند (-١٨ درجة مئوية) صفر فهرنهايت.',
      image: '/3nq19YDPThQSGLb0sOWTIA8uuDqf1ZT5ac9UmVPn.png',
      isHidden: false
    }
  });

  await prisma.standard.create({
    data: {
      descriptionEn: 'All products undergo a selection and analysis process; choosing only the best high-quality fresh produce.',
      descriptionAr: 'تخضع جميع المنتجات لعملية انتقاء وتحليل؛ حيث يتم اختيار أفضل المنتجات الطازجة وعالية الجودة فقط.',
      image: '/MEOFLDVy7A38ucOwWmYJQizRa4M6R34dRZIv7Wy9.png',
      isHidden: false
    }
  });

  await prisma.standard.create({
    data: {
      descriptionEn: 'All products are free from any preservatives or chemical substances.',
      descriptionAr: 'جميع المنتجات خالية من أي مواد حافظة أو مواد كيماوية.',
      image: '/cPJEb5JaiuY0RT3yxSS1O3i7Bvr5EGMf7xER1WBy.png',
      isHidden: false
    }
  });

  console.log("Standards recreated with exact text and images!");
}

main().finally(() => prisma.$disconnect());
