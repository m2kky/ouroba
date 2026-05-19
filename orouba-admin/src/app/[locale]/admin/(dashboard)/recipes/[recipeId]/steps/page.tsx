"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, ArrowRight, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface RecipeStep {
  id?: string;
  stepAr: string;
  stepEn: string;
}

export default function RecipeStepsPage() {
  const { t, dict } = useAdminTranslation();
  const params = useParams();
  const router = useRouter();
  const recipeId = params?.recipeId as string;
  
  const [steps, setSteps] = useState<RecipeStep[]>([]);
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
      const res = await fetch(`/api/admin/recipes/${recipeId}/steps`);
      if (res.ok) {
        setSteps(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch steps", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/recipes/${recipeId}/steps`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps }),
      });

      if (res.ok) {
        alert(dict.common.saveSuccess || t("تم الحفظ بنجاح", "Saved successfully"));
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save steps", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const addStep = () => {
    setSteps([...steps, { stepAr: "", stepEn: "" }]);
  };

  const updateStep = (index: number, field: keyof RecipeStep, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
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
          <h1 className="text-2xl font-bold text-gray-900">{t("خطوات التحضير", "Preparation Steps")}</h1>
          <p className="text-gray-500 mt-1">{t("إدارة خطوات التحضير الخاصة بالوصفة", "Manage preparation steps for the recipe")}</p>
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
            <h4 className="text-lg font-bold text-gray-800">{t("الخطوات الحالية", "Current Steps")}</h4>
            <button 
              type="button" 
              onClick={addStep} 
              className="text-sm flex items-center gap-1 text-orouba-blue hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl font-bold transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> 
              {t("إضافة خطوة", "Add Step")}
            </button>
          </div>

          {steps.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {t("لا توجد خطوات حالياً. انقر على إضافة خطوة للبدء.", "No steps found. Click Add Step to start.")}
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="bg-orouba-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm mt-2">
                    {idx + 1}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{t("وصف الخطوة (عربي)", "Step description (Ar)")}</label>
                      <textarea 
                        placeholder={t("وصف الخطوة (عربي)", "Step description (Ar)")} 
                        value={step.stepAr} 
                        onChange={(e) => updateStep(idx, "stepAr", e.target.value)} 
                        className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20 resize-none" 
                        rows={3} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{t("وصف الخطوة (إنجليزي)", "Step description (En)")}</label>
                      <textarea 
                        placeholder="Step description (En)" 
                        value={step.stepEn} 
                        dir="ltr" 
                        onChange={(e) => updateStep(idx, "stepEn", e.target.value)} 
                        className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orouba-blue/20 resize-none" 
                        rows={3} 
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => removeStep(idx)} 
                    className="p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors mt-2"
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
