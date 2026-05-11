import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ChevronLeft, Soup } from "lucide-react";
import RecipesCategoriesSlider from "@/components/recipes/RecipesCategoriesSlider";
import FoodsSidebar from "@/components/recipes/FoodsSidebar";
import RecipeCard from "@/components/recipes/RecipeCard";

export const metadata: Metadata = {
  title: "الوصفات | Orouba Foods",
  description: "اكتشف أشهى وصفات الطبخ التي يمكنك تحضيرها بمنتجات العروبة.",
};

export default async function RecipesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; f?: string }>;
}) {
  const resolvedParams = await searchParams;
  const locale = "ar";

  // 1. Fetch Categories
  const categories = await prisma.recipeCategory.findMany({
    where: { isHidden: false },
    orderBy: { number: "asc" },
  });

  const activeCategoryId = resolvedParams.c || categories[0]?.id;
  const activeCategoryName = categories.find((c) => c.id === activeCategoryId)?.nameAr || "الوصفات";

  // 2. Fetch Foods related to the active Category
  let foods: any[] = [];
  if (activeCategoryId) {
    const categoryFoods = await prisma.recipeCategoryFood.findMany({
      where: { recipeCategoryId: activeCategoryId },
      include: { food: true },
    });
    foods = categoryFoods
      .map((cf) => cf.food)
      .filter((f) => !f.isHidden)
      .sort((a, b) => a.number - b.number);
  }

  const activeFoodId = resolvedParams.f || foods[0]?.id;

  // 3. Fetch Recipes related to the active Food
  let recipes: any[] = [];
  if (activeFoodId) {
    const recipeFoods = await prisma.recipeFood.findMany({
      where: { foodId: activeFoodId },
      include: { recipe: true },
    });
    recipes = recipeFoods
      .map((rf) => rf.recipe)
      .filter((r) => !r.isHidden)
      .sort((a, b) => a.number - b.number);
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-24 md:pt-32">
      {/* Page Header */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-orouba-blue mb-4">وصفات العروبة</h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
          ألذ الوصفات والأطباق التي يمكنك تحضيرها بسهولة باستخدام منتجاتنا الطازجة.
        </p>
      </div>

      {/* Categories Slider */}
      {categories.length > 0 && (
        <RecipesCategoriesSlider
          categories={categories}
          activeCategoryId={activeCategoryId}
          locale={locale}
        />
      )}

      {/* Main Content Area: Sidebar + Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Foods Sidebar */}
          {foods.length > 0 ? (
            <FoodsSidebar
              foods={foods}
              activeCategoryId={activeCategoryId}
              activeFoodId={activeFoodId}
              activeCategoryName={activeCategoryName}
              locale={locale}
            />
          ) : (
            <div className="w-full md:w-64 flex-shrink-0" />
          )}

          {/* Recipes Grid */}
          <div className="flex-grow w-full">
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="w-full bg-white rounded-3xl p-16 flex flex-col items-center justify-center border border-dashed border-gray-300">
                <Soup className="w-20 h-20 text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-500 mb-2">لا توجد وصفات هنا</h3>
                <p className="text-gray-400">نحن نعمل على إضافة المزيد من الوصفات قريباً.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
