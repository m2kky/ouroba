"use client";

export const dynamic = "force-dynamic";

import AdminPageInfo from "@/components/admin/AdminPageInfo";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";
import { ArrowDown, ArrowUp, EyeOff, Plus, Save, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const HOME_RECIPE_ORDER_KEY = "home_recommended_recipe_order";
const MAX_HOME_RECIPES = 6;

interface RecipeImage {
  id: string;
  url: string;
}

interface Recipe {
  id: string;
  nameAr: string;
  nameEn: string;
  internalImage: string | null;
  isHidden: boolean;
  images: RecipeImage[];
}

const parseOrderValue = (value?: string | null) =>
  (value || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

const recipeImage = (recipe: Recipe) =>
  recipe.images?.[0]?.url || recipe.internalImage || "";

export default function HomeRecipesPage() {
  const { t } = useAdminTranslation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [recipesRes, settingsRes] = await Promise.all([
        fetch("/api/admin/recipes"),
        fetch("/api/admin/settings"),
      ]);

      if (recipesRes.ok) {
        setRecipes(await recipesRes.json());
      }

      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        const setting = settings.find((item: any) => item.key === HOME_RECIPE_ORDER_KEY);
        setSelectedIds(parseOrderValue(setting?.valueEn || setting?.valueAr));
      }
    } catch (error) {
      console.error("Failed to fetch homepage recipes data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const visibleRecipes = useMemo(
    () => recipes.filter((recipe) => !recipe.isHidden),
    [recipes]
  );
  const recipeById = useMemo(
    () => new Map(visibleRecipes.map((recipe) => [recipe.id, recipe])),
    [visibleRecipes]
  );
  const selectedRecipes = selectedIds
    .map((id) => recipeById.get(id))
    .filter(Boolean) as Recipe[];
  const selectedIdSet = new Set(selectedRecipes.map((recipe) => recipe.id));
  const filteredAvailableRecipes = visibleRecipes.filter((recipe) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      recipe.nameAr.toLowerCase().includes(term) ||
      recipe.nameEn.toLowerCase().includes(term);

    return matchesSearch && !selectedIdSet.has(recipe.id);
  });
  const hasInvalidSelectedRecipes = selectedIds.some((id) => !recipeById.has(id));

  const recipeName = (recipe: Recipe) => t(recipe.nameAr, recipe.nameEn);

  const addRecipe = (recipeId: string) => {
    if (selectedIds.includes(recipeId) || selectedRecipes.length >= MAX_HOME_RECIPES) return;
    setSelectedIds((current) => [...current.filter((id) => recipeById.has(id)), recipeId]);
  };

  const removeRecipe = (recipeId: string) => {
    setSelectedIds((current) => current.filter((id) => id !== recipeId));
  };

  const moveRecipe = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selectedRecipes.length) return;

    const nextIds = selectedRecipes.map((recipe) => recipe.id);
    [nextIds[index], nextIds[nextIndex]] = [nextIds[nextIndex], nextIds[index]];
    setSelectedIds(nextIds);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    const orderValue = selectedRecipes.map((recipe) => recipe.id).join(",");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            {
              key: HOME_RECIPE_ORDER_KEY,
              valueAr: orderValue,
              valueEn: orderValue,
              description: "Homepage recommended recipes order",
            },
          ],
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || t("تعذر حفظ الترتيب", "Failed to save order"));
        return;
      }

      alert(t("تم حفظ ترتيب وصفات الرئيسية", "Homepage recipe order saved"));
      setSelectedIds(selectedRecipes.map((recipe) => recipe.id));
    } catch (error) {
      console.error("Failed to save homepage recipes order", error);
      alert(t("تعذر حفظ الترتيب", "Failed to save order"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageInfo
        titleAr="ترتيب وصفات الرئيسية"
        titleEn="Homepage Recommended Recipes"
        descriptionAr="تحكم مستقل في الوصفات التي تظهر داخل سيكشن وصفات مقترحة في الصفحة الرئيسية فقط."
        descriptionEn="Dedicated control for the recipes shown in the homepage Recommended Recipes section only."
        prereq1Ar="اختر حتى 6 وصفات ظاهرة، ورتبها بالأزرار العلوية والسفلية."
        prereq1En="Choose up to 6 visible recipes, then arrange them with the up and down buttons."
        prereq2Ar="هذا لا يغير ترتيب صفحة الوصفات ولا ترتيب الوصفات داخل المنتجات."
        prereq2En="This does not change the recipes page order or product-related recipe ordering."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("وصفات مقترحة في الرئيسية", "Homepage Recommended Recipes")}
          </h1>
          <p className="mt-1 text-gray-500">
            {t(
              "القائمة المختارة هنا هي المصدر الوحيد لترتيب السيكشن في الصفحة الرئيسية.",
              "The selected list here controls only the homepage section order."
            )}
          </p>
        </div>
        <button
          onClick={saveOrder}
          disabled={isSaving || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orouba-blue px-5 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-orouba-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-5 w-5" />
          {isSaving ? t("جاري الحفظ...", "Saving...") : t("حفظ الترتيب", "Save Order")}
        </button>
      </div>

      {hasInvalidSelectedRecipes && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {t(
            "تم تجاهل وصفات كانت مختارة سابقاً لأنها مخفية أو محذوفة. احفظ الترتيب لتحديث القائمة.",
            "Some previously selected recipes were ignored because they are hidden or deleted. Save to refresh the list."
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orouba-blue" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {t("الترتيب الحالي", "Current Order")}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedRecipes.length}/{MAX_HOME_RECIPES}
                </p>
              </div>
            </div>

            {selectedRecipes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
                {t(
                  "لم يتم اختيار وصفات بعد. لو سبتها فاضية هيظهر آخر 6 وصفات كاحتياطي.",
                  "No recipes selected yet. If left empty, the latest 6 recipes will be used as fallback."
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedRecipes.map((recipe, index) => (
                  <div
                    key={recipe.id}
                    className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orouba-blue text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-100">
                        {recipeImage(recipe) ? (
                          <img
                            src={recipeImage(recipe)}
                            alt={recipeName(recipe)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            {t("بدون صورة", "No image")}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-gray-900">{recipeName(recipe)}</p>
                        <p className="truncate text-xs text-gray-400">{recipe.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => moveRecipe(index, -1)}
                        disabled={index === 0}
                        className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        title={t("رفع", "Move up")}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveRecipe(index, 1)}
                        disabled={index === selectedRecipes.length - 1}
                        className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        title={t("تنزيل", "Move down")}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeRecipe(recipe.id)}
                        className="rounded-lg border border-red-100 bg-white p-2 text-red-600 transition-colors hover:bg-red-50"
                        title={t("إزالة", "Remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {t("إضافة وصفة للقائمة", "Add Recipe")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("الوصفات المخفية لا تظهر هنا لأنها لن تظهر في الموقع.", "Hidden recipes are not shown here because they will not appear publicly.")}
              </p>
            </div>

            <div className="relative mb-4">
              <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 ltr:left-3 rtl:right-3" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("ابحث باسم الوصفة", "Search recipe name")}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm outline-none transition focus:border-orouba-blue focus:ring-2 focus:ring-orouba-blue/10 ltr:pl-10 ltr:pr-3 rtl:pl-3 rtl:pr-10"
              />
            </div>

            {filteredAvailableRecipes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
                {t("لا توجد وصفات متاحة للإضافة", "No available recipes to add")}
              </div>
            ) : (
              <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
                {filteredAvailableRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 ring-1 ring-gray-100">
                        {recipeImage(recipe) ? (
                          <img
                            src={recipeImage(recipe)}
                            alt={recipeName(recipe)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300">
                            <EyeOff className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <p className="truncate font-bold text-gray-800">{recipeName(recipe)}</p>
                    </div>
                    <button
                      onClick={() => addRecipe(recipe.id)}
                      disabled={selectedRecipes.length >= MAX_HOME_RECIPES}
                      className="rounded-lg bg-orouba-blue p-2 text-white transition-colors hover:bg-orouba-blue/90 disabled:cursor-not-allowed disabled:opacity-40"
                      title={t("إضافة", "Add")}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
