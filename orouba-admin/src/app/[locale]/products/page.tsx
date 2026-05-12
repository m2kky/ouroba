import Link from "next/link";
import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import ProductCard from "@/components/products/ProductCard";
import { getServerLocale, t } from "@/lib/server-locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "أصناف المنتجات | العروبة" : "Product Categories | Orouba",
    description: locale === 'ar' 
      ? "استكشف أصناف المنتجات المتنوعة من العروبة."
      : "Explore the diverse product categories from Orouba.",
  };
}

export default async function ProductsPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }> 
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const resolvedSearch = await searchParams;
  const q = resolvedSearch?.q?.toLowerCase().trim() || "";
  
  const data = await getSiteData();
  const categoryTypes = data.categoryTypes || [];
  const settings = data.settings || {};

  const headerImg = settings.product_type_img?.[locale] || settings.product_type_img?.ar || "";
  const headerText = t(locale, settings.product_type_text?.ar, settings.product_type_text?.en) || (locale === 'en' ? "All our vegetables are carefully selected." : "جميع خضرواتنا مختارة بعناية.");

  // Handle Search Results
  let searchResults: any[] = [];
  if (q) {
    const allProducts: any[] = [];
    data.brands?.forEach((brand: any) => {
      brand.categories?.forEach((cat: any) => {
        cat.products?.forEach((cp: any) => {
          if (cp.product && !cp.product.isHidden) {
            allProducts.push({
              ...cp.product,
              brandId: brand.id,
              categoryId: cat.id,
              hoverColor: brand.colorHover || "#004a99"
            });
          }
        });
      });
    });

    const uniqueProducts: any[] = [];
    const seen = new Set();
    for (const p of allProducts) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        uniqueProducts.push(p);
      }
    }

    searchResults = uniqueProducts.filter((p: any) => 
      (p.nameAr && p.nameAr.toLowerCase().includes(q)) || 
      (p.nameEn && p.nameEn.toLowerCase().includes(q))
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 pt-32">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-4">
        <div className={`flex items-center gap-2 font-bold text-lg md:text-xl text-[#004A99] ${locale === 'en' ? "flex-row" : "flex-row-reverse justify-end"}`}>
          <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">{locale === 'ar' ? 'الصفحة الرئيسية' : 'Home'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <Link href={`/${locale}/about/whoWeAre`} className="hover:text-orouba-yellow transition-colors">{locale === 'ar' ? 'عن العروبة' : 'About Orouba'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <span>{locale === 'ar' ? 'أصناف المنتجات' : 'Product Categories'}</span>
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
                {locale === 'ar' ? 'أصناف المنتجات' : 'Product Categories'}
              </h1>
              <p className="text-[#002F59] text-lg md:text-xl font-medium w-full md:w-4/5 leading-relaxed">
                {headerText}
              </p>
            </FadeIn>

            {/* Render Search Results or Category Types */}
            {q ? (
              <div className="mt-8">
                <h2 className="text-3xl font-bold text-[#004A99] mb-8 text-center">
                  {locale === 'ar' ? `نتائج البحث عن: "${q}"` : `Search results for: "${q}"`}
                </h2>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12 place-items-center">
                    {searchResults.map((product) => (
                      <ProductCard 
                        key={product.id}
                        product={{
                          id: product.id,
                          nameAr: product.nameAr,
                          nameEn: product.nameEn,
                          images: product.images
                        }}
                        brand={{
                          id: product.brandId,
                          hoverColor: product.hoverColor
                        }}
                        locale={locale}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/50 rounded-3xl">
                    <p className="text-[#004A99] text-xl font-bold">
                      {locale === 'ar' ? "لم يتم العثور على منتجات تطابق بحثك." : "No products found matching your search."}
                    </p>
                    <Link href={`/${locale}/products`} className="inline-block mt-4 bg-[#004A99] text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
                      {locale === 'ar' ? "عرض جميع الأصناف" : "Show all categories"}
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              /* Alternating Category Types */
              categoryTypes.length > 0 ? (
                <div className="space-y-16 md:space-y-24">
                  {categoryTypes.map((item: any, index: number) => {
                    const isEven = index % 2 === 0;
                    const flexDirection = isEven ? "md:flex-row" : "md:flex-row-reverse";

                    return (
                      <FadeIn key={item.id} direction={isEven ? "right" : "left"} className={`flex flex-col ${flexDirection} items-center gap-8 md:gap-16`}>
                        
                        {/* Product Image */}
                        <div className="w-full md:w-1/2 flex justify-center">
                          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white transform transition-transform hover:scale-105 duration-500">
                            {item.image ? (
                              <img src={item.image} alt={item.titleAr} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-white/50 flex items-center justify-center text-[#004A99] font-bold">
                                {locale === 'ar' ? 'بدون صورة' : 'No image'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Text & Links */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center">
                          <h2 className="text-3xl md:text-4xl font-bold text-[#004A99] mb-4">
                            {t(locale, item.titleAr, item.titleEn)}
                          </h2>
                          <p className="text-[#002F59] text-lg leading-relaxed mb-8 font-medium">
                            {t(locale, item.descriptionAr, item.descriptionEn)}
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
                                  href={`/${locale}/brands/${cat.brand.id}/${cat.id}`}
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
                  <p className="text-[#004A99] text-xl font-bold">
                    {locale === 'ar' ? "لا توجد أصناف متاحة حالياً." : "No categories available currently."}
                  </p>
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
