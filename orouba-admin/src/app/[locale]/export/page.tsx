import { getImageUrl, getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import CollaborateForm from "@/components/export/CollaborateForm";
import { localize, localizedSetting, type Locale } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "التصدير | Orouba Foods",
  description: "تقوم شركة العروبة للصناعات الغذائية بتصدير منتجاتها الفاخرة عالمياً عبر عدة قارات.",
};

export default async function ExportPage({ params }: { params: Promise<{ locale: string }> }) {
  const data = await getSiteData();
  const resolvedParams = await params;
  const locale: Locale = resolvedParams.locale === "en" ? "en" : "ar";
  const isEn = locale === 'en';
  const { standards, certificates, sectionTexts, settings = {}, continents = [] } = data;
  
  const exportSection = sectionTexts?.find((s: any) => s.titleEn?.toLowerCase().includes("export") || s.number === 7);
  const exportTitle = localizedSetting(
    settings,
    locale,
    ["exportTitle"],
    locale === "ar" ? (exportSection?.titleAr || "نحن نصدر إلى جميع أنحاء العالم") : (exportSection?.titleEn || "We Export Worldwide")
  );
  const exportDescription = localizedSetting(
    settings,
    locale,
    ["exportDescription", "export_world"],
    locale === "ar"
      ? (exportSection?.textAr || "نصدر منتجاتنا المختلفة وعالية الجودة إلى جميع أنحاء العالم، وتضمن شبكتنا الواسعة تواجد المنتجات طوال الوقت في أكثر من ٥٠ دولة حول العالم.")
      : (exportSection?.textEn || "We export our diverse, high-quality products worldwide, with a vast network ensuring product availability across 50+ countries.")
  );
  const exportImage = localizedSetting(settings, locale, ["exportImage"], "/download.png");
  const exportMap = localizedSetting(
    settings,
    locale,
    ["exportMap", "map", "home_world_image"],
    "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.webp"
  );
  const standardsTitle = localizedSetting(settings, locale, ["exportStandardsTitle", "home_standards_title"], isEn ? "Our Standards" : "معاييرنا");
  const standardsText = localizedSetting(
    settings,
    locale,
    ["exportStandardsText", "stander", "home_standards_text"],
    isEn
      ? "At Orouba, we are committed to the highest quality standards to ensure that every product we provide meets your needs and exceeds your expectations."
      : "نلتزم في العروبة بأعلى معايير الجودة لضمان أن كل منتج نقدمه يلبي احتياجاتك ويتجاوز توقعاتك."
  );
  const certificatesTitle = localizedSetting(settings, locale, ["exportCertificationsTitle"], isEn ? "Our Certifications" : "الشهادات الحاصلة عليها العروبة");
  const catalogButtonText = localizedSetting(settings, locale, ["exportCatalogButtonText", "catalogButtonText"], isEn ? "Download Catalog" : "تحميل الكتالوج");
  const continentNames = continents
    .map((continent: any) => localize(locale, continent.nameAr, continent.nameEn))
    .filter(Boolean);
  const exportRegions = continentNames.length
    ? continentNames
    : isEn
      ? ["Africa", "Middle East and GCC", "Europe", "Japan", "Australia", "USA and Canada"]
      : ["إفريقيا", "الشرق الأوسط والخليج", "أوروبا", "اليابان", "أستراليا", "الولايات المتحدة الأمريكية وكندا"];

  return (
    <div className="bg-white min-h-screen pt-24">

      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <FadeIn direction="right" className="w-full md:w-1/2 text-right">
            <h1 className="text-4xl md:text-[3.25rem] font-bold mb-6 text-[#1e4a8c] leading-tight">
              {exportTitle}
            </h1>
            <p className="text-xl text-[#1e4a8c] leading-relaxed font-medium">
              {exportDescription}
            </p>
          </FadeIn>
          
          <FadeIn direction="left" className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img src={getImageUrl(exportImage)} alt="Orouba Export Airplane" className="w-full max-w-[500px] object-contain" />
          </FadeIn>
        </div>
      </section>

      {/* Continents Text */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <FadeIn direction="up">
          <div className={`flex flex-wrap justify-center items-center gap-2 md:gap-3 text-2xl md:text-[2rem] font-black text-[#1e4a8c] leading-relaxed text-center ${isEn ? 'flex-row' : ''}`}>
            {exportRegions.map((region: string, idx: number) => (
              <span key={region} className="contents">
                {idx > 0 && <span className="text-[#fcf34a]">·</span>}
                <span>{region}</span>
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* World Map */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 mb-20">
        <FadeIn direction="up" className="relative w-full">
          <img 
            src={getImageUrl(exportMap)}
            alt="Orouba World Map" 
            className="w-full h-auto object-contain"
          />
        </FadeIn>
      </section>

      {/* Standards Section (Exact Match from Homepage) */}
      <section className="py-16 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-[#1e4a8c] mb-4">{standardsTitle}</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {standardsText}
            </p>
          </FadeIn>
          
          {standards && standards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 max-w-5xl mx-auto">
              {standards.map((standard: any, idx: number) => (
                <FadeIn key={standard.id} direction="up" delay={0.1 * (idx + 1)} className="h-full">
                  <div className="bg-[#245b95] p-6 rounded-xl text-white aspect-square flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-20 bg-[url('/ar7.png')] bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"></div>
                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {standard.image ? (
                      <div className="w-24 h-24 mb-6 relative z-10 flex items-center justify-center">
                        <img src={getImageUrl(standard.image)} alt="Standard Icon" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="text-5xl mb-6 relative z-10">✨</div>
                    )}
                    <p className="text-sm font-bold leading-relaxed relative z-10 text-center">{localize(locale, standard.descriptionAr, standard.descriptionEn)}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 max-w-5xl mx-auto">
              <FadeIn direction="up" delay={0.1} className="h-full">
                <div className="bg-[#245b95] p-6 rounded-xl text-white aspect-square flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 bg-[url('/ar7.png')] bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="relative z-10 text-5xl mb-6">✨</div>
                  <p className="relative z-10 text-sm font-bold text-center">{isEn ? 'All products are free of any preservatives or chemicals' : 'جميع المنتجات خالية من أي مواد حافظة أو مواد كيماوية'}</p>
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </section>

      {/* ISO Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <FadeIn direction="up">
            <h3 className="text-xl md:text-2xl font-bold text-[#1e4a8c] mb-12">{certificatesTitle}</h3>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.2}>
            {certificates && certificates.length > 0 ? (
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 max-w-5xl mx-auto mb-16">
                {certificates.map((cert: any) => (
                  <div key={cert.id} className="transition-transform hover:scale-105">
                    <img src={getImageUrl(cert.image)} alt={isEn ? cert.titleEn : cert.titleAr} className="h-28 md:h-32 object-contain" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 max-w-5xl mx-auto mb-16">
                {[
                  "1uJfDB4XZNy8OU6YgGprECFWwXhsqxKITmbOpyeh.png",
                  "SmGP1z5bAGysKo9akGSp3LJWGn9Yxq33W8Sk0aiw.png",
                  "TlXmtOsy9Ylfe47V2FS5YqfSNF8lYvWC4fxcpJRC.png",
                ].map((iso, idx) => (
                  <div key={idx} className="transition-transform hover:scale-105">
                    <img src={`/iso/${iso}`} alt="ISO Certification" className="h-28 md:h-32 object-contain" />
                  </div>
                ))}
              </div>
            )}
          </FadeIn>

          <FadeIn direction="up" delay={0.3} className="mb-24">
            <Link href={`/${locale}/export-catalog`} className="inline-flex items-center gap-2 bg-[#245b95] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-800 transition-colors">
              <ChevronLeft className={`w-5 h-5 ${isEn ? 'rotate-180' : ''}`} />
              <span>{catalogButtonText}</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Collaborate Form */}
      <section className="py-16 px-4 md:px-8 mb-16">
        <div className="max-w-[1000px] mx-auto">
          <CollaborateForm locale={locale} />
        </div>
      </section>

    </div>
  );
}
