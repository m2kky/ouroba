import Link from "next/link";
import Image from "next/image";
import { getSiteData, getImageUrl } from "@/lib/api-client";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import ProductCard from "@/components/products/ProductCard";
import { getServerLocale, t, type Locale } from "@/lib/server-locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "╪ú╪╡┘å╪º┘ü ╪º┘ä┘à┘å╪¬╪¼╪º╪¬ | ╪º┘ä╪╣╪▒┘ê╪¿╪⌐" : "Product Categories | Orouba",
    description: locale === 'ar' 
      ? "╪º╪│╪¬┘â╪┤┘ü ╪ú╪╡┘å╪º┘ü ╪º┘ä┘à┘å╪¬╪¼╪º╪¬ ╪º┘ä┘à╪¬┘å┘ê╪╣╪⌐ ┘à┘å ╪º┘ä╪╣╪▒┘ê╪¿╪⌐."
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
  const locale: Locale = (resolvedParams.locale as any) === "en" ? "en" : "ar";

  const resolvedSearch = await searchParams;
  const q = resolvedSearch?.q?.toLowerCase().trim() || "";
  
  const data = await getSiteData();
  const categoryTypes = (data.categoryTypes || []).sort((a: any, b: any) => (a.number || 999) - (b.number || 999));
  const settings = data.settings || {};

  const headerImg = settings.product_type_img?.[locale] || settings.product_type_img?.ar || "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/8inON8KtTSi8Ijpf6Qa7btLtpOgyJ6YuoOw69c8E.webp";
  const headerText = locale === 'ar' 
    ? "┘å╪¡┘å ┘å┘ü╪«╪▒ ╪¿╪¬╪╡┘å┘è╪╣ ┘ê╪¬┘ê┘ü┘è╪▒ ╪º┘ä┘à┘å╪¬╪¼╪º╪¬ ╪º┘ä╪║╪░╪º╪ª┘è╪⌐ ╪º┘ä╪╡╪¡┘è╪⌐ ┘â┘ä ┘è┘ê┘à. ╪¼┘à┘è╪╣ ┘à┘å╪¬╪¼╪º╪¬┘å╪º ┘ä╪º ╪¬╪¡╪¬┘ê┘è ╪╣┘ä┘ë ╪ú┘è ╪Ñ╪╢╪º┘ü╪º╪¬ ┘ä╪ú┘å┘å╪º ┘å╪╣╪¬┘à╪» ┘ü┘é╪╖ ╪╣┘ä┘ë ╪º┘ä┘à┘â┘ê┘å╪º╪¬ ╪º┘ä╪╖╪¿┘è╪╣┘è╪⌐. ┘ä╪»┘è┘å╪º ╪«╪╖┘ê╪╖ ╪Ñ┘å╪¬╪º╪¼ ┘à╪«╪¬┘ä┘ü╪⌐ ┘ê┘à╪¼┘à┘ê╪╣╪⌐ ┘â╪¿┘è╪▒╪⌐ ┘à┘å ╪º┘ä╪╣┘ä╪º┘à╪º╪¬ ╪º┘ä╪¬╪¼╪º╪▒┘è╪⌐ ┘ê╪º┘ä╪ú┘å┘ê╪º╪╣."
    : "We take pride in manufacturing and supplying nutritious, healthy products every day. All our products contain no additives as we depend only on natural ingredients. We have different product lines and large portfolio of brands & types";

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
    <div className="bg-[#F2E900] min-h-screen pb-20 pt-32 relative overflow-hidden">
      {/* Background Pattern - Production Style */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: `url('${headerImg}')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px'
        }} 
      />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-10" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-[url('https://oroubafoods.com/assets/img/elements/star.png')] bg-no-repeat opacity-20" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[url('https://oroubafoods.com/assets/img/elements/circle.png')] bg-no-repeat opacity-20" />
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-12 relative z-10">
        <div className={`flex items-center gap-2 font-bold text-lg md:text-xl text-[#004A99] ${locale === 'en' ? "flex-row" : "flex-row-reverse justify-end"}`}>
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{locale === 'ar' ? '╪º┘ä╪╡┘ü╪¡╪⌐ ╪º┘ä╪▒╪ª┘è╪│┘è╪⌐' : 'Home'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <Link href={`/${locale}/about/whoWeAre`} className="hover:text-white transition-colors">{locale === 'ar' ? '╪╣┘å ╪º┘ä╪╣╪▒┘ê╪¿╪⌐' : 'About Orouba'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <span className="text-[#002F59]">{locale === 'ar' ? '╪ú╪╡┘å╪º┘ü ╪º┘ä┘à┘å╪¬╪¼╪º╪¬' : 'Product Types'}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <FadeIn direction="up" className="mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-[#004A99] mb-8">
            {locale === 'ar' ? '╪ú╪╡┘å╪º┘ü ╪º┘ä┘à┘å╪¬╪¼╪º╪¬' : 'Product Types'}
          </h1>
          <p className="text-[#002F59] text-xl md:text-2xl font-medium max-w-4xl leading-relaxed">
            {headerText}
          </p>
        </FadeIn>

        {/* Alternating Category Types - One by One like the original */}
        {categoryTypes.length > 0 ? (
          <div className="space-y-32 md:space-y-48 pb-20">
            {categoryTypes.map((item: any, index: number) => {
              const isEven = index % 2 === 0;
              const flexDirection = isEven ? "md:flex-row" : "md:flex-row-reverse";

              return (
                <FadeIn key={item.id} direction={isEven ? "right" : "left"} className={`flex flex-col ${flexDirection} items-center gap-12 md:gap-24`}>
                  
                  {/* Product Image - Top Down Style */}
                  <div className="w-full md:w-1/2 flex justify-center relative">
                    {/* Decorative colored plate behind (simulated) */}
                    <div className={`absolute inset-0 scale-90 rounded-full blur-2xl opacity-20 ${index % 4 === 0 ? 'bg-purple-500' : index % 4 === 1 ? 'bg-blue-500' : index % 4 === 2 ? 'bg-orange-500' : 'bg-green-500'}`} />
                    
                    <div className="group relative w-72 h-72 md:w-[450px] md:h-[450px] transition-all duration-700 ease-out hover:rotate-6 hover:scale-110 hover:-translate-y-4 cursor-pointer">
                      {item.image ? (
                        <Image
                          src={getImageUrl(item.image) || "/placeholder.png"}
                          alt={t(locale, item.titleAr, item.titleEn)}
                          fill
                          className="object-contain drop-shadow-2xl group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[#004A99] font-bold">
                          {locale === 'ar' ? '╪¿╪»┘ê┘å ╪╡┘ê╪▒╪⌐' : 'No image'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Text & Brand Icons */}
                  <div className={`w-full md:w-1/2 flex flex-col ${isEven ? 'items-start' : 'items-start md:items-end md:text-right'}`}>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#004A99] mb-6">
                      {t(locale, item.titleAr, item.titleEn)}
                    </h2>
                    <p className="text-[#002F59] text-xl leading-relaxed mb-10 font-medium">
                      {t(locale, item.descriptionAr, item.descriptionEn)}
                    </p>

                    {/* Brand Availability Icons */}
                    <div className="flex flex-wrap items-center gap-6">
                      {item.categories?.map((catTypeCat: any) => {
                        const cat = catTypeCat.category;
                        if (!cat || !cat.brand) return null;
                        const brandLogo = catTypeCat.image || cat.brand.imageSmallMain || cat.brand.image;
                        const brandNameEn = cat.brand.nameEn || cat.brand.nameAr || 'brand';
                        const slugBrandName = brandNameEn.replace(/\s+/g, '-');
                        
                        return (
                          <Link 
                            key={catTypeCat.id}
                            href={`/${locale}/brands/${slugBrandName}/${cat.brand.id}/${cat.id}/${(cat.nameEn || cat.nameAr || 'category').replace(/\s+/g, '-')}`}
                            className="group relative block w-28 h-28 bg-transparent transition-all duration-500 hover:-translate-y-3 hover:scale-110"
                            title={`${cat.brand.nameAr} - ${cat.nameAr}`}
                          >
                            {brandLogo ? (
                              <Image 
                                src={getImageUrl(brandLogo)}
                                alt={locale === 'ar' ? cat.brand.nameAr : cat.brand.nameEn}
                                fill
                                className="object-contain brightness-100 group-hover:brightness-110 group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-500"
                                unoptimized={true}
                              />
                            ) : (
                              <span className="flex items-center justify-center w-full h-full text-xs font-bold text-[#004A99]">
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
          <div className="text-center py-40">
            <p className="text-[#004A99] text-2xl font-bold opacity-50">
              {locale === 'ar' ? "┘ä╪º ╪¬┘ê╪¼╪» ╪ú╪╡┘å╪º┘ü ┘à╪¬╪º╪¡╪⌐ ╪¡╪º┘ä┘è╪º┘ï." : "No categories available currently."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
