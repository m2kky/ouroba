import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedChatMenu() {
  console.log("🌱 Seeding chat menu items...");

  // Clear existing
  await prisma.chatMenuItem.deleteMany();

  // Top-level categories
  const about = await prisma.chatMenuItem.create({
    data: { labelAr: "عن الشركة", labelEn: "About Us", icon: "🏭", number: 1 },
  });

  const products = await prisma.chatMenuItem.create({
    data: { labelAr: "منتجاتنا", labelEn: "Our Products", icon: "📦", number: 2 },
  });

  await prisma.chatMenuItem.create({
    data: { labelAr: "الوصفات", labelEn: "Recipes", icon: "🍳", linkUrl: "/recipes/ar", number: 3 },
  });

  await prisma.chatMenuItem.create({
    data: { labelAr: "التصدير", labelEn: "Export", icon: "🌍", linkUrl: "/export", number: 4 },
  });

  await prisma.chatMenuItem.create({
    data: { labelAr: "تواصل معنا", labelEn: "Contact Us", icon: "📞", linkUrl: "/contact", number: 5 },
  });

  await prisma.chatMenuItem.create({
    data: { labelAr: "الوظائف", labelEn: "Careers", icon: "💼", linkUrl: "/careers", number: 6 },
  });

  // Sub-items for "About"
  await prisma.chatMenuItem.createMany({
    data: [
      { labelAr: "من نحن", labelEn: "Who We Are", linkUrl: "/about/whoWeAre", parentId: about.id, number: 1 },
      { labelAr: "الشهادات", labelEn: "Certifications", linkUrl: "/about/certifications/ar", parentId: about.id, number: 2 },
    ],
  });

  // Sub-items for "Products"
  await prisma.chatMenuItem.createMany({
    data: [
      { labelAr: "بسمة", labelEn: "Basma", linkUrl: "/brands/5/ar", parentId: products.id, number: 1 },
      { labelAr: "فريدة", labelEn: "Farida", linkUrl: "/brands/7/ar", parentId: products.id, number: 2 },
      { labelAr: "بابيتس", labelEn: "Babits", linkUrl: "/brands/8/ar", parentId: products.id, number: 3 },
    ],
  });

  console.log("✅ Chat menu seeded successfully!");
}

seedChatMenu()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
