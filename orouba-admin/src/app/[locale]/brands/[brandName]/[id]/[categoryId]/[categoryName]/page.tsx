import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import CategoriesSlider from "@/components/brands/CategoriesSlider";
import ProductCard from "@/components/products/ProductCard";
import { getServerLocale, t } from "@/lib/server-locale";

export async function generateMetadata({ params }: { params: Promise<{ brandName: string; id: string; categoryId: string; categoryName: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const brand = await prisma.brand.findUnique({ where: { id: resolvedParams.id } });
  const category = await prisma.category.findUnique({ where: { id: resolvedParams.categoryId } });
  const isEn = resolvedParams.locale === 'en';

  return {
    title: brand && category ? `${isEn ? brand.nameEn : brand.nameAr} | ${isEn ? category.nameEn : category.nameAr}` : (isEn ? 'Products' : 'المنتجات'),
    description: (isEn ? brand?.descriptionEn : brand?.descriptionAr) || (isEn ? "Explore our products." : "استكشف منتجاتنا."),
  };
}

export default async function BrandCategoryProductsPage({ params }: { params: Promise<{ brandName: string; id: string; categoryId: string; categoryName: string; locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as "ar" | "en";
  const isEn = locale === 'en';
  
  // Parallel fetching for performance
  const [brand, categories, categoryProducts] = await Promise.all([
    prisma.brand.findUnique({ where: { id: resolvedParams.id } }),
    prisma.category.findMany({ 
      where: { brandId: resolvedParams.id, isHidden: false },
      orderBy: { number: "asc" }
    }),
    prisma.categoryProduct.findMany({
      where: { categoryId: resolvedParams.categoryId, product: { isHidden: false } },
      include: {
        product: {
          include: { images: true }
        }
      }
    })
  ]);

  const activeCategory = categories.find(c => c.id === resolvedParams.categoryId);
  const products = categoryProducts.map(cp => cp.product).sort((a, b) => {
    const numA = a.number ?? 999;
    const numB = b.number ?? 999;
    if (numA !== numB) {
      return numA - numB;
    }
    const nameA = (isEn ? a.nameEn : a.nameAr) || "";
    const nameB = (isEn ? b.nameEn : b.nameAr) || "";
    return nameA.localeCompare(nameB, isEn ? "en" : "ar");
  });

  if (!brand) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">{isEn ? 'Brand Not Found' : 'العلامة التجارية غير موجودة'}</h1>
        <Link href={`/${locale}/brands`} className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800">
          {isEn ? 'Back to Products' : 'العودة للمنتجات'}
        </Link>
      </div>
    );
  }

  // Dynamic colors mapping if needed, or default to brand hoverColor
  const themeColors: Record<string, string> = {
    "بسمة": "#8cc63f",
    "بابيتس": "#c3204e",
    "فريدة": "#0b5394",
  };
  const mainColor = brand.colorHover || themeColors[brand.nameAr] || "#0b5394";

  return (
    <div className="bg-white min-h-screen pb-20 pt-32">
      {/* Categories Slider */}
      <CategoriesSlider 
        categories={categories}
        brandId={brand.id}
        brandName={resolvedParams.brandName}
        activeCategoryId={resolvedParams.categoryId}
        locale={locale}
        brandColor={mainColor}
      />

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <div className={`flex items-center justify-center gap-2 font-bold text-base md:text-lg text-gray-500 ${isEn ? 'flex-row' : 'flex-row-reverse'}`}>
          <Link href={`/${locale}`} className="hover:text-black transition-colors">{locale === 'ar' ? 'الصفحة الرئيسية' : 'Home'}</Link>
          <ChevronLeft className={`w-4 h-4 mt-1 ${isEn ? 'rotate-180' : ''}`} />
          <Link href={`/${locale}/about/ProductType`} className="hover:text-black transition-colors">{locale === 'ar' ? 'المنتجات' : 'Products'}</Link>
          <ChevronLeft className={`w-4 h-4 mt-1 ${isEn ? 'rotate-180' : ''}`} />
          <Link href={`/${locale}/brands/${brand.id}`} className="hover:text-black transition-colors">{t(locale, brand.nameAr, brand.nameEn)}</Link>
          <ChevronLeft className={`w-4 h-4 mt-1 ${isEn ? 'rotate-180' : ''}`} />
          <span className="text-black">{t(locale, activeCategory?.nameAr, activeCategory?.nameEn) || (locale === 'ar' ? 'الفئة غير موجودة' : 'Category not found')}</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12 place-items-center">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                product={{
                  id: product.id,
                  nameAr: product.nameAr,
                  nameEn: product.nameEn,
                  images: product.images
                }}
                brand={{
                  id: brand.id,
                  hoverColor: mainColor
                }}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="min-h-[30vh] flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-gray-400">{isEn ? 'No products in this section currently' : 'لا توجد منتجات في هذا القسم حالياً'}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
