const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newQuote = 'بعض الخطوات تتم لأنواع محددة فقط، مثل: فصل الحجم حسب الدرجات للبامية. الفرم والتصفية للطماطم. التقطيع لبعض المنتجات. بشر وفرم بعض المنتجات مثل البصل والثوم';
  
  await prisma.siteSetting.upsert({
    where: { key: 'quotation' },
    update: { valueAr: newQuote, valueEn: newQuote },
    create: { key: 'quotation', valueAr: newQuote, valueEn: newQuote }
  });
  
  await prisma.siteSetting.upsert({
    where: { key: 'quotation_ar' },
    update: { valueAr: newQuote, valueEn: newQuote },
    create: { key: 'quotation_ar', valueAr: newQuote, valueEn: newQuote }
  });

  console.log("Quotation updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
