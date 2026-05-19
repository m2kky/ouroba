"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, ArrowRight, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface RecipeProperty {
  id?: string;
  icon: string | null;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
}

export default function RecipePropertiesPage() {
  const { t, dict } = useAdminTranslation();
  const params = useParams();
  const router = useRouter();
  const recipeId = params?.recipeId as string;
  
  const [properties, setProperties] = useState<RecipeProperty[]>([]);
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
        setProperties(await res.json());
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

  const addProperty = () => {
    setProperties([...properties, { icon: "", titleAr: "", titleEn: "", textAr: "", textEn: "" }]);
  };

  const updateProperty = (index: number, field: keyof RecipeProperty, value: string) => {
    const newProps = [...properties];
    newProps[index] = { ...newProps[index], [field]: value };
    setProperties(newProps);
  };

  const removeProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
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
          <p className="text-gray-500 mt-1">{t("إدارة الخصائص الإضافية للوصفة (مثل: وقت الطبخ، عدد الأفراد)", "Manage extra properties for the recipe (e.g. Prep time, Servings)")}</p>
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
            <h4 className="text-lg font-bold text-gray-800">{t("الخصائص الحالية", "Current Properties")}</h4>
            <button 
              type="button" 
              onClick={addProperty} 
              className="text-sm flex items-center gap-1 text-orouba-blue hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl font-bold transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> 
              {t("إضافة خاصية", "Add Property")}
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {t("لا توجد خصائص حالياً. انقر على إضافة خاصية للبدء.", "No properties found. Click Add Property to start.")}
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((prop, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{t("العنوان (عربي)", "Title (Ar)")}</label>
                      <input type="text" placeholder={t("مثال: وقت التحضير", "e.g. Prep time")} value={prop.titleAr} onChange={(e) => updateProperty(idx, "titleAr", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{t("العنوان (إنجليزي)", "Title (En)")}</label>
                      <input type="text" placeholder="e.g. Prep time" value={prop.titleEn} dir="ltr" onChange={(e) => updateProperty(idx, "titleEn", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{t("القيمة (عربي)", "Value (Ar)")}</label>
                      <input type="text" placeholder={t("مثال: 15 دقيقة", "e.g. 15 min")} value={prop.textAr} onChange={(e) => updateProperty(idx, "textAr", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{t("القيمة (إنجليزي)", "Value (En)")}</label>
                      <input type="text" placeholder="e.g. 15 mins" value={prop.textEn} dir="ltr" onChange={(e) => updateProperty(idx, "textEn", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20" />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeProperty(idx)} 
                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors self-center mt-4"
                    title={dict.common.delete}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
