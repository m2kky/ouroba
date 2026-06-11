import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const typesToOrder = [
        { nameAr: 'الفواكة المجمدة', order: 1 },
        { nameAr: 'النصف مقلي', order: 2 },
        { nameAr: 'الخضروات المجمدة', order: 3 },
        { nameAr: 'البقوليات والحبوب المجمدة', order: 4 }
    ];

    const allTypes = await prisma.categoryType.findMany();

    for (const target of typesToOrder) {
        const type = allTypes.find(t => t.titleAr === target.nameAr);
        if (type) {
            await prisma.categoryType.update({
                where: { id: type.id },
                data: { number: target.order }
            });
            console.log(`Updated ${type.titleAr} to order ${target.order}`);
        } else {
            console.log(`Could not find ${target.nameAr}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
