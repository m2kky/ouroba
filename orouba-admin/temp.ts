import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.standard.findMany().then(res => console.log(res)).finally(() => prisma.$disconnect());
