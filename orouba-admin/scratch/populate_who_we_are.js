const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning old who we are data...");
  await prisma.building.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.productionStep.deleteMany();
  await prisma.sectionText.deleteMany();

  console.log("Inserting Buildings...");
  await prisma.building.createMany({
    data: [
      {
        titleAr: "مبنى أ",
        titleEn: "building A",
        descriptionAr: "مبنى إداري يتكون من ثلاثة طوابق ليستضيف كافة أقسام المصنع.",
        descriptionEn: "Administrative building comprising three floors to host all the factory departments.",
        image: "https://camp-coding.site/eloroba/storage/app/images/8i67NCFvZYWRKodPyfmWsvSSSyy4LDjV2ODGurIS.png"
      },
      {
        titleAr: "مبنى ب",
        titleEn: "building B",
        descriptionAr: "مبنى المصنع مكون من طابقين، الدور الأرضي لاستقبال تجهيز المواد الخام. مجموعة من السيور ومضخات الرفع لرفع المواد الخام إلى الطابق التالي لتصنيعها.",
        descriptionEn: "Factory building comprising two floors The ground floor for raw materials receiving and preparation. group of belts and lift pumps uplifts the raw materials to the following floor for processing..",
        image: "https://camp-coding.site/eloroba/storage/app/images/8JqKWNdDhrMk9kXaClFvz9fXGTuokbvvj2R3qShZ.png"
      }
    ]
  });

  console.log("Inserting Features...");
  await prisma.feature.createMany({
    data: [
      {
        titleAr: "المساحة",
        titleEn: "Area",
        descriptionAr: "تبلغ المساحة الإجمالية لمصنعنا أكثر من ٢٠,٠٠٠ متر مربع.",
        descriptionEn: "Our factory is constructed over 20,000 square meters.",
        image: "https://camp-coding.site/eloroba/storage/app/images/0e9Yy5j3FdbU0DFTOXTWgrIeSaDRtunarfPxFmPh.png"
      },
      {
        titleAr: "الموظفون",
        titleEn: "Employees",
        descriptionAr: "أكثر من ٧٠٠ موظف متخصص يساهمون في نجاح شركتنا.",
        descriptionEn: "Over 700 dedicated employees who contribute to our company's success",
        image: "https://camp-coding.site/eloroba/storage/app/images/vGmUdMMJnlqBDY7kiOhfibwQDMUjWlG019c6Z7hZ.png"
      },
      {
        titleAr: "السعة",
        titleEn: "Capacity",
        descriptionAr: "يبلغ حجم انتاجنا من الخضروات المجمدة تجميدا سريعا IQF حوالى ٢٥٠٠٠ طن سنويا.",
        descriptionEn: "Our capacity for individual quick freezing (IQF) frozen vegetables reaches 25,000 Tons per year..",
        image: "https://camp-coding.site/eloroba/storage/app/images/4d4nAa9sK4dB1xOtha56c8VIpjO3sxyWxfJtv3n6.png"
      },
      {
        titleAr: "السعة التخزينية للمنتجات النصف مطهية",
        titleEn: "Capacity for pre-fried products",
        descriptionAr: "تبلغ سعتنا التخزينية للمنتجات االنصف مطهية حوالي ١٨٠٠ طن سنويًا.",
        descriptionEn: "Our capacity fo rpre-fried products amounts to 1,800 tons per year.",
        image: "https://camp-coding.site/eloroba/storage/app/images/YFrh6569OO6wE3mYThl0q1bb7L5zJqDOhoViwi71.png"
      },
      {
        titleAr: "السعة الإجمالية لمخازن التبريد",
        titleEn: "Overall cold store capacity",
        descriptionAr: "تبلغ سعة التخزين البارد لدينا ١٠٠٠٠ طن سنويًا، ٥٠٠٠ متر مربع.",
        descriptionEn: "Our cold storage capacity totals 10,000 tons per year, 5000 m2.",
        image: "https://camp-coding.site/eloroba/storage/app/images/dcqw4l4DMEZsoL3P4rLPzBqJPGRIstkT5BdxiabT.png"
      }
    ]
  });

  console.log("Inserting Production Steps...");
  await prisma.productionStep.createMany({
    data: [
      {
        number: 1,
        textAr: "١- الاستلام والفحص والاختيار: نقوم باختيار الخضروات الطازجة بعناية، ونتأكد من نضجها لتكون طرية ولذيذة المذاق. تختلف عمليات الانتقاء نتيجة الاختلاف في طبيعة المنتجات.",
        textEn: "1-Receiving, inspection and selection process: We carefully select the fresh vegetables, and make sure they are ripe to be tender and have a delicious taste. Different selection processes are applied due to the difference in products nature.",
        image: "https://camp-coding.site/eloroba/storage/app/images/5tz9Goi65jI0n7knjNHANWIqZFSsTprXkUjtQk2n.jpg"
      },
      {
        number: 2,
        textAr: "٢- الفرز والغسيل: تخضع الخضروات والفواكة لفرز دقيق لضمان خلو المنتجات من العيوب. ثم تخضع لعملية الغسيل للحصول على المنتجات النظيفة التي نقدمها.",
        textEn: "2-Sorting and washing: Vegetables undergo thorough sorting to ensure defect free products. They are then subjected to washing process to get the clean products we serve.",
        image: "https://camp-coding.site/eloroba/storage/app/images/step-2.png"
      },
      {
        number: 3,
        textAr: "٣- السلق: يعتمد وقت السلق على نوع الخضار.",
        textEn: "3-Blanching: Blanching time depends on the type of vegetables.",
        image: "https://camp-coding.site/eloroba/storage/app/images/step-3.png"
      },
      {
        number: 4,
        textAr: "٤- التبريد: وهي مرحلة تؤهل لعملية التجميد السريع IQF. ويتم ذلك مباشرة بعد السلق.",
        textEn: "4-Cooling: This prepares for IQF process. It is done immediately after blanching.",
        image: "https://camp-coding.site/eloroba/storage/app/images/step-2.png"
      },
      {
        number: 5,
        textAr: "٥- التجميد: تضمن عملية التجميد السريع IQF الحفاظ على خصائص المنتج وعناصره الغذائية.",
        textEn: "5-Freezing: The IQF process ensures maintaining the products attributes and nutrients.",
        image: "https://camp-coding.site/eloroba/storage/app/images/step-3.png"
      },
      {
        number: 6,
        textAr: "٦- التعبئة والتغليف: تخضع المنتجات لعمليات تعبئة متعددة.",
        textEn: "6-Packing: The products under go several packing processes.",
        image: "https://camp-coding.site/eloroba/storage/app/images/5tz9Goi65jI0n7knjNHANWIqZFSsTprXkUjtQk2n.jpg"
      }
    ]
  });

  console.log("Inserting Section Texts...");
  await prisma.sectionText.createMany({
    data: [
      {
        number: 1,
        titleAr: "من نحن",
        titleEn: "About Us",
        textAr: "منذ أن بدأنا سنة ١٩٩٨ وحتى الآن، تعتبر منتجات العروبة الطبيعية والصحية عالية الجودة من أهم العناصر الأساسية والمفضلة في المطبخ المصري. إبتكاراتنا المستمرة تلهم الابداع فى الطهى حول العالم. شغفنا بالطعام وإيماننا بأنه وسيلة لجمع الأسرة والأصدقاء، جعلنا نحرص دائماً على تحويل الوجبات اليومية إلى تجارب ممتعة ونشر السعادة مع كل مذاق لذيذ. شاركنا في بث السعادة في مطبخك.",
        textEn: "At Orouba, we're all about turning everyday meals into delightful experiences. Since 1998, we've been a beloved staple in Egyptian kitchens, cherished for our premium-quality, nutritious, and all-natural frozen food products. Our passion for food and commitment to quality inspires creativity in kitchens everywhere, bringing people together and spreading happiness with every delicious bite. Join us in making every meal a special memory."
      },
      {
        number: 2,
        titleAr: "هدفنا",
        titleEn: "Our Purpose",
        textAr: "إيمانا منا بأن الطعام وسيلة لجمع الناس معا، نقدم مجموعة كبيرة ومتنوعة من المنتجات الطازجة المجمدة من خضروات وفواكة وبقوليات وحبوب وفلافل ومقبلات لذيذة تجعل تجربة إعداد الطعام سهلة، سريعة و ممتعة. نحن نبتكردائما لتقديم خيارات جديدة مختلفة من مكونات بسيطة وطبيعية بالكامل. هدفنا هو نشر البهجة والمتعة مع كل وجبة ومساعدتك على مشاركة سحر الطعام مع أحبائك.",
        textEn: "We believe food brings people together. That’s why we offer a wide range of delicious frozen products, from fresh veggies, fruits, and beans to flavorful falafel and appetizers. We're always innovating to offer exciting new choices made with simple, all-natural ingredients. We make in-the- kitchen experiences easy, quick and fun for everyone. Our aim is to inspire joyful mealtimes and help you share the magic of food with your loved ones."
      },
      {
        number: 3,
        titleAr: "مصنعنا",
        titleEn: "Our Factory",
        textAr: "تم إنشاء المصنع على مساحة إجمالية تبلغ ٢٠,٠٠٠ متر مربع في المنطقة الصناعية الأولى - مدينة العبور الصناعية، ويتكون المصنع من المرافق التالية:",
        textEn: "Constructed over an area of 20,000 square meters in the first industrial zone - El- Obour industrial city the factory consists of the following facilities:"
      }
    ]
  });

  console.log("DB population complete!");
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
