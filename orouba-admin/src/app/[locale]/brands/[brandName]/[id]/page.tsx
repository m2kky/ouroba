import Link from "next/link";
import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { getServerLocale, t } from "@/lib/server-locale";

export async function generateMetadata({ params }: { params: Promise<{ brandName: string; id: string, locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getSiteData();
  const brand = data.brands.find((b: any) => b.id === resolvedParams.id);
  const isEn = resolvedParams.locale === 'en';

  return {
    title: brand ? `${isEn ? brand.nameEn : brand.nameAr} | ${isEn ? 'Our Products' : 'منتجاتنا'}` : (isEn ? 'Brand Not Found' : 'علامة غير موجودة'),
    description: (isEn ? brand?.descriptionEn : brand?.descriptionAr) || (isEn ? "Explore this brand's products." : "استكشف منتجات هذه العلامة التجارية."),
  };
}

export default async function BrandDetailPage({ params }: { params: Promise<{ brandName: string; id: string, locale: string }> }) {
  const resolvedParams = await params;
  const data = await getSiteData();
  const locale = (resolvedParams.locale as any) === "en" ? "en" : "ar";
  const isEn = locale === 'en';
  const brand = data.brands.find((b: any) => b.id === resolvedParams.id);

  if (!brand) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">{isEn ? 'Brand Not Found' : 'العلامة التجارية غير موجودة'}</h1>
        <Link href={`/${locale}/about/ProductType`} className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
          {isEn ? 'Back to Products' : 'العودة للمنتجات'}
        </Link>
      </div>
    );
  }

  const videoUrl = isEn ? brand.videoUrlEn || brand.videoUrl : brand.videoUrl || brand.videoUrlEn;

  // Dynamic colors for each brand based on its name or id
  const brandThemes: Record<string, { bgContainer: string, bgCard: string, textPrimary: string }> = {
    "بسمة": { bgContainer: "bg-[#8cc63f]", bgCard: "bg-[#9ce14b]", textPrimary: "text-[#8cc63f]" },
    "بابيتس": { bgContainer: "bg-[#c31448]", bgCard: "bg-[#d81a54]", textPrimary: "text-[#c31448]" },
    "فريدة": { bgContainer: "bg-[#0b5394]", bgCard: "bg-[#61a5e8]", textPrimary: "text-[#0b5394]" },
  };

  const theme = brand.id === "8"
    ? { bgContainer: "bg-[#c31448]", bgCard: "bg-[#d81a54]", textPrimary: "text-[#c31448]" }
    : brandThemes[brand.nameAr] || { bgContainer: "bg-[#0b5394]", bgCard: "bg-[#61a5e8]", textPrimary: "text-[#0b5394]" };

  return (
    <div className="bg-white min-h-screen pb-20 pt-32">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-4">
        <div className={`flex items-center gap-2 font-bold text-lg md:text-xl ${theme.textPrimary} ${isEn ? "flex-row" : "flex-row-reverse justify-end"}`}>
          <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">{locale === 'ar' ? 'الصفحة الرئيسية' : 'Home'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${isEn ? 'rotate-180' : ''}`} />
          <Link href={`/${locale}/about/ProductType`} className="hover:text-orouba-yellow transition-colors">{locale === 'ar' ? 'المنتجات' : 'Products'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${isEn ? 'rotate-180' : ''}`} />
          <span>{t(locale, brand.nameAr, brand.nameEn)}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className={`${theme.bgContainer} rounded-t-[2rem] rounded-b-[2rem] pt-12 pb-24 px-4 md:px-12 relative overflow-hidden shadow-2xl transition-colors duration-500`}>
          
          {/* Subtle Background Pattern / Waves */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <svg className="absolute top-10 left-10 w-64 h-64 text-white opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.7,-18.1,96.2,-3.1C95.7,11.9,88.7,26.4,79.5,39.8C70.3,53.2,58.8,65.5,45.2,74.5C31.6,83.5,15.8,89.2,1,87.4C-13.8,85.6,-27.6,76.4,-41.4,67.6C-55.2,58.8,-69.1,50.3,-78.3,38.2C-87.5,26.1,-92,10.4,-90.7,-4.8C-89.4,-20.1,-82.3,-34.9,-72.1,-46.4C-61.9,-57.9,-48.6,-66,-34.9,-73.2C-21.2,-80.4,-7.1,-86.7,7.3,-88.2C21.7,-89.6,43.4,-86.1,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Hero Video */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mb-12 flex flex-col items-center">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] rounded-2xl"
              />
            ) : (
              <div className="w-full h-64 bg-white/10 rounded-2xl flex items-center justify-center">
                {brand.image ? (
                  <img src={brand.image} alt={brand.nameAr} className="h-48 object-contain drop-shadow-2xl" />
                ) : (
                  <h1 className="text-5xl font-bold text-white">{isEn ? brand.nameEn : brand.nameAr}</h1>
                )}
              </div>
            )}

            {/* BAP BITES Special View All Button */}
            {brand.id === "8" && (
              <div className="mt-8">
                <Link 
                  href={`/${locale}/brands/Basma/5/14/${isEn ? 'Frozen-Pre-Fried-Bites' : 'نصف-مقلية-مجمدة'}`} 
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-orouba-blue font-bold text-lg md:text-xl rounded-full hover:bg-orouba-yellow hover:text-white transition-colors shadow-xl"
                >
                  {isEn ? 'View All' : 'إظهار الكل'}
                  <span className={`transform ${isEn ? 'rotate-180' : ''}`}>{"<"}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Descriptive Text */}
          <div className="relative z-10 w-full max-w-4xl mx-auto text-center mb-16 text-white">
            <p className="text-lg md:text-xl leading-relaxed mb-10 font-medium">
              {isEn 
                ? `Enjoy an easy cooking experience and irresistible taste with ${brand.nameEn} products! ${brand.nameEn} continues to innovate to provide fresh and delicious products, with new and easy options through a wide range of frozen vegetables, fruits, legumes, and ready-to-eat products prepared to make quick, effortless, and delicious dishes.`
                : `استمتع بتجربة تحضير سهلة ومذاق لا يقاوم مع منتجات ${brand.nameAr}! تواصل ${brand.nameAr} ابتكارها لتقديم منتجات طازجة ولذيذة، بخيارات جديدة وسهلة من خلال تشكيلة واسعة من الخضروات المجمدة والفواكه والبقوليات، والمنتجات الجاهزة للأكل المعدة لتحضير أطباق شهية سريعة دون جهد.`}
            </p>

            <div className="flex flex-col items-center justify-center text-base md:text-lg font-bold leading-loose relative">
              {/* Yellow Quotes */}
              <span className="text-orouba-yellow text-4xl absolute right-0 top-0 md:-right-12 leading-none">"</span>
              <span className="text-orouba-yellow text-4xl absolute left-0 top-0 md:-left-12 leading-none">"</span>
              
              <p>{isEn ? 'Net Weight: 400 grams' : 'الوزن الرئيسي: ٤٠٠ جرام'}</p>
              <p>{isEn ? 'Except Mango 800 grams' : 'باستثناء مانجو ٨٠٠ جرام'}</p>
              <p>{isEn ? 'Storage: Products are stored in freezers at (-18°C) zero Fahrenheit' : 'التخزين: يتم تخزين المنتجات في عنابر التجميد عند (-١٨ درجة مئوية) صفر فهرنهايت'}</p>
              <p>{isEn ? 'All products are free of preservatives or chemicals' : 'جميع المنتجات خالية من المواد الحافظة أو المواد الكيماوية'}</p>
              <p className="mt-4 text-xl">{isEn ? 'Quick Freezing' : 'تجميد سريع'}</p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="relative z-10">
            {brand.categories?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {brand.categories.map((category: any) => {
                  const displayImage = category.image || category.products?.[0]?.product?.images?.[0]?.url;
                  return (
                    <div key={category.id} className={`${theme.bgCard} rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group shadow-lg border border-white/20 h-full transition-colors duration-500`}>
                      
                      {/* Doodles/Abstract Background for card */}
                      <div className="absolute inset-0 pointer-events-none opacity-20">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20" cy="30" r="4" fill="white" />
                          <circle cx="90%" cy="20" r="3" fill="none" stroke="white" strokeWidth="2" />
                          <circle cx="80%" cy="80%" r="5" fill="none" stroke="white" strokeWidth="2" />
                          <circle cx="10%" cy="70%" r="6" fill="white" />
                          <path d="M 10 90 Q 30 70 50 90 T 90 90" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                          <path d="M 80% 40% Q 90% 50% 80% 60%" fill="none" stroke="white" strokeWidth="3" />
                          <path d="M 20% 50% Q 10% 40% 20% 30%" fill="none" stroke="white" strokeWidth="3" />
                        </svg>
                      </div>

                      {/* Product Bag Images */}
                      <div className="h-64 w-full relative z-10 flex items-center justify-center mb-6 mt-2 group-hover:scale-105 transition-transform duration-500">
                        {category.products && category.products.length >= 2 ? (
                          <>
                            <img 
                              src={category.products[0]?.product?.images?.[0]?.url || displayImage} 
                              alt={category.nameAr}
                              className="absolute w-[75%] max-h-48 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] -top-4 -left-2 -rotate-12 z-10"
                            />
                            <img 
                              src={category.products[1]?.product?.images?.[0]?.url} 
                              alt={category.nameAr}
                              className="absolute w-[75%] max-h-48 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] bottom-0 -right-2 rotate-12 z-20"
                            />
                          </>
                        ) : displayImage ? (
                          <img 
                            src={displayImage} 
                            alt={category.nameAr}
                            className="max-h-full max-w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                            <span className="text-white font-bold text-sm">{isEn ? 'No Image' : 'بدون صورة'}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Title & Button */}
                      <div className="mt-auto flex flex-col items-center z-10 w-full space-y-4">
                        <h3 className="text-xl md:text-2xl font-bold text-white text-center leading-snug drop-shadow-md">
                          {t(locale, category.nameAr, category.nameEn)}
                        </h3>
                        <Link 
                          href={`/${locale}/brands/${resolvedParams.brandName}/${brand.id}/${category.id}/${(isEn ? category.nameEn : category.nameAr || 'category').replace(/\s+/g, '-')}`} 
                          className="text-white hover:text-orouba-yellow font-bold text-lg flex items-center justify-center gap-2 transition-all group-hover:gap-3"
                        >
                          <span className="drop-shadow-sm text-sm md:text-base">{isEn ? 'Show All' : 'إظهار الكل'}</span>
                          <span className={`text-lg drop-shadow-sm transform ${isEn ? 'rotate-180' : ''}`}>{"<"}</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : brand.id === "8" ? null : (
              <div className="text-center py-20 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-sm">
                <p className="text-white text-xl font-bold">{isEn ? 'No product categories available currently.' : 'لا توجد مجموعات منتجات متاحة حالياً.'}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
