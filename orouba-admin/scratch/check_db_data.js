const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- BUILDINGS ---");
  const buildings = await prisma.building.findMany();
  console.log(JSON.stringify(buildings, null, 2));

  console.log("--- FEATURES ---");
  const features = await prisma.feature.findMany();
  console.log(JSON.stringify(features, null, 2));

  console.log("--- PRODUCTION STEPS ---");
  const steps = await prisma.productionStep.findMany();
  console.log(JSON.stringify(steps, null, 2));

  console.log("--- SITE SETTINGS ---");
  const settings = await prisma.siteSetting.findMany();
  console.log(JSON.stringify(settings, null, 2));

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
