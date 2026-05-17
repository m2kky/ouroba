import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { number: 1, nameAr: 'أطباق رئيسية', nameEn: 'Main Dish' },
  { number: 11, nameAr: 'حساء', nameEn: 'Soup' },
  { number: 11, nameAr: 'مقبلات', nameEn: 'Appetizers' },
  { number: 11, nameAr: 'سلطات', nameEn: 'Salad' },
  { number: 11, nameAr: 'إيرفراير', nameEn: 'Airfryer' },
  { number: 11, nameAr: 'إفطار', nameEn: 'Break Fast' },
  { number: 11, nameAr: 'حلويات', nameEn: 'dessert' },
  { number: 11, nameAr: 'مشروبات', nameEn: 'Drinks' },
];

async function main() {
  for (const cat of categories) {
    const existing = await prisma.recipeCategory.findFirst({
      where: {
        OR: [
          { nameEn: cat.nameEn },
          { nameAr: cat.nameAr }
        ]
      }
    });

    if (existing) {
      console.log(`✅ موجود: ${cat.nameEn} / ${cat.nameAr}`);
      if (existing.number !== cat.number) {
        await prisma.recipeCategory.update({
          where: { id: existing.id },
          data: { number: cat.number }
        });
        console.log(`   -> 🔄 حدثنا الترتيب لـ ${cat.number}`);
      }
    } else {
      await prisma.recipeCategory.create({
        data: {
          nameEn: cat.nameEn,
          nameAr: cat.nameAr,
          number: cat.number
        }
      });
      console.log(`✨ ضفنا صنف جديد: ${cat.nameEn} / ${cat.nameAr}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
