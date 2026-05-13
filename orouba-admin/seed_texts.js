const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update section texts
  await prisma.sectionText.deleteMany(); // Clear old to ensure correct order
  
  await prisma.sectionText.create({
    data: {
      titleEn: 'Who We Are',
      titleAr: 'من نحن',
      textEn: 'Since we started in 1998 until now, Orouba natural and healthy products of high quality are considered among the most important basic and favorite elements in the Egyptian kitchen...',
      textAr: 'منذ أن بدأنا سنة ١٩٩٨ وحتى الآن، تعتبر منتجات العروبة الطبيعية والصحية عالية الجودة من أهم العناصر الأساسية والمفضلة في المطبخ المصري. إبتكاراتنا المستمرة تلهم الابداع فى الطهى حول العالم. شغفنا بالطعام وإيماننا بأنه وسيلة لجمع الأسرة والأصدقاء، جعلنا نحرص دائماً على تحويل الوجبات اليومية إلى تجارب ممتعة ونشر السعادة مع كل مذاق لذيذ. شاركنا في بث السعادة في مطبخك.',
    }
  });

  await prisma.sectionText.create({
    data: {
      titleEn: 'Our Goal',
      titleAr: 'هدفنا',
      textEn: 'Believing that food is a way to bring people together, we offer a wide and diverse range of fresh frozen products...',
      textAr: 'إيمانا منا بأن الطعام وسيلة لجمع الناس معا، نقدم مجموعة كبيرة ومتنوعة من المنتجات الطازجة المجمدة من خضروات وفواكة وبقوليات وحبوب وفلافل ومقبلات لذيذة تجعل تجربة إعداد الطعام سهلة، سريعة و ممتعة. نحن نبتكردائما لتقديم خيارات جديدة مختلفة من مكونات بسيطة وطبيعية بالكامل. هدفنا هو نشر البهجة والمتعة مع كل وجبة ومساعدتك على مشاركة سحر الطعام مع أحبائك.',
    }
  });

  await prisma.sectionText.create({
    data: {
      titleEn: 'Our Factory',
      titleAr: 'مصنعنا',
      textEn: 'The factory was established on a total area of 20,000 square meters in the First Industrial Zone - Obour Industrial City, and the factory consists of the following facilities:',
      textAr: 'تم إنشاء المصنع على مساحة إجمالية تبلغ ٢٠,٠٠٠ متر مربع في المنطقة الصناعية الأولى - مدينة العبور الصناعية، ويتكون المصنع من المرافق التالية:',
    }
  });

  // Update buildings text
  await prisma.building.deleteMany();

  await prisma.building.create({
    data: {
      titleEn: 'Building A',
      titleAr: 'مبنى أ',
      descriptionEn: 'An administrative building consisting of three floors to host all factory departments.',
      descriptionAr: 'مبنى إداري يتكون من ثلاثة طوابق ليستضيف كافة أقسام المصنع.',
      image: ''
    }
  });

  await prisma.building.create({
    data: {
      titleEn: 'Building B',
      titleAr: 'مبنى ب',
      descriptionEn: 'The factory building consists of two floors, the ground floor for receiving and preparing raw materials. A set of conveyors and lifting pumps to raise raw materials to the next floor for manufacturing.',
      descriptionAr: 'مبنى المصنع مكون من طابقين، الدور الأرضي لاستقبال تجهيز المواد الخام. مجموعة من السيور ومضخات الرفع لرفع المواد الخام إلى الطابق التالي لتصنيعها.',
      image: ''
    }
  });

  console.log("Texts updated successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
