import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import ProductCard from "@/components/products/ProductCard";
import RecipeCard from "@/components/recipes/RecipeCard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "نتائج البحث | العروبة" : "Search Results | Orouba",
  };
}

export default async function SearchPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }> 
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === "en" ? "en" : "ar";
  const isEn = locale === 'en';

  const resolvedSearch = await searchParams;
  const q = resolvedSearch?.q?.trim() || "";
  
  let products: any[] = [];
  let recipes: any[] = [];

  if (q) {
    // Search Products
    const dbProducts = await prisma.product.findMany({
      where: {
        isHidden: false,
        OR: [
          { nameAr: { contains: q, mode: 'insensitive' } },
          { nameEn: { contains: q, mode: 'insensitive' } },
          { descriptionAr: { contains: q, mode: 'insensitive' } },
          { descriptionEn: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        images: true,
        categories: {
          where: { isHidden: false },
          include: {
            category: {
              include: {
                brand: true
              }
            }
          }
        }
      }
    });

    // Format products for ProductCard
    products = dbProducts.map((p) => {
      // Find a valid brand/category from relations
      let brandId = null;
      let hoverColor = "#004a99"; // default
      if (p.categories && p.categories.length > 0) {
        const catRel = p.categories[0];
        if (catRel.category && catRel.category.brand) {
          brandId = catRel.category.brand.id;
          hoverColor = catRel.category.brand.colorHover || "#004a99";
        }
      }
      return {
        ...p,
        brandId,
        hoverColor
      };
    });

    // Search Recipes
    recipes = await prisma.recipe.findMany({
      where: {
        isHidden: false,
        OR: [
          { nameAr: { contains: q, mode: 'insensitive' } },
          { nameEn: { contains: q, mode: 'insensitive' } },
          { descriptionAr: { contains: q, mode: 'insensitive' } },
          { descriptionEn: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        images: true,
        properties: true,
        foods: {
          include: {
            food: {
              include: {
                brand: true
              }
            }
          }
        }
      }
    });
  }

  const hasResults = products.length > 0 || recipes.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-32 relative overflow-hidden">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-12 relative z-10">
        <div className="flex flex-wrap items-center gap-2 font-bold text-lg md:text-xl text-[#004A99]">
          <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">{isEn ? 'Home' : 'الصفحة الرئيسية'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${isEn ? 'rotate-180' : ''}`} />
          <span className="text-gray-500">{isEn ? 'Search Results' : 'نتائج البحث'}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <FadeIn direction="up" className="mb-16" style={{ textAlign: isEn ? 'left' : 'right' }}>
          <h1 className="text-3xl md:text-4xl font-bold text-[#035297] mb-4">
            {q ? (
              isEn ? `Search results for: "${q}"` : `نتائج البحث عن: "${q}"`
            ) : (
              isEn ? 'Please enter a search term' : 'يرجى إدخال كلمة للبحث'
            )}
          </h1>
        </FadeIn>

        {q && !hasResults && (
          <div className="text-center py-32 bg-white rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-blue-50 text-orouba-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <p className="text-[#035297] text-2xl font-bold mb-6">
              {isEn ? "No results found." : "لم يتم العثور على نتائج تطابق بحثك."}
            </p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {isEn ? "Try searching with different keywords or browse our product categories and recipes." : "جرب البحث بكلمات مختلفة أو تصفح أصناف المنتجات والوصفات لدينا."}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link 
                href={`/${locale}/about/ProductType`}
                className="inline-block bg-[#035297] hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-md transition-all transform hover:-translate-y-1"
              >
                {isEn ? "Browse Products" : "تصفح المنتجات"}
              </Link>
              <Link 
                href={`/${locale}/recipes`}
                className="inline-block bg-orouba-yellow hover:bg-yellow-400 text-[#035297] font-bold px-8 py-3 rounded-full shadow-md transition-all transform hover:-translate-y-1"
              >
                {isEn ? "Browse Recipes" : "تصفح الوصفات"}
              </Link>
            </div>
          </div>
        )}

        {q && hasResults && (
          <div className="space-y-20">
            
            {/* Products Section */}
            {products.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-4">
                  <h2 className="text-3xl font-bold text-orouba-blue">
                    {isEn ? 'Products' : 'المنتجات'}
                  </h2>
                  <span className="bg-blue-100 text-orouba-blue text-lg font-bold px-4 py-1 rounded-full">
                    {products.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                  {products.map((product) => (
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
              </div>
            )}

            {/* Recipes Section */}
            {recipes.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-4">
                  <h2 className="text-3xl font-bold text-orouba-blue">
                    {isEn ? 'Recipes' : 'الوصفات'}
                  </h2>
                  <span className="bg-yellow-100 text-orouba-blue text-lg font-bold px-4 py-1 rounded-full">
                    {recipes.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} locale={locale} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
