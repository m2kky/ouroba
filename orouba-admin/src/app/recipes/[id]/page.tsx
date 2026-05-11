import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id: resolvedParams.id } });
  
  return {
    title: recipe ? `${recipe.nameAr} | وصفات الطبخ` : "وصفة غير موجودة",
    description: recipe?.descriptionAr || "اقرأ هذه الوصفة اللذيذة من العروبة.",
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;
  
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      images: true,
      properties: true,
      steps: true,
      foods: {
        include: {
          food: true
        }
      }
    }
  });

  if (!recipe) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">الوصفة غير موجودة</h1>
        <Link href="/recipes" className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
          العودة للوصفات
        </Link>
      </div>
    );
  }

  // Extract metadata properties safely
  const timeProp = recipe.properties?.find(p => p.titleEn.toLowerCase().includes('time'))?.textAr;
  const personProp = recipe.properties?.find(p => p.titleEn.toLowerCase().includes('person'))?.textAr;

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <Link href="/recipes" className="hover:text-orouba-blue transition-colors">وصفات الطبخ</Link>
          <span>/</span>
          <span className="text-orouba-blue">{recipe.nameAr}</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 mb-12 relative">
          {recipe.images?.[0]?.url && (
            <div className="h-96 w-full relative overflow-hidden">
              <img 
                src={recipe.images[0].url} 
                alt={recipe.nameAr || undefined} 
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}
          <div className="p-8 md:p-12 text-center relative z-10 -mt-24 bg-white mx-4 rounded-3xl shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-6">{recipe.nameAr}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              {recipe.descriptionAr}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500">
              {timeProp && (
                <div className="flex items-center gap-2 bg-blue-50 text-orouba-blue px-6 py-3 rounded-full shadow-sm">
                  <span>⏱</span>
                  <span>{timeProp}</span>
                </div>
              )}
              {personProp && (
                <div className="flex items-center gap-2 bg-blue-50 text-orouba-blue px-6 py-3 rounded-full shadow-sm">
                  <span>👥</span>
                  <span>{personProp} أشخاص</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Ingredients */}
          <div className="md:col-span-1 space-y-8">
            {/* Orouba Products Used */}
            {recipe.foods?.length > 0 && (
              <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 shadow-sm">
                <h3 className="text-2xl font-bold text-orouba-blue mb-6 border-b border-blue-200 pb-4">مكوناتنا</h3>
                <div className="space-y-4">
                  {recipe.foods.map((rf: any) => (
                    <div key={rf.id} className="flex items-center gap-4 group cursor-default">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-2 border border-blue-200 shadow-sm transition-colors group-hover:border-orouba-yellow">
                        {rf.food?.image ? (
                          <img src={rf.food.image} alt={rf.food.nameAr} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xl">🥗</span>
                        )}
                      </div>
                      <span className="font-bold text-orouba-blue group-hover:text-blue-800 transition-colors">
                        {rf.food?.nameAr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Ingredients (Properties) */}
            {recipe.properties?.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-bold text-orouba-blue mb-6 border-b border-gray-100 pb-4">المقادير</h3>
                <ul className="space-y-4">
                  {recipe.properties.map((prop: any) => {
                    // Skip time and person as they are displayed in header
                    if (prop.titleEn.toLowerCase().includes('time') || prop.titleEn.toLowerCase().includes('person')) return null;
                    return (
                      <li key={prop.id} className="flex items-center gap-3 text-gray-700 font-medium">
                        <span className="w-2 h-2 rounded-full bg-orouba-yellow flex-shrink-0"></span>
                        <span>{prop.textAr} {prop.titleAr && <span className="text-gray-400">({prop.titleAr})</span>}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm">
              <h3 className="text-3xl font-bold text-orouba-blue mb-10 border-b border-gray-100 pb-6">طريقة التحضير</h3>
              <div className="space-y-10">
                {recipe.steps?.map((step: any, idx: number) => (
                  <div key={step.id} className="flex gap-6 relative">
                    {/* Line connector */}
                    {idx !== recipe.steps.length - 1 && (
                      <div className="absolute top-14 bottom-[-40px] right-6 w-0.5 bg-gray-100"></div>
                    )}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orouba-blue text-orouba-yellow flex items-center justify-center font-bold text-xl shadow-md z-10">
                      {idx + 1}
                    </div>
                    <div className="pt-2 bg-gray-50 rounded-2xl p-6 flex-grow border border-gray-100 hover:shadow-md transition-shadow">
                      <p className="text-lg text-gray-700 leading-loose">{step.stepAr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {recipe.videoLink && (
              <div className="mt-10 bg-orouba-blue rounded-[2rem] p-8 text-center shadow-lg">
                <h3 className="text-2xl font-bold text-orouba-yellow mb-4">فيديو الوصفة</h3>
                <a href={recipe.videoLink || undefined} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-orouba-blue font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
                  مشاهدة الفيديو 📺
                </a>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
