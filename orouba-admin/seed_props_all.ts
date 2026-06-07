import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultProperties = [
  {
    icon: 'https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/recipe-properties/1779202646990-kmpfbgg3yc-vASMgmooMcevMbx0cedEwjsAzE6PqdK8pVMXJtSv.webp',
    titleEn: 'Level',
    titleAr: 'المستوى',
    textEn: 'Easy',
    textAr: 'سهل'
  },
  {
    icon: 'https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/recipe-properties/1779202647488-wqgdwknjskj-mPuVnuAMdfRCmRzIdbmbeBg6loiBnkLDrHbjcsBK.webp',
    titleEn: 'Prep Time',
    titleAr: 'وقت التحضير',
    textEn: '15 Min',
    textAr: '15 دقيقة'
  },
  {
    icon: 'https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/recipe-properties/1779202647915-aftmsem5xq-yoHXxqQDXVie0MhfcWzYqkxyatlCmsNamWhUcQcC.webp',
    titleEn: 'Cooking Time',
    titleAr: 'وقت الطبخ',
    textEn: '20 Min',
    textAr: '20 دقيقة'
  },
  {
    icon: 'https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/recipe-properties/1779202648395-orgxpacbo1-MU86cCACF7WCU5NwZQVFScIvXacdkn9JG7cYhOfI.webp',
    titleEn: 'Serving',
    titleAr: 'عدد الافراد',
    textEn: '4',
    textAr: '4'
  }
];

async function seedProps() {
  const recipes = await prisma.recipe.findMany({
    include: { properties: true }
  });

  let totalAdded = 0;

  for (const recipe of recipes) {
    const existingTitles = recipe.properties.map(p => p.titleEn.toLowerCase());

    for (const prop of defaultProperties) {
      if (!existingTitles.includes(prop.titleEn.toLowerCase())) {
        await prisma.recipeProperty.create({
          data: {
            recipeId: recipe.id,
            ...prop
          }
        });
        totalAdded++;
      }
    }
  }

  console.log(`Added ${totalAdded} missing properties across all recipes.`);
}

seedProps()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
