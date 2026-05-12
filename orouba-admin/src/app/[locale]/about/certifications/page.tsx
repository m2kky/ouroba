"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { useLocale } from "@/lib/locale-context";

const coreValues = [
  { 
    titleAr: "التركيز على العملاء", 
    titleEn: "Customer Focus",
    image: "/التركيز على العملاء.png", 
    descriptionAr: "نضع عملاءنا في المقام الأول، ونسعى جاهدين لفهم احتياجاتهم وتلبيتها.",
    descriptionEn: "Our customers are at the heart of everything we do. We listen to their needs, anticipate their preferences, and strive to exceed their expectations with innovative solutions and outstanding service."
  },
  { 
    titleAr: "التعاون", 
    titleEn: "Collaboration",
    image: "/التعاون.png", 
    descriptionAr: "نحن نؤمن بقوة التعاون والعمل الجماعي. من خلال تعزيز بيئة عمل شاملة وداعمة، نستفيد من المواهب ونقاط القوة الجماعية لقوتنا العاملة المتنوعة لتحقيق أهدافنا وتحقيق النجاح.",
    descriptionEn: "We believe in the power of collaboration and teamwork. By fostering an inclusive and supportive work environment, we harness the collective talents and strengths of our diverse workforce to achieve our goals and drive success."
  },
  { 
    titleAr: "التميز", 
    titleEn: "Excellence",
    image: "/التميز.png", 
    descriptionAr: "نحن نسعى جاهدين من أجل التميز في جميع جوانب عملياتنا، بدءاً من جودة المنتج إلى خدمة العملاء. نبحث باستمرار عن فرص للتحسين والابتكار لتجاوز التوقعات وتقديم قيمة استثنائية لعملائنا.",
    descriptionEn: "We strive for excellence in all aspects of our operations, from product quality to customer service. We continuously seek opportunities for improvement and innovation to exceed expectations and deliver exceptional value to our stakeholders."
  },
  { 
    titleAr: "المسؤولية الاجتماعية", 
    titleEn: "Social Responsibility",
    image: "/المسئولية الاجتماعية.png", 
    descriptionAr: "نحن ملتزمون بإحداث تأثير إيجابي على المجتمع والبيئة. نحن نعطي الأولوية للاستدامة والمشاركة المجتمعية والممارسات الأخلاقية، مما يضمن أن تساهم أعمالنا في سلامة البشر والكوكب.",
    descriptionEn: "We are dedicated to making a positive impact on society and the environment. We prioritize sustainability, community engagement, and ethical practices, ensuring that our business contributes to the well-being of people and the planet."
  },
  { 
    titleAr: "النزاهة", 
    titleEn: "Integrity",
    image: "/النزاهة.png", 
    descriptionAr: "نحن ندير أعمالنا بأعلى معايير الصدق والأخلاق والشفافية. النزاهة هي حجر الأساس في علاقاتنا مع العملاء والشركاء والموظفين.",
    descriptionEn: "We conduct our business with the highest standards of honesty, ethics, and transparency. Integrity is the cornerstone of our relationships with customers, partners, and employees."
  },
];

const isoCertificates = [
  "/iso/1uJfDB4XZNy8OU6YgGprECFWwXhsqxKITmbOpyeh.png",
  "/iso/SmGP1z5bAGysKo9akGSp3LJWGn9Yxq33W8Sk0aiw.png",
  "/iso/TlXmtOsy9Ylfe47V2FS5YqfSNF8lYvWC4fxcpJRC.png",
  "/iso/USLPIDaFv8OjjHmIRKAoKcmaAcCDdpcNG07vt7MI.png",
  "/iso/i9VHNExG99AdsBqpdbcsVyMJbHylg58I6bYGDaOl.png",
  "/iso/nDjw3guvaVMR7XrJ8MeeWGRTLIQAaoaTaC16GFY5.png",
  "/iso/qJiYIo2DSGZ404ZVUoJzHaXEcG7VifX3UeCSPxpf.png",
];

export default function CertificationsPage() {
  const { locale } = useLocale();

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-orouba-blue">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-orouba-blue/95 mix-blend-multiply z-10" />
          <Image
            src="https://camp-coding.site/eloroba/storage/app/images/1.jpg"
            alt="Hero Background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        
        {/* Floating Abstract Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orouba-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
              {locale === 'ar' ? 'الجودة' : 'Quality'} <span className="text-orouba-yellow">{locale === 'ar' ? 'والقيم' : '& Values'}</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-sm">
              {locale === 'ar' ? 'التزامنا الراسخ بالجودة يضمن أن كل منتج يصل إلى مائدتك يلبي أعلى المعايير الدولية للسلامة والتميز.' : 'Our unwavering commitment to quality ensures that every product reaching your table meets the highest international standards of safety and excellence.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 relative z-10 -mt-10 bg-orouba-yellow overflow-hidden">
        {/* Decorative pattern for the yellow background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <FadeIn>
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-orouba-blue mb-6">{locale === 'ar' ? 'قيمنا' : 'Our Values'}</h2>
              <p className="text-orouba-blue text-lg md:text-xl leading-relaxed font-bold">
                {locale === 'ar' 
                  ? 'في العروبة، قيمنا هي أساس لكل ما نقوم به. فهي توجهنا في اتخاذ قراراتنا، وإجراءاتنا وتفاعلاتنا مع عملائنا. كما تعكس التزامنا بالنزاهة والتميز والمسؤولية الاجتماعية.'
                  : 'At Orouba, our values serve as the foundation of everything we do. They guide our decisions, actions, and interactions with our stakeholders, and reflect our commitment to integrity, excellence, and social responsibility.'}
              </p>
            </div>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
            {coreValues.map((value, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-orouba-blue rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group text-center flex flex-col items-center w-[280px] min-h-[380px] relative overflow-hidden">
                  {/* Subtle Map Silhouette Background */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110" />
                  
                  <div className="relative z-10 flex flex-col items-center w-full h-full">
                    <div className="w-20 h-20 mb-6 relative">
                      <Image
                        src={value.image}
                        alt={locale === 'ar' ? value.titleAr : value.titleEn}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110 invert brightness-0"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-sm">{locale === 'ar' ? value.titleAr : value.titleEn}</h3>
                    <p className="text-blue-50 leading-relaxed text-sm font-medium drop-shadow-sm">{locale === 'ar' ? value.descriptionAr : value.descriptionEn}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-orouba-blue mb-4">{locale === 'ar' ? 'شهادات ISO المعتمدة' : 'Orouba Certifications'}</h2>
              <div className="w-24 h-1.5 bg-orouba-yellow mx-auto rounded-full mb-6" />
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                {locale === 'ar' 
                  ? 'نفخر بحصولنا على العديد من شهادات الآيزو (ISO) العالمية التي تؤكد التزامنا التام بتطبيق أحدث وأدق معايير الجودة وسلامة الغذاء.'
                  : 'At Orouba, we take pride in our commitment to quality and excellence, which is reflected in the certifications and standards we have achieved.'}
              </p>
            </div>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-6xl mx-auto">
            {isoCertificates.map((cert, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className="w-32 h-32 md:w-48 md:h-48 relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orouba-blue/20 transition-all duration-300 p-4 flex items-center justify-center group cursor-pointer hover:-translate-y-2">
                  <Image
                    src={cert}
                    alt={`ISO Certificate ${idx + 1}`}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
