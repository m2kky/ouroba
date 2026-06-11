import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Level -> "المستوى"
    await prisma.recipeProperty.updateMany({
        where: {
            titleEn: 'Level'
        },
        data: {
            titleAr: 'المستوى'
        }
    });

    // 2. Prep Time -> "وقت الاعداد"
    await prisma.recipeProperty.updateMany({
        where: {
            titleEn: 'Prep Time'
        },
        data: {
            titleAr: 'وقت الاعداد'
        }
    });

    // 3. Cooking Time -> "وقت الطبخ"
    await prisma.recipeProperty.updateMany({
        where: {
            titleEn: 'Cooking Time'
        },
        data: {
            titleAr: 'وقت الطبخ'
        }
    });

    // 4. Serving -> "عدد الأفراد"
    await prisma.recipeProperty.updateMany({
        where: {
            titleEn: 'Serving'
        },
        data: {
            titleAr: 'عدد الأفراد'
        }
    });

    console.log("Updated all recipe properties in DB!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
