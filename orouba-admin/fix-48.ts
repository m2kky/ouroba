import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const r = await prisma.recipe.findUnique({where:{id:'48'}});
  if (!r) return;
  
  const newAr = `المكونات:\n- كيس ملوخية خضراء مخروطة مجمدة\n- مكعب ثوم مفروم مجمد\n- كزبرة ناشفة\n- شوربة\n- زبدة\n\nالخطوات:\n` + r.descriptionAr;
  const newEn = `Ingredients:\n- 1 pack frozen minced green molokhia\n- Frozen crushed garlic cube\n- Ground coriander\n- Broth\n- Butter\n\nSteps:\n` + r.descriptionEn;

  await prisma.recipe.update({
    where: { id: '48' },
    data: {
      descriptionAr: newAr,
      descriptionEn: newEn
    }
  });
  console.log('Updated 48');
}

main().catch(console.error).finally(() => prisma.$disconnect());
