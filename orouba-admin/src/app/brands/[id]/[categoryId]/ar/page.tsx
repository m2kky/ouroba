import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import CategoriesSlider from "@/components/brands/CategoriesSlider";
import ProductCard from "@/components/products/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ id: string; categoryId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const brand = await prisma.brand.findUnique({ where: { id: resolvedParams.id } });
  const category = await prisma.category.findUnique({ where: { id: resolvedParams.categoryId } });

  return {
    title: brand && category ? `${brand.nameAr} | ${category.nameAr}` : "المنتجات",
    description: brand?.descriptionAr || "استكشف منتجاتنا.",
  };
}

export default async function BrandCategoryProductsPage({ params }: { params: Promise<{ id: string; categoryId: string }> }) {
  const resolvedParams = await params;
  
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
  const products = categoryProducts.map(cp => cp.product);

  if (!brand) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">العلامة التجارية غير موجودة</h1>
        <Link href="/brands" className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800">
          العودة للمنتجات
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
        activeCategoryId={resolvedParams.categoryId}
        locale="ar"
        brandColor={mainColor}
      />

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center justify-center gap-2 font-bold text-base md:text-lg text-gray-500">
          <Link href="/ar" className="hover:text-black transition-colors">الصفحة الرئيسية</Link>
          <ChevronLeft className="w-4 h-4 mt-1" />
          <Link href="/products" className="hover:text-black transition-colors">المنتجات</Link>
          <ChevronLeft className="w-4 h-4 mt-1" />
          <Link href={`/brands/${brand.id}/ar`} className="hover:text-black transition-colors">{brand.nameAr}</Link>
          <ChevronLeft className="w-4 h-4 mt-1" />
          <span className="text-black">{activeCategory?.nameAr || "الفئة غير موجودة"}</span>
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
                locale="ar"
              />
            ))}
          </div>
        ) : (
          <div className="min-h-[30vh] flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-gray-400">لا توجد منتجات في هذا القسم حالياً</h3>
          </div>
        )}
      </div>
    </div>
  );
}
