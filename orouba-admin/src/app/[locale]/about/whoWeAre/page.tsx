import { getSiteData, getImageUrl } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/server-locale";
import { sanitizeHtml } from "@/lib/sanitize";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "من نحن | Orouba Foods" : "Who We Are | Orouba Foods",
    description: locale === 'ar' 
      ? "تعرف على تاريخ العروبة للصناعات الغذائية، قيمنا، ومعايير الجودة."
      : "Learn about the history of Orouba Foods, our values, and quality standards.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const data = await getSiteData();
  const { settings, buildings, productionSteps, sectionTexts, features } = data;
  
  // Filter section texts to only show those meant for the About page (e.g., Vision, Mission, etc. numbers 1 to 4)
  const aboutSections = sectionTexts?.filter((s: any) => s.number >= 1 && s.number <= 4) || [];

  const aboutImage = settings?.about_image?.en || settings?.about_image?.ar || "pZHaEck6Myx1R5XKJTICq0AZFn15lMRTC6kT1Yp0.webp";
  const smallAboutImage = settings?.small_about_img?.en || settings?.small_about_img?.ar || aboutImage;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 mt-28 mb-8">
        <nav className="flex text-sm text-gray-500 font-medium" style={{ justifyContent: locale === 'en' ? 'flex-start' : 'flex-end', flexDirection: locale === 'ar' ? 'row-reverse' : 'row' }}>
          <Link href={`/${locale}`} className="hover:text-[#035297]">
            {locale === 'ar' ? "الصفحة الرئيسية" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">
            {locale === 'ar' ? "عن العروبة" : "About US"}
          </span>
          <span className="mx-2">/</span>
          <span className="text-[#035297] font-bold">
            {locale === 'ar' ? "من نحن" : "Who We Are "}
          </span>
        </nav>
      </div>

      <div className="container mx-auto px-4 text-start max-w-7xl">
        {/* Main Image */}
        <div className="flex flex-col md:flex-row mb-12 justify-center">
          <div className="w-full">
            <picture>
              <source media="(max-width: 500px)" srcSet={getImageUrl(smallAboutImage)} />
              {getImageUrl(aboutImage) ? (
                <img
                  src={getImageUrl(aboutImage)}
                  alt="who we are"
                  className="w-full h-auto md:max-h-[500px] object-cover rounded-[20px] shadow-lg"
                />
              ) : (
                <div className="w-full h-[300px] md:h-[400px] bg-gray-50 flex items-center justify-center rounded-[20px] shadow-lg border border-gray-100">
                  <img
                    src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"
                    alt="Orouba Foods"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain opacity-50"
                  />
                </div>
              )}
            </picture>
          </div>
        </div>

        {/* Sections */}
        {aboutSections && aboutSections.map((item: any) => (
          <div key={item.id} className="mb-10 w-full" style={{ textAlign: locale === 'en' ? 'left' : 'right' }}>
            <h3 
              className="text-[32px] md:text-[40px] font-bold mb-6 text-[#035297]"
            >
              {locale === 'en' ? item.titleEn : item.titleAr}
            </h3>
            <div 
              className="text-[#7a7a7a] leading-relaxed text-lg"
              style={{ 
                marginRight: locale === 'en' ? 'auto' : '0',
                marginLeft: locale === 'ar' ? 'auto' : '0'
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(locale === 'en' ? item.textEn : item.textAr),
              }}
            />
          </div>
        ))}



        {/* Buildings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mb-16">
          {buildings && buildings.map((item: any) => (
            <div key={item.id} className="flex gap-4 items-start text-start" style={{ textAlign: locale === 'en' ? 'left' : 'right', flexDirection: locale === 'ar' ? 'row-reverse' : 'row' }}>
              <div>
                <h4 className="text-[24px] text-[#035297] font-bold mb-2">
                  {locale === 'en' ? item.titleEn : item.titleAr}
                </h4>
                <p className="text-[18px] text-[#7a7a7a] leading-relaxed">
                  {locale === 'en' ? item.descriptionEn : item.descriptionAr}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features / Areas */}
        <div className="mt-16 mb-20">
          <div className="flex flex-wrap justify-center gap-y-16 gap-x-8 md:gap-x-12">
            {features && features.map((item: any) => (
              <div key={item.id} className="flex flex-col items-center text-center group w-full sm:w-[calc(50%-2rem)] md:w-[calc(33.333%-2rem)]">
                <div className="w-24 h-24 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <img src={getImageUrl(item.image)} alt={item.titleEn} className="w-16 h-16 object-contain" />
                </div>
                <h5 className="font-bold text-[22px] text-[#035297] mb-3">
                  {locale === 'en' ? item.titleEn : item.titleAr}
                </h5>
                <p className="w-4/5 mx-auto text-[#035297] font-medium leading-relaxed">
                  {locale === 'en' ? item.descriptionEn : item.descriptionAr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Production Steps */}
        <div className="mt-20">
          <h4 className="text-[40px] text-[#035297] font-bold mb-12" style={{ textAlign: locale === 'en' ? 'left' : 'right' }}>
            {locale === 'ar' ? "مراحل الإنتاج" : "Production Steps"}
          </h4>
          <div className="space-y-24">
            {(() => {
              if (!productionSteps) return null;
              const chunks = [];
              for (let i = 0; i < productionSteps.length; i += 3) {
                chunks.push(productionSteps.slice(i, i + 3));
              }
              return chunks.map((chunk, chunkIndex) => {
                const isEven = chunkIndex % 2 === 0;
                const stepWithImage = chunk.find((s: any) => s.image) || chunk[0];
                return (
                  <div key={chunkIndex} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 mb-24`}>
                    
                    {/* Image Column */}
                    <div className="w-full md:w-1/2 relative flex justify-center">
                      <div className={`absolute inset-0 bg-[#ffcc00] rounded-[20px] transform ${isEven ? '-rotate-3' : 'rotate-3'} scale-105 z-0 hidden md:block`}></div>
                      {stepWithImage?.image ? (
                        <div className="relative z-10 w-full h-80 md:h-[400px] rounded-[20px] overflow-hidden shadow-lg bg-gray-100">
                          <img src={getImageUrl(stepWithImage.image)} alt="Production Step" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="relative z-10 w-full h-80 md:h-[400px] rounded-[20px] shadow-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Texts Column */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6" style={{ textAlign: locale === 'en' ? 'left' : 'right' }}>
                      {chunk.map((step: any) => (
                        <div key={step.id}>
                          <div 
                            className="text-[#035297] text-[18px] md:text-[20px] leading-relaxed inline-block"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(locale === 'en' ? step.textEn : step.textAr)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
          <p className="mt-12 text-[18px] md:text-[20px] text-[#035297] font-medium leading-relaxed" style={{ textAlign: locale === 'en' ? 'left' : 'right' }}>
            {locale === 'ar' 
              ? "بعض الخطوات تتم لأنواع محددة فقط، مثل: فصل الحجم حسب الدرجات للبامية. الفرم والتصفية للطماطم. التقطيع لبعض المنتجات. بشر وفرم بعض المنتجات مثل البصل والثوم" 
              : "Some steps are done for specific types only, like :Size separation by grades for okra. Chopping & sifting, for tomatoes. Cutting for some products. Grating and crushing some products like onion and garlic."}
          </p>
        </div>
      </div>
    </div>
  );
}
