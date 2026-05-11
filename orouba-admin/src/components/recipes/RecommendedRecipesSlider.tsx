"use client";

import RecipeCard from "./RecipeCard";

interface Recipe {
  id: string;
  nameAr: string | null;
  nameEn: string | null;
  internalImage: string | null;
  videoLink: string | null;
}

interface RecommendedRecipesSliderProps {
  recipes: Recipe[];
  locale: "ar" | "en";
}

export default function RecommendedRecipesSlider({ recipes, locale }: RecommendedRecipesSliderProps) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="w-full mt-16 mb-24 bg-gray-50 py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-orouba-blue mb-2">
            {locale === "ar" ? "وصفات مقترحة" : "Recommended Recipes"}
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            {locale === "ar" 
              ? "اكتشف أشهى الوصفات التي يمكنك تحضيرها باستخدام هذا المنتج" 
              : "Discover delicious recipes you can make with this product"}
          </p>
        </div>
      </div>

      <div className="w-full overflow-hidden relative">
        <div className="flex overflow-x-auto gap-6 px-4 md:px-8 pb-10 pt-4 snap-x snap-mandatory hide-scrollbar max-w-[1400px] mx-auto">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="min-w-[280px] sm:min-w-[320px] snap-center">
              <RecipeCard recipe={recipe} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
