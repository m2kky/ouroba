import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const typesToOrder = [
        { nameAr: 'الفواكة المجمدة', order: 1 },
        { nameAr: 'الفواكه المجمدة', order: 1 }, // just in case
        { nameAr: 'النصف مقلي', order: 2 },
        { nameAr: 'نصف مقلي', order: 2 }, // just in case
        { nameAr: 'الخضروات المجمدة', order: 3 },
        { nameAr: 'البقوليات والحبوب المجمدة', order: 4 },
        { nameAr: 'البقوليات المجمدة', order: 4 } // just in case
    ];

    const allTypes = await prisma.productType.findMany();
    console.log("Found product types:", allTypes.map(t => t.nameAr));

    for (const target of typesToOrder) {
        const type = allTypes.find(t => t.nameAr.includes(target.nameAr) || target.nameAr.includes(t.nameAr));
        if (type) {
            await prisma.productType.update({
                where: { id: type.id },
                data: { number: target.order }
            });
            console.log(`Updated ${type.nameAr} to order ${target.order}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
