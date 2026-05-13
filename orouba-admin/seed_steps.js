const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.productionStep.deleteMany();

  // Images for the groups
  const img1 = 'https://camp-coding.site/eloroba/storage/app/images/5tz9Goi65jI0n7knjNHANWIqZFSsTprXkUjtQk2n.jpg';
  const img2 = 'https://camp-coding.site/eloroba/storage/app/images/ME5PsY3BANJYZ2lXAeWT3EvMyEayD7JXEDe3MTLs.jpg';

  const steps = [
    {
      titleAr: '١- الاستلام والفحص والاختيار',
      descAr: 'نقوم باختيار الخضروات الطازجة بعناية، ونتأكد من نضجها لتكون طرية ولذيذة المذاق. تختلف عمليات الانتقاء نتيجة الاختلاف في طبيعة المنتجات.',
      image: img1
    },
    {
      titleAr: '٢- الفرز والغسيل',
      descAr: 'تخضع الخضروات والفواكة لفرز دقيق لضمان خلو المنتجات من العيوب. ثم تخضع لعملية الغسيل للحصول على المنتجات النظيفة التي نقدمها.',
      image: ''
    },
    {
      titleAr: '٣- السلق',
      descAr: 'يعتمد وقت السلق على نوع الخضار.',
      image: ''
    },
    {
      titleAr: '٤- التبريد',
      descAr: 'وهي مرحلة تؤهل لعملية التجميد السريع IQF. ويتم ذلك مباشرة بعد السلق.',
      image: img2
    },
    {
      titleAr: '٥- التجميد',
      descAr: 'تضمن عملية التجميد السريع IQF الحفاظ على خصائص المنتج وعناصره الغذائية.',
      image: ''
    },
    {
      titleAr: '٦- التعبئة والتغليف',
      descAr: 'تخضع المنتجات لعمليات تعبئة متعددة.',
      image: ''
    }
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    // Create an HTML string that exactly matches the format we tried to use in the code!
    // Wait, since we are fetching from DB and rendering, we can just store the full HTML, OR we can store them as structured text.
    // The previous implementation used dangerouslySetInnerHTML. 
    // Let's store structured HTML: <h4 class="text-[20px] md:text-[22px] font-bold text-[#035297] inline">${s.titleAr}:</h4> <span class="text-[#035297] font-medium leading-relaxed inline ml-2 mr-2">${s.descAr}</span>
    
    // Better yet, I can change the page.tsx to just expect an object or string and parse it, but let's just make `textAr` contain both.
    
    const combinedTextAr = `<strong>${s.titleAr}:</strong> ${s.descAr}`;
    const combinedTextEn = `<strong>${s.titleAr}:</strong> ${s.descAr}`; // Using AR for EN since no EN provided
    
    await prisma.productionStep.create({
      data: {
        number: i + 1,
        textEn: combinedTextEn,
        textAr: combinedTextAr,
        image: s.image,
        isHidden: false
      }
    });
  }

  console.log("6 steps seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
