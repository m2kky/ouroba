import Image from "next/image";
import { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import { getImageUrl, getSiteData } from "@/lib/api-client";
import { localize, localizedSetting, type Locale } from "@/lib/site-content";

const fallbackValues = [
  {
    id: "integrity",
    titleAr: "النزاهة",
    titleEn: "Integrity",
    image: "/النزاهة.png",
    descriptionAr: "نحن ندير أعمالنا بأعلى معايير الصدق والأخلاق والشفافية.",
    descriptionEn: "We conduct our business with the highest standards of honesty, ethics, and transparency.",
  },
  {
    id: "excellence",
    titleAr: "التميز",
    titleEn: "Excellence",
    image: "/التميز.png",
    descriptionAr: "نحن نسعى جاهدين من أجل التميز في جميع جوانب عملياتنا.",
    descriptionEn: "We strive for excellence in all aspects of our operations.",
  },
  {
    id: "collaboration",
    titleAr: "التعاون",
    titleEn: "Collaboration",
    image: "/التعاون.png",
    descriptionAr: "نؤمن بقوة التعاون والعمل الجماعي في تحقيق أهدافنا.",
    descriptionEn: "We believe in the power of collaboration and teamwork.",
  },
];

const fallbackCertificates = [
  "/iso/1uJfDB4XZNy8OU6YgGprECFWwXhsqxKITmbOpyeh.png",
  "/iso/SmGP1z5bAGysKo9akGSp3LJWGn9Yxq33W8Sk0aiw.png",
  "/iso/TlXmtOsy9Ylfe47V2FS5YqfSNF8lYvWC4fxcpJRC.png",
  "/iso/USLPIDaFv8OjjHmIRKAoKcmaAcCDdpcNG07vt7MI.png",
  "/iso/i9VHNExG99AdsBqpdbcsVyMJbHylg58I6bYGDaOl.png",
  "/iso/nDjw3guvaVMR7XrJ8MeeWGRTLIQAaoaTaC16GFY5.png",
  "/iso/qJiYIo2DSGZ404ZVUoJzHaXEcG7VifX3UeCSPxpf.png",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "ar" ? "الشهادات والقيم | العروبة" : "Certifications & Values | Orouba",
    description:
      locale === "ar"
        ? "تعرف على قيم العروبة وشهادات الجودة المعتمدة."
        : "Explore Orouba values and quality certifications.",
  };
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === "en" ? "en" : "ar";
  const isEn = locale === "en";
  const data = await getSiteData();
  const settings = data?.settings || {};
  const values = data?.values?.length ? data.values : fallbackValues;
  const visibleCertificates = (data?.certificates || []).filter((cert: any) => Boolean(cert.image));
  const certificates = visibleCertificates.length ? visibleCertificates : fallbackCertificates.map((image, idx) => ({ id: `fallback-${idx}`, image }));
  const certificationText = localizedSetting(
    settings,
    locale,
    ["certificationText", "certification_text"],
    isEn
      ? "At Orouba, we take pride in our commitment to quality and excellence, reflected in the certifications and standards we have achieved."
      : "في العروبة، نفخر بالتزامنا بالجودة والتميز، وهو ما ينعكس في الشهادات والمعايير التي حصلنا عليها."
  );
  const valuesIntro = localizedSetting(
    settings,
    locale,
    ["values_text"],
    isEn
      ? "At Orouba, our values serve as the foundation of everything we do."
      : "في العروبة، قيمنا هي أساس لكل ما نقوم به."
  );
  const heroImage = localizedSetting(
    settings,
    locale,
    ["certification_image", "about_image"],
    "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/1.webp"
  );

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-orouba-blue">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-orouba-blue/95 mix-blend-multiply z-10" />
          <Image
            src={getImageUrl(heroImage)}
            alt={isEn ? "Quality background" : "خلفية الجودة"}
            fill
            className="object-cover opacity-30"
            unoptimized
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
              {isEn ? "Quality" : "الجودة"}{" "}
              <span className="text-orouba-yellow">{isEn ? "& Values" : "والقيم"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-sm">
              {certificationText}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 relative z-10 -mt-10 bg-orouba-yellow overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <FadeIn>
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-orouba-blue mb-6">
                {isEn ? "Our Values" : "قيمنا"}
              </h2>
              <p className="text-orouba-blue text-lg md:text-xl leading-relaxed font-bold">
                {valuesIntro}
              </p>
            </div>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
            {values.map((value: any, idx: number) => (
              <FadeIn key={value.id || idx} delay={idx * 0.1}>
                <div className="bg-orouba-blue rounded-[24px] p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group text-center flex flex-col items-center w-[280px] min-h-[380px] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('/ar7.png')] bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110" />

                  <div className="relative z-10 flex flex-col items-center w-full h-full">
                    {value.image && (
                      <div className="w-20 h-20 mb-6 relative">
                        <Image
                          src={getImageUrl(value.image)}
                          alt={localize(locale, value.titleAr, value.titleEn)}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-110 invert brightness-0"
                          unoptimized
                        />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-sm">
                      {localize(locale, value.titleAr, value.titleEn)}
                    </h3>
                    <p className="text-blue-50 leading-relaxed text-sm font-medium drop-shadow-sm">
                      {localize(locale, value.descriptionAr, value.descriptionEn)}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-orouba-blue mb-4">
                {isEn ? "Orouba Certifications" : "شهادات ISO المعتمدة"}
              </h2>
              <div className="w-24 h-1.5 bg-orouba-yellow mx-auto rounded-full mb-6" />
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                {certificationText}
              </p>
            </div>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-6xl mx-auto">
            {certificates.map((cert: any, idx: number) => (
              <FadeIn key={cert.id || idx} delay={idx * 0.05}>
                <div className="w-32 h-32 md:w-48 md:h-48 relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orouba-blue/20 transition-all duration-300 p-4 flex items-center justify-center group hover:-translate-y-2">
                  <Image
                    src={getImageUrl(cert.image)}
                    alt={localize(locale, cert.titleAr, cert.titleEn) || (isEn ? `Orouba certificate ${idx + 1}` : `شهادة العروبة ${idx + 1}`)}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    unoptimized
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
