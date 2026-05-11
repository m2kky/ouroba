import Link from "next/link";
import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "أصناف المنتجات | العروبة",
  description: "استكشف أصناف المنتجات المتنوعة من العروبة.",
};

export default async function ProductsPage() {
  const data = await getSiteData();
  const categoryTypes = data.categoryTypes || [];
  const settings = data.settings || {};

  // Find the header image and text for this page if available in settings, or use fallbacks
  const headerImg = settings.product_type_img?.ar || "https://camp-coding.site/eloroba/storage/app/images/default_product_bg.png"; // Fallback if needed
  const headerText = settings.product_type_text?.ar || "جميع خضرواتنا مختارة بعناية. تخضع لعملية التفتيش، ثم تُغسل الخضروات وتُعالج وتُجمد بسرعة. لدينا مجموعة كبيرة من الأنواع ونسعى لزيادتها.";

  return (
    <div className="bg-white min-h-screen pb-20 pt-32">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-4">
        <div className={`flex items-center gap-2 font-bold text-lg md:text-xl text-[#004A99]`}>
          <Link href="/" className="hover:text-orouba-yellow transition-colors">الصفحة الرئيسية</Link>
          <ChevronLeft className="w-5 h-5 mt-1" />
          <Link href="/about" className="hover:text-orouba-yellow transition-colors">عن العروبة</Link>
          <ChevronLeft className="w-5 h-5 mt-1" />
          <span>أصناف المنتجات</span>
        </div>
      </div>

      {/* Main Container - The Big Yellow Card */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="bg-[#FDE619] rounded-[40px] pt-12 pb-24 px-4 md:px-12 relative overflow-hidden shadow-2xl">
          
          {/* Decorative Watermark Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/food.png')]" />
             {/* If there's a specific background image from settings, we can place it here with opacity */}
             {headerImg && (
               <img src={headerImg} alt="" className="absolute top-0 right-0 w-full h-full object-cover opacity-5" />
             )}
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto">
            {/* Header Title & Text */}
            <FadeIn direction="up" className="mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-[#004A99] mb-6">
                أصناف المنتجات
              </h1>
              <p className="text-[#002F59] text-lg md:text-xl font-medium w-full md:w-4/5 leading-relaxed">
                {headerText}
              </p>
            </FadeIn>

            {/* Alternating Category Types */}
            {categoryTypes.length > 0 ? (
              <div className="space-y-16 md:space-y-24">
                {categoryTypes.map((item: any, index: number) => {
                  const isEven = index % 2 === 0;
                  // For alternating layout:
                  // isEven ? image right, text left : image left, text right.
                  // Since direction is RTL:
                  // Default (row): Image Right (start), Text Left (end)
                  // Reverse (row-reverse): Image Left (end), Text Right (start)
                  const flexDirection = isEven ? "md:flex-row" : "md:flex-row-reverse";

                  return (
                    <FadeIn key={item.id} direction={isEven ? "right" : "left"} className={`flex flex-col ${flexDirection} items-center gap-8 md:gap-16`}>
                      
                      {/* Product Image */}
                      <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white transform transition-transform hover:scale-105 duration-500">
                          {item.image ? (
                            <img src={item.image} alt={item.titleAr} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-white/50 flex items-center justify-center text-[#004A99] font-bold">بدون صورة</div>
                          )}
                        </div>
                      </div>

                      {/* Product Text & Links */}
                      <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#004A99] mb-4">
                          {item.titleAr}
                        </h2>
                        <p className="text-[#002F59] text-lg leading-relaxed mb-8 font-medium">
                          {item.descriptionAr}
                        </p>

                        {/* Associated Brands / Categories Links */}
                        <div className="flex flex-wrap items-center gap-4">
                          {item.categories?.map((catTypeCat: any) => {
                            const cat = catTypeCat.category;
                            if (!cat || !cat.brand) return null;
                            const brandLogo = catTypeCat.image || cat.brand.image || cat.brand.imageSmallMain;
                            
                            return (
                              <Link 
                                key={catTypeCat.id}
                                href={`/brands/${cat.brand.id}/${cat.id}/ar`}
                                className="group relative block w-16 h-16 bg-white rounded-full p-2 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                title={`${cat.brand.nameAr} - ${cat.nameAr}`}
                              >
                                {brandLogo ? (
                                  <img 
                                    src={brandLogo} 
                                    alt={cat.brand.nameAr} 
                                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                                  />
                                ) : (
                                  <span className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-500">
                                    {cat.brand.nameAr}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      
                    </FadeIn>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#004A99] text-xl font-bold">لا توجد أصناف متاحة حالياً.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
