const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.productionStep.findMany().then(r => console.dir(r, {depth: null})).finally(() => prisma.$disconnect());
