import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedChatMenu() {
  console.log("🌱 Seeding chat menu items...");

  // Clear existing
  await prisma.chatMenuItem.deleteMany();

  // Useful, unique items — NOT duplicating the navbar
  const faq = await prisma.chatMenuItem.create({
    data: { labelAr: "أسئلة شائعة", labelEn: "FAQ", icon: "❓", number: 1 },
  });

  const inquiry = await prisma.chatMenuItem.create({
    data: { labelAr: "استفسارات الأعمال", labelEn: "Business Inquiries", icon: "🤝", number: 2 },
  });

  await prisma.chatMenuItem.create({
    data: { labelAr: "تحميل الكتالوج", labelEn: "Download Catalog", icon: "📥", linkUrl: "/export-catalog", number: 3 },
  });

  await prisma.chatMenuItem.create({
    data: { labelAr: "طلب عينة منتج", labelEn: "Request a Sample", icon: "📦", linkUrl: "/contact", number: 4 },
  });

  await prisma.chatMenuItem.create({
    data: { labelAr: "شهادات الجودة", labelEn: "Quality Certifications", icon: "🏅", linkUrl: "/about/certifications/ar", number: 5 },
  });

  // Sub-items for FAQ
  await prisma.chatMenuItem.createMany({
    data: [
      { labelAr: "هل المنتجات خالية من المواد الحافظة؟", labelEn: "Are products preservative-free?", parentId: faq.id, number: 1 },
      { labelAr: "ما هي مدة صلاحية المنتجات؟", labelEn: "What is the shelf life?", parentId: faq.id, number: 2 },
      { labelAr: "هل تصدرون لدول الخليج؟", labelEn: "Do you export to the Gulf?", linkUrl: "/export", parentId: faq.id, number: 3 },
    ],
  });

  // Sub-items for Business Inquiries
  await prisma.chatMenuItem.createMany({
    data: [
      { labelAr: "أريد أن أصبح موزع", labelEn: "Become a Distributor", linkUrl: "/contact", parentId: inquiry.id, number: 1 },
      { labelAr: "استفسار تصدير", labelEn: "Export Inquiry", linkUrl: "/export", parentId: inquiry.id, number: 2 },
      { labelAr: "تواصل مع المبيعات", labelEn: "Contact Sales", linkUrl: "/contact", parentId: inquiry.id, number: 3 },
    ],
  });

  console.log("✅ Chat menu seeded with useful content!");
}

seedChatMenu()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
