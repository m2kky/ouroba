import Link from "next/link";
import { getSiteData } from "@/lib/api-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "وصفات الطبخ | Orouba Foods",
  description: "وصفات لذيذة ومبتكرة محضرة باستخدام منتجاتنا الغذائية عالية الجودة.",
};

export default async function RecipesIndexPage() {
  // Fetch recipes directly using Prisma for static generation safety
  const recipes = await prisma.recipe.findMany({
    where: { isHidden: false },
    include: { images: true, properties: true },
    orderBy: { createdAt: "desc" }
  });

  // Also get categories from site-data
  const data = await getSiteData();
  const categories = data.recipeCategories || [];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-6">وصفات الطبخ</h1>
          <div className="w-24 h-1 bg-orouba-yellow mx-auto rounded-full mb-8" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            اكتشف مجموعة من الوصفات اللذيذة والملهمة التي تم ابتكارها خصيصاً باستخدام أفضل منتجاتنا.
          </p>
        </div>

        {/* Filters / Categories (Visual only for now) */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <button className="px-8 py-3 rounded-full bg-orouba-yellow text-orouba-blue font-bold shadow-md hover:bg-yellow-400 transition-colors">
              كل الوصفات
            </button>
            {categories.map((cat: any) => (
              <button key={cat.id} className="px-8 py-3 rounded-full bg-white text-gray-700 hover:bg-gray-100 font-bold shadow-sm border border-gray-200 transition-colors">
                {cat.nameAr}
              </button>
            ))}
          </div>
        )}

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe: any) => (
            <Link href={`/recipes/${recipe.id}`} key={recipe.id} className="group">
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-2">
                <div className="h-72 relative bg-gray-200 overflow-hidden">
                  {recipe.images?.[0]?.url ? (
                    <img 
                      src={recipe.images[0].url} 
                      alt={recipe.nameAr} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">لا توجد صورة</div>
                  )}
                  {recipe.properties?.find((p: any) => p.titleEn.toLowerCase().includes('time')) && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-orouba-blue text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                      <span>⏱</span> {recipe.properties.find((p: any) => p.titleEn.toLowerCase().includes('time')).textAr}
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex-grow flex flex-col text-right">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orouba-blue transition-colors">
                    {recipe.nameAr}
                  </h2>
                  <p className="text-gray-600 mb-8 line-clamp-2 leading-relaxed">
                    {recipe.descriptionAr}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between text-sm font-bold text-gray-500 border-t border-gray-100 pt-6">
                    <span className="flex items-center gap-2"><span>👥</span> {recipe.properties?.find((p: any) => p.titleEn.toLowerCase().includes('person'))?.textAr || 'متعدد'} أشخاص</span>
                    <span className="flex items-center gap-2 text-orouba-yellow group-hover:text-yellow-500 group-hover:-translate-x-1 transition-transform">
                      <span>اقرأ الوصفة</span>
                      <span className="text-lg">←</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
