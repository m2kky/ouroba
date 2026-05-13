const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSetting.findMany();
  console.log("Settings:");
  settings.filter(s => s.key.includes('image') || s.key.includes('img')).forEach(s => console.log(s.key, s.valueEn, s.valueAr));
  
  const buildings = await prisma.building.findMany();
  console.log("\nBuildings:");
  buildings.forEach(b => console.log(b.titleEn, b.image));

  const features = await prisma.feature.findMany();
  console.log("\nFeatures:");
  features.forEach(f => console.log(f.titleEn, f.image));

  const steps = await prisma.productionStep.findMany();
  console.log("\nProduction Steps:");
  steps.forEach(s => console.log(s.id, s.image));
}

main().catch(console.error).finally(() => prisma.$disconnect());
