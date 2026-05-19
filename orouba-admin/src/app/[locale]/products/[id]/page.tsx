import Link from "next/link";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const locale = resolvedParams.locale || "ar";
  
  const res = await fetch(`http://localhost:3000/api/products/${productId}`, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">{locale === "ar" ? "المنتج غير موجود" : "Product not found"}</h1>
      </div>
    );
  }
  
  const { data: product } = await res.json();
  if (!product) return null;

  const productName = locale === "ar" ? product.nameAr : product.nameEn;
  const productDescription = locale === "ar" ? product.descriptionAr : product.descriptionEn;
  const productTypeName = product.type ? (locale === "ar" ? product.type.nameAr : product.type.nameEn) : null;

  return (
    <div className="bg-gray-50 min-h-screen py-16" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/brands" className="hover:text-green-600">{locale === "ar" ? "العلامات التجارية" : "Brands"}</Link>
          <span className="rtl:rotate-180">/</span>
          <span className="text-gray-900 font-medium">{productName}</span>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div 
              className="aspect-square rounded-2xl flex items-center justify-center p-8 relative overflow-hidden"
              style={{ backgroundColor: product.color || '#f9fafb' }}
            >
              {/* Optional: Add a solid color accent circle or shape if needed, but a soft pastel background matching the product's color looks very premium */}
              {product.images?.[0]?.url ? (
                <img 
                  src={product.images[0].url} 
                  alt={productName} 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <span className="text-gray-400">{locale === "ar" ? "لا توجد صورة" : "No image available"}</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                {product.images.slice(1).map((img: any) => (
                  <div key={img.id} className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200 p-2 cursor-pointer hover:border-green-500">
                    <img src={img.url} alt="Thumbnail" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            {productTypeName && (
              <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit mb-4">
                {productTypeName}
              </span>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{productName}</h1>
            
            <div className="text-xl font-medium text-gray-500 mb-8">
              {locale === "ar" ? "الوزن / الحجم:" : "Weight / Volume:"} <span className="text-gray-900">{product.number}</span>
            </div>

            <div className="prose prose-green max-w-none text-gray-600 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{locale === "ar" ? "الوصف" : "Description"}</h3>
              {productDescription ? (
                <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: productDescription }} />
              ) : (
                <p className="leading-relaxed">{locale === "ar" ? "لا يوجد وصف." : "No description available."}</p>
              )}
            </div>

            {/* Recipes that use this product */}
            {product.recipes?.length > 0 && (
              <div className="mt-auto border-t border-gray-100 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{locale === "ar" ? "وصفات بهذا المنتج" : "Made with this product"}</h3>
                <div className="flex gap-4">
                  {product.recipes.map((rp: any) => (
                    <Link 
                      key={rp.recipe.id} 
                      href={`/${locale}/recipes/${rp.recipe.id}`}
                      className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 p-3 rounded-xl border border-gray-100 transition-colors"
                    >
                      {rp.recipe.images?.[0]?.url && (
                        <img src={rp.recipe.images[0].url} alt="Recipe" className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <span className="font-semibold text-sm text-gray-700">{locale === "ar" ? rp.recipe.nameAr : rp.recipe.nameEn}</span>
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
