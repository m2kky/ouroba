import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { sanitizeHtml } from "@/lib/sanitize";

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id: resolvedParams.id } });
  
  const isEn = resolvedParams.locale === 'en';
  return {
    title: recipe ? `${isEn ? recipe.nameEn : recipe.nameAr} | ${isEn ? 'Recipes' : 'وصفات الطبخ'}` : (isEn ? "Recipe Not Found" : "وصفة غير موجودة"),
    description: (isEn ? recipe?.descriptionEn : recipe?.descriptionAr) || (isEn ? "Read this delicious recipe from Orouba." : "اقرأ هذه الوصفة اللذيذة من العروبة."),
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;
  const locale = resolvedParams.locale;
  const isEn = locale === 'en';
  
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
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">{isEn ? 'Recipe Not Found' : 'الوصفة غير موجودة'}</h1>
        <Link href={`/${locale}/recipes`} className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
          {isEn ? 'Back to Recipes' : 'العودة للوصفات'}
        </Link>
      </div>
    );
  }

  // Sort properties so they appear in a consistent order if needed
  const cookingProps = recipe.properties || [];

  // Filter out empty steps (some legacy data has empty step rows)
  const validSteps = recipe.steps?.filter((step: any) => {
    const text = isEn ? step.stepEn : step.stepAr;
    const cleanText = text ? text.replace(/<[^>]*>?/gm, '').trim() : '';
    return cleanText.length > 0;
  }) || [];

  const mainImage = recipe.internalImage || recipe.images?.[0]?.url;

  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-32">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium ${isEn ? 'flex-row' : 'flex-row'}`}>
          <Link href={`/${locale}/recipes`} className="hover:text-orouba-blue transition-colors">{isEn ? 'Recipes' : 'وصفات الطبخ'}</Link>
          <span className={isEn ? '' : 'rotate-180'}>/</span>
          <span className="text-orouba-blue font-bold">{isEn ? recipe.nameEn : recipe.nameAr}</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 mb-8 relative">
          {mainImage ? (
            <div className="h-64 md:h-96 w-full relative overflow-hidden">
              <img 
                src={mainImage.startsWith('http') ? mainImage : `https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/${mainImage.split('/').pop()}`} 
                alt={recipe.nameAr || undefined} 
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          ) : (
            <div className="h-32 bg-blue-50 w-full"></div>
          )}
          <div className={`p-8 md:p-12 text-center relative z-10 ${mainImage ? '-mt-24 mx-4 rounded-3xl shadow-lg' : ''} bg-white`}>
            <h1 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-8">{isEn ? recipe.nameEn : recipe.nameAr}</h1>
            
            {/* Cooking Properties Grid (Moved to top inside Hero) */}
            {cookingProps.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {cookingProps.map((prop: any) => (
                  <div key={prop.id} className="bg-gray-50 rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow">
                    {prop.icon ? (
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3 mb-2 shadow-sm">
                        <img src={prop.icon} alt={isEn ? prop.titleEn : prop.titleAr} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white text-orouba-blue rounded-full flex items-center justify-center mb-2 shadow-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                    )}
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">{isEn ? prop.titleEn : prop.titleAr}</span>
                    <span className="text-orouba-blue text-xl font-black">{isEn ? prop.textEn : prop.textAr}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Description only if steps exist, otherwise description is used as steps */}
            {(validSteps.length > 0) && (isEn ? recipe.descriptionEn : recipe.descriptionAr) && (
              <div 
                className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed prose prose-lg"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml((isEn ? recipe.descriptionEn : recipe.descriptionAr) || '') }}
              />
            )}
          </div>
        </div>


        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Ingredients */}
          <div className="md:col-span-1 space-y-8">
            {/* Orouba Products Used */}
            {recipe.foods?.length > 0 && (
              <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 shadow-sm">
                <h3 className="text-2xl font-bold text-orouba-blue mb-6 border-b border-blue-200 pb-4">{isEn ? 'Our Ingredients' : 'مكوناتنا'}</h3>
                <div className="space-y-4">
                  {recipe.foods.map((rf: any) => (
                    <div key={rf.id} className="flex items-center gap-4 group cursor-default">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-2 border border-blue-200 shadow-sm transition-colors group-hover:border-orouba-yellow">
                        {rf.food?.image ? (
                          <img src={rf.food.image} alt={isEn ? rf.food.nameEn : rf.food.nameAr} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xl">🥗</span>
                        )}
                      </div>
                      <span className="font-bold text-orouba-blue group-hover:text-blue-800 transition-colors">
                        {isEn ? rf.food?.nameEn : rf.food?.nameAr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Steps */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm">
              <h3 className="text-3xl font-bold text-orouba-blue mb-10 border-b border-gray-100 pb-6">{isEn ? 'Preparation' : 'طريقة التحضير'}</h3>
              <div className="space-y-10">
                {validSteps.length > 0 ? (
                  validSteps.map((step: any, idx: number) => (
                    <div key={step.id} className="flex gap-6 relative">
                      {/* Line connector */}
                      {idx !== validSteps.length - 1 && (
                        <div className={`absolute top-14 bottom-[-40px] w-0.5 bg-gray-100 ${isEn ? 'left-6' : 'right-6'}`}></div>
                      )}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orouba-blue text-orouba-yellow flex items-center justify-center font-bold text-xl shadow-md z-10">
                        {idx + 1}
                      </div>
                      <div className="pt-2 bg-gray-50 rounded-2xl p-6 flex-grow border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-lg text-gray-700 leading-loose prose" dangerouslySetInnerHTML={{ __html: isEn ? step.stepEn : step.stepAr }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="pt-2 bg-gray-50 rounded-2xl p-6 md:p-8 flex-grow border border-gray-100">
                    <div className="text-lg text-gray-700 leading-loose prose" dangerouslySetInnerHTML={{ __html: isEn ? (recipe.descriptionEn || '') : (recipe.descriptionAr || '') }} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
