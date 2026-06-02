import Link from "next/link";
import prisma from "@/lib/prisma";
import { getImageUrl } from "@/lib/api-client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const isEn = resolvedParams.locale === "en";

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  return {
    title: product ? (isEn ? product.nameEn : product.nameAr) + " - Orouba" : "Product - Orouba",
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const locale = resolvedParams.locale || "ar";
  const isEn = locale === "en";
  
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      type: true,
      images: true,
      categories: {
        include: {
          category: {
            include: { brand: true }
          }
        }
      },
      recommendedRecipes: {
        include: {
          recipe: {
            include: { images: true }
          }
        }
      }
    }
  });

  if (!product || product.isHidden) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">{locale === "ar" ? "المنتج غير موجود" : "Product not found"}</h1>
      </div>
    );
  }
  
  const productName = locale === "ar" ? product.nameAr : product.nameEn;
  const productDescription = locale === "ar" ? product.descriptionAr : product.descriptionEn;
  const productTypeName = product.type ? (locale === "ar" ? product.type.nameAr : product.type.nameEn) : null;

  // Determine the primary brand from categories (if any)
  const primaryBrand = product.categories?.[0]?.category?.brand;
  const primaryBrandSlug = primaryBrand ? (primaryBrand.nameEn || primaryBrand.nameAr || "brand").replace(/\s+/g, '-') : "";

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium ${isEn ? "" : "flex-row-reverse justify-end"}`}>
          <Link href={`/${locale}/products`} className="hover:text-orouba-blue transition-colors">{locale === "ar" ? "أصناف المنتجات" : "Product Types"}</Link>
          <span className="">/</span>
          {primaryBrand && (
            <>
              <Link href={`/${locale}/brands/${primaryBrandSlug}/${primaryBrand.id}`} className="hover:text-orouba-blue transition-colors">
                {isEn ? primaryBrand.nameEn : primaryBrand.nameAr}
              </Link>
              <span className="">/</span>
            </>
          )}
          <span className="text-orouba-blue font-bold">{productName}</span>
        </div>

        <div className={`bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center ${isEn ? "" : "md:flex-row-reverse"}`}>
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div 
              className="aspect-square rounded-[2.5rem] flex items-center justify-center p-8 relative overflow-hidden shadow-inner group"
              style={{ backgroundColor: product.color || '#f9fafb' }}
            >
              {product.images?.[0]?.url ? (
                <img 
                  src={getImageUrl(product.images[0].url)} 
                  alt={productName} 
                  className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" 
                />
              ) : (
                <span className="text-gray-400 font-bold">{locale === "ar" ? "لا توجد صورة" : "No image available"}</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className={`flex gap-4 mt-6 overflow-x-auto pb-2 ${isEn ? "" : "flex-row-reverse"}`}>
                {product.images.slice(1).map((img: any) => (
                  <div key={img.id} className="w-24 h-24 flex-shrink-0 bg-white rounded-2xl border-2 border-gray-100 p-2 cursor-pointer hover:border-orouba-yellow transition-colors shadow-sm">
                    <img src={getImageUrl(img.url)} alt="Thumbnail" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={`w-full md:w-1/2 flex flex-col ${isEn ? "text-left" : "text-right"}`}>
            {productTypeName && (
              <span className={`text-sm font-bold text-orouba-blue bg-blue-50 px-4 py-1.5 rounded-full w-fit mb-6 shadow-sm border border-blue-100 ${isEn ? "" : "ml-auto"}`}>
                {productTypeName}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{productName}</h1>
            
            <div className={`text-xl font-bold text-gray-500 mb-10 flex items-center gap-2 ${isEn ? "" : "flex-row-reverse justify-end"}`}>
              <svg className="w-6 h-6 text-orouba-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              {locale === "ar" ? "الوزن / الحجم:" : "Weight / Volume:"} <span className="text-orouba-blue">{product.number}</span>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{locale === "ar" ? "الوصف" : "Description"}</h3>
              <div className="w-16 h-1 bg-orouba-yellow rounded-full mb-6 mx-0"></div>
              {productDescription ? (
                <div className="leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: productDescription }} />
              ) : (
                <p className="leading-relaxed italic">{locale === "ar" ? "لا يوجد وصف." : "No description available."}</p>
              )}
            </div>

            {/* Recipes that use this product */}
            {product.recommendedRecipes?.length > 0 && (
              <div className="mt-auto border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{locale === "ar" ? "وصفات بهذا المنتج" : "Made with this product"}</h3>
                <div className={`flex flex-wrap gap-4 ${isEn ? "justify-start" : "justify-start flex-row-reverse"}`}>
                  {product.recommendedRecipes.map((rp: any) => (
                    <Link 
                      key={rp.recipe.id} 
                      href={`/${locale}/recipes/${rp.recipe.id}`}
                      className={`flex items-center gap-4 bg-gray-50 hover:bg-white p-3 pr-6 rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-orouba-yellow group ${isEn ? "" : "flex-row-reverse"}`}
                    >
                      {rp.recipe.images?.[0]?.url && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                          <img src={getImageUrl(rp.recipe.images[0].url)} alt="Recipe" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <span className="font-bold text-sm text-gray-700 group-hover:text-orouba-blue transition-colors">{locale === "ar" ? rp.recipe.nameAr : rp.recipe.nameEn}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
