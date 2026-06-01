const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update section texts
  await prisma.sectionText.deleteMany(); // Clear old to ensure correct order
  
  await prisma.sectionText.create({
    data: {
      titleEn: 'Who We Are',
      titleAr: 'من نحن',
      textEn: 'Orouba for Food industry Co. was founded in 1998, with a vision to produce premium quality frozen food products. Our 20,000 square meter factory, equipped with state of the art technology and operated by our skilled engineers, ensures top quality production. Committed to consumer satisfaction, we offer a diverse range of frozen vegetables, fruits, beans, and pre-fried products, made with simple, all natural ingredients.',
      textAr: 'تأسست شركة العروبة لصناعة المواد الغذائية سنة ١٩٩٨، برؤية تهدف للتمييز فى انتاج و ابتكار منتجات غذائية مجمدة عالية الجودة وسريعة الطهى لجميع انحاء العالم. تبلغ مساحة المصنع ٢٠,٠٠٠ متر مربع،وهو مجهز بأحدث التقنيات، تحت إشراف وإدارة فريق من المهندسين والعامليين ذوى الخبرة والكفاءة العالية لضمان انتاج عالى الجودة وفقا للمعايير الدولية. حرصا منا على إرضاء عملائنا والحفاظ على ثقتهم، فإننا نقدم مجموعة كبيرة ومتنوعة من المنتجات الطازجة المجمدة من خضروات، فواكة، بقوليات، حبوب وأيضا فلافل ومنتجات نصف مقلية مجمدة يتم إنتاجها جميعا من مكونات طبيعية دون أى اضافات.',
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
