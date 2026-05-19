import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import RelatedProductsSlider from "@/components/products/RelatedProductsSlider";
import RecommendedRecipesSlider from "@/components/recipes/RecommendedRecipesSlider";
import { sanitizeHtml } from "@/lib/sanitize";

export async function generateMetadata({ params }: { params: Promise<{ id: string; productName: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({ where: { id: resolvedParams.id } });

  return {
    title: product ? `${resolvedParams.locale === "ar" ? product.nameAr : product.nameEn} | Orouba` : "المنتج غير موجود",
    description: resolvedParams.locale === "ar" ? product?.descriptionAr : product?.descriptionEn,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string; productName: string; locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as "ar" | "en") || "ar";

  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      images: true,
      categories: {
        include: {
          category: {
            include: { brand: true }
          }
        }
      },
      recommendedRecipes: {
        include: { recipe: true }
      }
    }
  });

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">{locale === "ar" ? "المنتج غير موجود" : "Product Not Found"}</h1>
        <Link href={`/${locale}/about/ProductType`} className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
          {locale === "ar" ? "العودة للمنتجات" : "Back to Products"}
        </Link>
      </div>
    );
  }

  // Find related products based on categories
  const categoryIds = product.categories.map(c => c.categoryId);
  const relatedCategoryProducts = await prisma.categoryProduct.findMany({
    where: {
      categoryId: { in: categoryIds },
      productId: { not: product.id },
      product: { isHidden: false }
    },
    include: { product: { include: { images: true } } },
    take: 10
  });

  // Deduplicate and sort related products
  const relatedProductsMap = new Map();
  relatedCategoryProducts.forEach(cp => {
    if (!relatedProductsMap.has(cp.product.id)) {
      relatedProductsMap.set(cp.product.id, cp.product);
    }
  });
  
  const isEn = locale === "en";
  const relatedProducts = Array.from(relatedProductsMap.values()).sort((a: any, b: any) => {
    const numA = a.number ?? 999;
    const numB = b.number ?? 999;
    if (numA !== numB) {
      return numA - numB;
    }
    const nameA = (isEn ? a.nameEn : a.nameAr) || "";
    const nameB = (isEn ? b.nameEn : b.nameAr) || "";
    return nameA.localeCompare(nameB, isEn ? "en" : "ar");
  });

  const recipes = product.recommendedRecipes.map(rr => rr.recipe);
  const primaryCategory = product.categories[0]?.category;
  const brand = primaryCategory?.brand;
  
  const productName = locale === "ar" ? product.nameAr : product.nameEn;
  const productDesc = locale === "ar" ? product.descriptionAr : product.descriptionEn;
  const mainImage = product.images[0]?.url;
  
  // Use product color for background, fallback to brand color or generic blue
  const bgColor = product.color && product.color !== "#ffffff" ? product.color : (brand?.colorHover || "#0b5394");

  // Calculate if the background color is light or dark
  const isLightColor = (hex: string) => {
    if (!hex || !hex.startsWith("#")) return true;
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 160;
  };
  
  const textColor = isLightColor(bgColor) ? "#004A99" : "#ffffff";
  const descColor = isLightColor(bgColor) ? "#002F59" : "rgba(255,255,255,0.9)";

  return (
    <div 
      className="min-h-screen pb-20 pt-24 md:pt-32 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle Background Pattern / Watermark for the entire page */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://res.cloudinary.com/duovxefh6/image/upload/v1716718777/pattern-1_kozbzs.png')] bg-repeat bg-[length:500px]" />
      </div>
      
      {/* Top Banner section */}
      <div className="relative w-full pb-16 z-10">

        {/* Breadcrumbs */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6 mb-8 relative z-10">
          <div className={`flex items-center gap-2 font-bold text-sm md:text-base opacity-80 ${locale === "en" ? "flex-row" : "flex-row-reverse justify-end"}`} style={{ color: textColor }}>
            <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">{locale === "ar" ? "الصفحة الرئيسية" : "Home"}</Link>
            <ChevronLeft className={`w-4 h-4 mt-1 ${locale === "en" ? "rotate-180" : ""}`} />
            <Link href={`/${locale}/about/ProductType`} className="hover:opacity-100 transition-opacity">{locale === "ar" ? "المنتجات" : "Products"}</Link>
            {brand && (
              <>
                <ChevronLeft className={`w-4 h-4 mt-1 ${locale === "en" ? "rotate-180" : ""}`} />
                <Link href={`/${locale}/brands/${brand.id}`} className="hover:opacity-100 transition-opacity">
                  {locale === "ar" ? brand.nameAr : brand.nameEn}
                </Link>
              </>
            )}
            {primaryCategory && (
              <>
                <ChevronLeft className={`w-4 h-4 mt-1 ${locale === "en" ? "rotate-180" : ""}`} />
                <Link href={`/${locale}/brands/${brand?.id}/${primaryCategory.id}`} className="hover:opacity-100 transition-opacity">
                  {locale === "ar" ? primaryCategory.nameAr : primaryCategory.nameEn}
                </Link>
              </>
            )}
            <ChevronLeft className={`w-4 h-4 mt-1 ${locale === "en" ? "rotate-180" : ""}`} />
            <span className="drop-shadow-sm font-black" style={{ color: textColor }}>{productName}</span>
          </div>
        </div>

        {/* Product Details Container */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mt-8 md:mt-16">
            
            {/* Product Image */}
            <FadeIn direction="up" delay={0.1} className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
              {mainImage ? (
                <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                  <Image
                    src={(mainImage.startsWith("http") || mainImage.startsWith("/")) ? mainImage : `https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/${mainImage}`}
                    alt={productName}
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-[300px] h-[300px] bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white/60 text-xl">{locale === "ar" ? "لا توجد صورة" : "No image"}</span>
                </div>
              )}
            </FadeIn>

            {/* Product Text Data */}
            <FadeIn direction="up" delay={0.2} className="w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-start">
              <h1 
                className="text-4xl md:text-6xl font-black mb-6 drop-shadow-md leading-tight"
                style={{ color: textColor }}
              >
                {productName}
              </h1>
              
              {productDesc && (
                <div 
                  className="text-lg md:text-xl leading-relaxed font-bold max-w-lg drop-shadow-sm"
                  style={{ color: descColor }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(productDesc) }}
                />
              )}
            </FadeIn>

          </div>
        </div>
      </div>

      {/* Related Products Slider */}
      <FadeIn direction="up" delay={0.3} className="relative z-10">
        <RelatedProductsSlider 
          products={relatedProducts} 
          brand={{ id: brand?.id || "0", hoverColor: brand?.colorHover }} 
          locale={locale}
          textColor={textColor}
        />
      </FadeIn>

      {/* Recommended Recipes Slider */}
      {recipes.length > 0 && (
        <FadeIn direction="up" delay={0.4}>
          <RecommendedRecipesSlider recipes={recipes} locale={locale} textColor={textColor} />
        </FadeIn>
      )}
      
    </div>
  );
}
