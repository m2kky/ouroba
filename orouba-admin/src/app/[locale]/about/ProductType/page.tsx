import Link from "next/link";
import Image from "next/image";
import { getSiteData, getImageUrl } from "@/lib/api-client";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import ProductCard from "@/components/products/ProductCard";
import type { Locale } from "@/lib/server-locale";
import { localizedSetting } from "@/lib/site-content";

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
  const locale: Locale = (resolvedParams.locale as any) === "en" ? "en" : "ar";

  const resolvedSearch = await searchParams;
  const q = resolvedSearch?.q?.toLowerCase().trim() || "";
  
  const data = await getSiteData();
  const categoryTypes = (data.categoryTypes || [])
    .filter((type: any) => !String(type.image || "").toLowerCase().includes("cooking-method.png"))
    .sort((a: any, b: any) => (a.number || 999) - (b.number || 999));
  const settings = data.settings || {};

  const headerImg = localizedSetting(
    settings,
    locale,
    ["product_type_img"],
    "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/8inON8KtTSi8Ijpf6Qa7btLtpOgyJ6YuoOw69c8E.webp"
  );
  const headerText = localizedSetting(
    settings,
    locale,
    ["product_type_text"],
    locale === "ar"
      ? "نحن نفخر بتصنيع وتوفير المنتجات الغذائية الصحية كل يوم. جميع منتجاتنا لا تحتوي على أي إضافات لأننا نعتمد فقط على المكونات الطبيعية. لدينا خطوط إنتاج مختلفة ومجموعة كبيرة من العلامات التجارية والأنواع."
      : "We take pride in manufacturing and supplying nutritious, healthy products every day. All our products contain no additives as we depend only on natural ingredients. We have different product lines and large portfolio of brands & types."
  );

  const fallbackProductTypesArray = [
    {
      id: "veg",
      titleEn: "Frozen Vegetables",
      titleAr: "الخضروات المجمدة",
      descriptionEn: "All our vegetables are carefully selected, washed, processed, and quick frozen to serve different needs.",
      descriptionAr: "يتم اختيار جميع خضرواتنا بعناية ثم غسلها ومعالجتها ومرورها بالتجميد السريع لتلبية الاحتياجات المختلفة.",
      image: localizedSetting(settings, locale, ["product_type_veg_image"], "icIeuiVnOAuVtHTPzWDN8D16X8aLOQ7wpGZoRIOD.webp"),
      brands: [],
    },
    {
      id: "fruits",
      titleEn: "Frozen Fruits",
      titleAr: "الفواكه المجمدة",
      descriptionEn: "Fresh fruits are selected and quick frozen to keep their nutrition values and attributes.",
      descriptionAr: "يتم اختيار الفواكه الطازجة وتجهيزها ثم تخضع للتجميد السريع للاحتفاظ بقيمتها الغذائية.",
      image: localizedSetting(settings, locale, ["product_type_fruits_image"], "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/RjhwfXqz0lYRg5WcJappDYbVqw7GxoGFpV5l7vk2.png"),
      brands: [],
    },
    {
      id: "pre-fried",
      titleEn: "Pre-Fried",
      titleAr: "النصف مقلي",
      descriptionEn: "Our famous falafel and pre-fried recipes are made for quick, easy preparation.",
      descriptionAr: "لدينا أصناف الفلافل الشهيرة ووصفاتنا النصف مقلية لتجهيز سريع وسهل.",
      image: localizedSetting(settings, locale, ["product_type_prefried_image"], "GTqYDNVWPuIlNYMzniHuxRmdwslPpj0W9bjhRGAI.webp"),
      brands: [],
    },
    {
      id: "beans",
      titleEn: "Frozen Beans & Grains",
      titleAr: "البقوليات والحبوب المجمدة",
      descriptionEn: "Beans and grains are selected and prepared to save time and effort.",
      descriptionAr: "يتم اختيار البقوليات والحبوب وتجهيزها لتوفير الوقت والجهد.",
      image: localizedSetting(settings, locale, ["product_type_beans_image"], "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/ZjhabQ8AqbF7N3nAMyekLu1DqzOfnJ6dW9tuxoor.png"),
      brands: [],
    },
  ];

  const productTypesArray = categoryTypes.length
    ? categoryTypes.map((type: any) => ({
        id: type.id,
        titleEn: type.titleEn,
        titleAr: type.titleAr,
        descriptionEn: type.descriptionEn,
        descriptionAr: type.descriptionAr,
        image: getImageUrl(type.image),
        brands: (type.categories || [])
          .map((item: any) => ({
            brandId: item.category?.brand?.id,
            catId: item.category?.id,
            logo: item.category?.brand?.imageSmallMain || item.category?.brand?.image || item.image || item.category?.image,
          }))
          .filter((item: any) => item.brandId),
      }))
    : fallbackProductTypesArray;

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
    <div className="bg-[url('/product_type.jpg')] bg-cover bg-center bg-fixed min-h-screen pb-20 pt-32 relative overflow-hidden">

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-12 relative z-10">
        <div className="flex flex-wrap items-center gap-2 font-bold text-lg md:text-xl text-[#004A99]">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{locale === 'ar' ? 'الصفحة الرئيسية' : 'Home'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <Link href={`/${locale}/about/whoWeAre`} className="hover:text-white transition-colors">{locale === 'ar' ? 'عن العروبة' : 'About Orouba'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <span className="text-[#002F59]">{locale === 'ar' ? 'أصناف المنتجات' : 'Product Types'}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <FadeIn direction="up" className={`mb-20 ${locale === 'en' ? 'text-left' : 'text-right'}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-[#035297] mb-4">
            {q ? (
              locale === 'ar' ? `نتائج البحث عن: "${q}"` : `Search results for: "${q}"`
            ) : (
              locale === 'ar' ? 'أصناف المنتجات' : 'Product Types'
            )}
          </h1>
          {!q && (
            <p className="text-[#035297] text-lg font-medium max-w-4xl leading-relaxed" style={{ marginRight: locale === 'en' ? 'auto' : '0', marginLeft: locale === 'ar' ? 'auto' : '0' }}>
              {headerText}
            </p>
          )}
        </FadeIn>

        {q ? (
          searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-20 justify-items-center">
              {searchResults.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  brand={{
                    id: product.brandId,
                    hoverColor: product.hoverColor
                  }}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <p className="text-[#035297] text-2xl font-bold opacity-60 mb-6">
                {locale === 'ar' ? "لم يتم العثور على منتجات تطابق بحثك." : "No products matched your search."}
              </p>
              <Link 
                href={`/${locale}/about/ProductType`}
                className="inline-block bg-[#035297] hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105"
              >
                {locale === 'ar' ? "عرض كل الأصناف" : "View All Categories"}
              </Link>
            </div>
          )
        ) : (
          /* Alternating Category Types - One by One like the original */
          productTypesArray.length > 0 ? (
            <div className="space-y-32 md:space-y-48 pb-20">
              {productTypesArray.map((item: any, index: number) => {
                const isEven = index % 2 === 0;
                const flexDirection = isEven ? "md:flex-row" : "md:flex-row-reverse";

                return (
                  <FadeIn key={item.id} direction={isEven ? "right" : "left"} className={`flex flex-col ${flexDirection} items-center gap-12 md:gap-24`}>
                    
                    {/* Product Image - Floating Plate */}
                    <div className="w-full md:w-1/2 flex justify-center relative">
                      <div className="group relative w-72 h-72 md:w-[450px] md:h-[450px] transition-all duration-700 ease-out hover:rotate-6 hover:scale-110 hover:-translate-y-4 cursor-pointer">
                        {item.image ? (
                          <Image
                            src={item.image.startsWith("http") ? item.image : getImageUrl(item.image)}
                            alt={locale === 'ar' ? item.titleAr : item.titleEn}
                            fill
                            className="object-contain drop-shadow-2xl group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[#035297] font-bold">
                            {locale === 'ar' ? 'بدون صورة' : 'No image'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Text & Brand Icons */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#035297] mb-4">
                        {locale === 'en' ? item.titleEn : item.titleAr}
                      </h2>
                      <p className="text-[#035297] text-base md:text-lg leading-relaxed mb-8 font-medium max-w-sm">
                        {locale === 'en' ? item.descriptionEn : item.descriptionAr}
                      </p>

                      {/* Brand Availability Icons */}
                      <div className="flex flex-wrap items-center justify-center gap-6">
                        {item.brands.map((bInfo: any, brandIndex: number) => {
                          const brandObj = data.brands?.find((b: any) => b.id === bInfo.brandId);
                          if (!brandObj) return null;
                          
                          const catObj = brandObj.categories?.find((c: any) => c.id === bInfo.catId);
                          const brandLogo = brandObj.imageSmallMain || brandObj.image;
                          const brandNameEn = brandObj.nameEn || brandObj.nameAr || 'brand';
                          const slugBrandName = brandNameEn.replace(/\s+/g, '-');
                          
                          const linkHref = catObj 
                            ? `/${locale}/brands/${slugBrandName}/${brandObj.id}/${catObj.id}/${(catObj.nameEn || catObj.nameAr || 'category').replace(/\s+/g, '-')}`
                            : `/${locale}/brands/${slugBrandName}/${brandObj.id}`;
                          
                          return (
                            <Link 
                              key={`${bInfo.brandId}-${bInfo.catId}-${brandIndex}`}
                              href={linkHref}
                              className="group relative block w-24 h-16 md:w-32 md:h-20 bg-transparent transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                              title={locale === 'ar' ? brandObj.nameAr : brandObj.nameEn}
                            >
                              {brandLogo || bInfo.logo ? (
                                <Image 
                                  src={getImageUrl(brandLogo || bInfo.logo)}
                                  alt={locale === 'ar' ? brandObj.nameAr : brandObj.nameEn}
                                  fill
                                  className="object-contain brightness-100 group-hover:brightness-110 group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-500"
                                  unoptimized={true}
                                />
                              ) : (
                                <span className="flex items-center justify-center w-full h-full text-xs font-bold text-[#035297]">
                                  {locale === 'ar' ? brandObj.nameAr : brandObj.nameEn}
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
              <p className="text-[#035297] text-2xl font-bold opacity-50">
                {locale === 'ar' ? "لا توجد أصناف متاحة حالياً." : "No categories available currently."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
