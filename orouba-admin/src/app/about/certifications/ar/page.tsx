"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";

const coreValues = [
  { title: "التركيز على العملاء", image: "/التركيز على العملاء.png", description: "نضع عملاءنا في المقام الأول، ونسعى جاهدين لفهم احتياجاتهم وتلبيتها." },
  { title: "التعاون", image: "/التعاون.png", description: "نؤمن بقوة العمل الجماعي والشراكات لتحقيق أهدافنا المشتركة." },
  { title: "التميز", image: "/التميز.png", description: "نلتزم بأعلى معايير الجودة والتميز في كل ما نقوم به." },
  { title: "المسئولية الاجتماعية", image: "/المسئولية الاجتماعية.png", description: "نتحمل مسؤوليتنا تجاه مجتمعنا وبيئتنا من خلال مبادرات مستدامة." },
  { title: "النزاهة", image: "/النزاهة.png", description: "نتصرف بشفافية وصدق وأخلاقيات عالية في جميع تعاملاتنا." },
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
              الجودة <span className="text-orouba-yellow">والقيم</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-sm">
              التزامنا الراسخ بالجودة يضمن أن كل منتج يصل إلى مائدتك يلبي أعلى المعايير الدولية للسلامة والتميز.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 relative z-10 -mt-10">
        <div className="container mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-orouba-blue mb-4">القيم الأساسية</h2>
              <div className="w-24 h-1.5 bg-orouba-yellow mx-auto rounded-full mb-6" />
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                في شركة العروبة، نعتمد على مجموعة من القيم الراسخة التي توجه كل خطوة نخطوها وتضمن تقديم الأفضل لمجتمعنا وعملائنا.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {coreValues.map((value, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group text-center h-full flex flex-col items-center">
                  <div className="w-28 h-28 mb-6 relative p-4 bg-gray-50 rounded-full border border-gray-100 group-hover:border-orouba-yellow group-hover:bg-orouba-yellow/5 transition-colors">
                    <Image
                      src={value.image}
                      alt={value.title}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-orouba-blue mb-4 group-hover:text-blue-800 transition-colors">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
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
              <h2 className="text-3xl md:text-5xl font-bold text-orouba-blue mb-4">شهادات ISO المعتمدة</h2>
              <div className="w-24 h-1.5 bg-orouba-yellow mx-auto rounded-full mb-6" />
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                نفخر بحصولنا على العديد من شهادات الآيزو (ISO) العالمية التي تؤكد التزامنا التام بتطبيق أحدث وأدق معايير الجودة وسلامة الغذاء.
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
