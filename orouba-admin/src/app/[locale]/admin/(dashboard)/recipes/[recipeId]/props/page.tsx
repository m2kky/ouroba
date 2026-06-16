"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ArrowRight, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";
import { normalizeRecipeProperties } from "@/lib/recipe-properties";

interface RecipeProperty {
  id?: string;
  icon: string | null;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
}

type EditableRecipePropertyField = "textAr" | "textEn";

export default function RecipePropertiesPage() {
  const { t, dict } = useAdminTranslation();
  const params = useParams();
  const router = useRouter();
  const recipeId = params?.recipeId as string;
  
  const [properties, setProperties] = useState<RecipeProperty[]>(normalizeRecipeProperties([]));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (recipeId) {
      fetchData();
    }
  }, [recipeId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/recipes/${recipeId}/props`);
      if (res.ok) {
        setProperties(normalizeRecipeProperties(await res.json()));
      }
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/recipes/${recipeId}/props`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ properties }),
      });

      if (res.ok) {
        alert(dict.common.saveSuccess || t("تم الحفظ بنجاح", "Saved successfully"));
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save properties", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateProperty = (index: number, field: EditableRecipePropertyField, value: string) => {
    const newProps = [...properties];
    newProps[index] = { ...newProps[index], [field]: value };
    setProperties(newProps);
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-medium mb-4"
      >
        <ArrowRight className="w-4 h-4" />
        {t("العودة للوصفات", "Back to Recipes")}
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("خصائص الوصفة", "Recipe Properties")}</h1>
          <p className="text-gray-500 mt-1">{t("العناوين والأيقونات ثابتة في كل الوصفات. عدّل القيم فقط لكل وصفة.", "Titles and icons are fixed for every recipe. Edit values only per recipe.")}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 bg-orouba-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? dict.common.saving : dict.common.save}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center border-b pb-4">
            <h4 className="text-lg font-bold text-gray-800">{t("قيم الخصائص الثابتة", "Fixed Property Values")}</h4>
            <span className="text-xs font-bold text-orouba-blue bg-blue-50 px-3 py-1 rounded-full">
              {t("٤ خصائص ثابتة", "4 fixed properties")}
            </span>
          </div>

          <div className="space-y-3">
            {properties.map((prop, idx) => (
              <div key={prop.icon || idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_1fr] gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t("الخاصية الثابتة", "Fixed Property")}</label>
                    <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white min-h-10">
                      {prop.icon ? (
                        <img
                          src={prop.icon}
                          alt=""
                          className="h-8 w-8 shrink-0 object-contain"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">{t(prop.titleAr, prop.titleEn)}</p>
                        <p className="text-xs text-gray-400" dir="ltr">{prop.titleEn}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t("القيمة (عربي)", "Value (Ar)")}</label>
                    <input
                      type="text"
                      placeholder={idx === 0 ? t("مثال: ٥ دقائق", "e.g. 5 mins") : t("اكتب القيمة العربية", "Enter Arabic value")}
                      value={prop.textAr}
                      onChange={(e) => updateProperty(idx, "textAr", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t("القيمة (إنجليزي)", "Value (En)")}</label>
                    <input
                      type="text"
                      placeholder={idx === 0 ? "e.g. 5 mins" : "Enter English value"}
                      value={prop.textEn}
                      dir="ltr"
                      onChange={(e) => updateProperty(idx, "textEn", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
