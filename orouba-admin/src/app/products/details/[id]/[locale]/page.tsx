import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import RelatedProductsSlider from "@/components/products/RelatedProductsSlider";
import RecommendedRecipesSlider from "@/components/recipes/RecommendedRecipesSlider";

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({ where: { id: resolvedParams.id } });

  return {
    title: product ? `${resolvedParams.locale === "ar" ? product.nameAr : product.nameEn} | Orouba` : "المنتج غير موجود",
    description: resolvedParams.locale === "ar" ? product?.descriptionAr : product?.descriptionEn,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
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
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">المنتج غير موجود</h1>
        <Link href="/products" className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800">
          العودة للمنتجات
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

  // Deduplicate related products
  const relatedProductsMap = new Map();
  relatedCategoryProducts.forEach(cp => {
    if (!relatedProductsMap.has(cp.product.id)) {
      relatedProductsMap.set(cp.product.id, cp.product);
    }
  });
  const relatedProducts = Array.from(relatedProductsMap.values());

  const recipes = product.recommendedRecipes.map(rr => rr.recipe);
  const primaryCategory = product.categories[0]?.category;
  const brand = primaryCategory?.brand;
  
  const productName = locale === "ar" ? product.nameAr : product.nameEn;
  const productDesc = locale === "ar" ? product.descriptionAr : product.descriptionEn;
  const mainImage = product.images[0]?.url;
  
  // Use product color for background, fallback to brand color or generic blue
  const bgColor = product.color && product.color !== "#ffffff" ? product.color : (brand?.colorHover || "#0b5394");

  return (
    <div className="bg-white min-h-screen pb-0 pt-24 md:pt-32">
      
      {/* Top Banner section with dynamic product color */}
      <div 
        className="relative w-full rounded-b-[3rem] overflow-hidden transition-colors duration-500 pb-16"
        style={{ backgroundColor: bgColor }}
      >
        {/* Subtle Background Pattern / Watermark */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://res.cloudinary.com/duovxefh6/image/upload/v1716718777/pattern-1_kozbzs.png')] bg-repeat bg-right-top bg-[length:100%]" />
        </div>

        {/* Breadcrumbs */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6 mb-8 relative z-10">
          <div className="flex items-center gap-2 font-bold text-sm md:text-base text-white/80">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">{locale === "ar" ? "الصفحة الرئيسية" : "Home"}</Link>
            <ChevronLeft className="w-4 h-4 mt-1" />
            <Link href="/products" className="hover:text-white transition-colors">{locale === "ar" ? "المنتجات" : "Products"}</Link>
            {brand && (
              <>
                <ChevronLeft className="w-4 h-4 mt-1" />
                <Link href={`/brands/${brand.id}/${locale}`} className="hover:text-white transition-colors">
                  {locale === "ar" ? brand.nameAr : brand.nameEn}
                </Link>
              </>
            )}
            {primaryCategory && (
              <>
                <ChevronLeft className="w-4 h-4 mt-1" />
                <Link href={`/brands/${brand?.id}/${primaryCategory.id}/${locale}`} className="hover:text-white transition-colors">
                  {locale === "ar" ? primaryCategory.nameAr : primaryCategory.nameEn}
                </Link>
              </>
            )}
            <ChevronLeft className="w-4 h-4 mt-1" />
            <span className="text-white drop-shadow-md">{productName}</span>
          </div>
        </div>

        {/* Product Details Container */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mt-8 md:mt-16">
            
            {/* Product Image */}
            <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
              {mainImage ? (
                <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                  <Image
                    src={mainImage.startsWith("http") ? mainImage : `https://camp-coding.site/eloroba/${mainImage}`}
                    alt={productName}
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-[300px] h-[300px] bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white/60 text-xl">لا توجد صورة</span>
                </div>
              )}
            </div>

            {/* Product Text Data */}
            <div className="w-full md:w-1/2 text-white order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-start">
              <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg leading-tight">
                {productName}
              </h1>
              
              {productDesc && (
                <div 
                  className="text-lg md:text-xl leading-relaxed text-white/90 font-medium max-w-lg drop-shadow-md"
                  dangerouslySetInnerHTML={{ __html: productDesc }}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Related Products Slider */}
      <RelatedProductsSlider 
        products={relatedProducts} 
        brand={{ id: brand?.id || "0", hoverColor: brand?.colorHover }} 
        locale={locale} 
      />

      {/* Recommended Recipes Slider */}
      {recipes.length > 0 && (
        <RecommendedRecipesSlider recipes={recipes} locale={locale} />
      )}
      
    </div>
  );
}
