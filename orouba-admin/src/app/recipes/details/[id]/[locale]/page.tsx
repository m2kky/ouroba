import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import RecipeBanner from "@/components/recipes/RecipeBanner";
import RecipeFeatures from "@/components/recipes/RecipeFeatures";
import RecipeAbout from "@/components/recipes/RecipeAbout";

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id: resolvedParams.id } });

  return {
    title: recipe ? `${resolvedParams.locale === "ar" ? recipe.nameAr : recipe.nameEn} | Orouba Recipes` : "الوصفة غير موجودة",
  };
}

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as "ar" | "en") || "ar";

  const recipe = await prisma.recipe.findUnique({
    where: { id: resolvedParams.id },
    include: {
      images: true,
      properties: true,
      steps: true,
    },
  });

  if (!recipe || recipe.isHidden) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50 pt-20">
        <h1 className="text-3xl font-bold text-orouba-blue mb-4">الوصفة غير موجودة</h1>
        <Link href={`/recipes/${locale}`} className="text-orouba-yellow bg-orouba-blue px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
          العودة للوصفات
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-10">
      
      {/* 1. Recipe Banner (Image/Video and Title) */}
      <RecipeBanner recipe={recipe} locale={locale} />

      {/* 2. Recipe Features (Prep Time, Servings, etc.) */}
      {recipe.properties && recipe.properties.length > 0 && (
        <RecipeFeatures properties={recipe.properties} locale={locale} />
      )}

      {/* 3. Recipe About (Ingredients and Instructions) */}
      <RecipeAbout recipe={recipe} locale={locale} />

    </div>
  );
}
