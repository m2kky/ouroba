import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const standards = await prisma.standard.findMany();
  if (standards.length >= 2) {
    await prisma.standard.update({
      where: { id: standards[0].id },
      data: { image: '/standards/1778580187337-mzp2hbvfvyl-MEOFLDVy7A38ucOwWmYJQizRa4M6R34dRZIv7Wy9.png' }
    });
    await prisma.standard.update({
      where: { id: standards[1].id },
      data: { image: '/standards/1778580197070-lciotwt94j-cPJEb5JaiuY0RT3yxSS1O3i7Bvr5EGMf7xER1WBy.png' }
    });
    console.log("Updated standard images!");
  }
}

main().finally(() => prisma.$disconnect());
