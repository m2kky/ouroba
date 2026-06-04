const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const translations = {
  1: "<strong>1- Reception, Inspection & Selection:</strong> We carefully select fresh vegetables and ensure their ripeness so they are tender and delicious. Selection processes vary depending on the nature of the products.",
  2: "<strong>2- Sorting & Washing:</strong> Vegetables and fruits undergo precise sorting to ensure they are free from defects. Then they undergo a washing process to obtain the clean products we offer.",
  3: "<strong>3- Blanching:</strong> The blanching time depends on the type of vegetable.",
  4: "<strong>4- Cooling:</strong> This is a preparatory stage for the IQF rapid freezing process. It is done immediately after blanching.",
  5: "<strong>5- Freezing:</strong> The IQF rapid freezing process ensures the preservation of the product's characteristics and nutritional elements.",
  6: "<strong>6- Packing & Packaging:</strong> The products undergo multiple packing processes."
};

async function main() {
  const steps = await prisma.productionStep.findMany();
  
  for (const step of steps) {
    if (translations[step.number]) {
      await prisma.productionStep.update({
        where: { id: step.id },
        data: { textEn: translations[step.number] }
      });
      console.log(`Updated step ${step.number} English text.`);
    }
  }
  
  console.log("All English texts updated!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
