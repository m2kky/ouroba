const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.feature.findMany().then(r => console.log("Features:", r)).catch(console.error).finally(() => prisma.$disconnect());
