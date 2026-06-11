import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Delete existing to avoid duplicates
    await prisma.whyChooseUs.deleteMany();

    const items = [
        { descriptionAr: 'بيئة عمل ديناميكية', descriptionEn: 'Dynamic Work Environment' },
        { descriptionAr: 'فوائد تنافسية', descriptionEn: 'Competitive Benefits' },
        { descriptionAr: 'التطوير الوظيفي', descriptionEn: 'Career Development' },
        { descriptionAr: 'احداث فرق', descriptionEn: 'Make a Difference' },
        { descriptionAr: 'فرص النمو', descriptionEn: 'Opportunities for Growth' },
        { descriptionAr: 'تحديات مليئة بالابتكار والإبداع', descriptionEn: 'Innovation and Creativity Challenges' }
    ];

    for (const item of items) {
        await prisma.whyChooseUs.create({
            data: {
                descriptionAr: item.descriptionAr,
                descriptionEn: item.descriptionEn,
                isHidden: false
            }
        });
    }

    console.log("Successfully seeded Why Choose Us items");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
